import { Dictionary, Tardigrade } from "tardigrade-store";
import { history, HistoryLink, HistoryOptions } from "tardigrade-store/history";
import type { TardigradeReadable, TardigradeSubscriber, TardigradeUnsubscriber } from "../../svelte/contract";

export interface TardigradeHistory<S extends Dictionary = Dictionary> extends Omit<HistoryLink<S>, "canUndo" | "canRedo"> {
    /** Svelte-readable: subscribe or use $-syntax in components */
    readonly canUndo: TardigradeReadable<boolean>;
    /** Svelte-readable: subscribe or use $-syntax in components */
    readonly canRedo: TardigradeReadable<boolean>;
}

// minimal writable flag implementing the svelte store contract, no svelte import needed
const createFlag = (initial: boolean): { set: (next: boolean) => void; readable: TardigradeReadable<boolean> } => {
    let value = initial;
    const subscribers = new Set<TardigradeSubscriber<boolean>>();

    return {
        set: (next: boolean): void => {
            if (next === value) {
                return;
            }

            value = next;
            subscribers.forEach((run) => run(value));
        },
        readable: {
            subscribe: (run: TardigradeSubscriber<boolean>): TardigradeUnsubscriber => {
                run(value);
                subscribers.add(run);
                return () => subscribers.delete(run);
            },
        },
    };
};

export const tardigradeHistory = <S extends Dictionary = Dictionary>(
    store: Tardigrade<S>,
    options?: HistoryOptions,
): TardigradeHistory<S> => {
    const link = history(store, options);

    const canUndo = createFlag(link.canUndo);
    const canRedo = createFlag(link.canRedo);

    const syncFlags = (): void => {
        canUndo.set(link.canUndo);
        canRedo.set(link.canRedo);
    };

    // auto-recorded steps (setProp outside of the facade) flip canUndo too
    const onStoreChange = (): void => syncFlags();

    store.addListener(onStoreChange);

    return {
        store,
        undo: (): boolean => {
            const done = link.undo();
            syncFlags();
            return done;
        },
        redo: (): boolean => {
            const done = link.redo();
            syncFlags();
            return done;
        },
        record: (): void => {
            link.record();
            syncFlags();
        },
        hold: (): void => link.hold(),
        unhold: (): void => {
            link.unhold();
            syncFlags();
        },
        clear: (): void => {
            link.clear();
            syncFlags();
        },
        peek: (): Dictionary => link.peek(),
        peekUndo: (): Dictionary | null => link.peekUndo(),
        peekRedo: (): Dictionary | null => link.peekRedo(),
        dispose: (): void => {
            if (store.isAlive) {
                store.removeListener(onStoreChange);
            }

            link.dispose();
        },
        canUndo: canUndo.readable,
        canRedo: canRedo.readable,
        get isHeld(): boolean {
            return link.isHeld;
        },
        get isDisposed(): boolean {
            return link.isDisposed;
        },
    };
};
