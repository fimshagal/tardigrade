import { getCurrentScope, onScopeDispose, shallowRef } from "vue";
import { Dictionary, Tardigrade } from "tardigrade-store";
import { history, HistoryLink, HistoryOptions } from "tardigrade-store/history";

export const useHistory = <S extends Dictionary = Dictionary>(
    store: Tardigrade<S>,
    options?: HistoryOptions,
): HistoryLink<S> => {
    const link = history(store, options);

    // canUndo/canRedo flips must be reactive; the facade getters below read these refs,
    // so templates and computeds track them without any wrapper around the store itself
    const canUndo = shallowRef(link.canUndo);
    const canRedo = shallowRef(link.canRedo);

    const syncFlags = (): void => {
        canUndo.value = link.canUndo;
        canRedo.value = link.canRedo;
    };

    // auto-recorded steps (setProp outside of the facade) flip canUndo too
    const onStoreChange = (): void => syncFlags();

    store.addListener(onStoreChange);

    if (getCurrentScope()) {
        onScopeDispose(() => {
            if (store.isAlive) {
                store.removeListener(onStoreChange);
            }

            link.dispose();
        });
    }

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
        dispose: (): void => link.dispose(),
        get canUndo(): boolean {
            return canUndo.value;
        },
        get canRedo(): boolean {
            return canRedo.value;
        },
        get isHeld(): boolean {
            return link.isHeld;
        },
        get isDisposed(): boolean {
            return link.isDisposed;
        },
    };
};
