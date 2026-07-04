import { Dictionary, Tardigrade } from "tardigrade-store";
import { cloneSnapshot, HistoryPickFn, snapshotsEqual, takeSnapshot } from "./snapshot";
import { createStack } from "./stack";
import { restoreSnapshot } from "./restore";

export interface HistoryOptions {
    /** Max undo steps. Older steps are dropped. Default: 50 */
    limit?: number;
    /** Record the initial snapshot right away on history(). Default: true */
    recordOnStart?: boolean;
    /** Props selection applied before every record. Default: all props */
    pick?: HistoryPickFn;
    /** Called after undo with the restored snapshot */
    onUndo?: (props: Dictionary) => void;
    /** Called after redo with the restored snapshot */
    onRedo?: (props: Dictionary) => void;
}

export interface HistoryLink<S extends Dictionary = Dictionary> {
    readonly store: Tardigrade<S>;
    /** Rolls back one step. Returns false when there is nothing to undo */
    undo(): boolean;
    /** Replays an undone step. Returns false when there is nothing to redo */
    redo(): boolean;
    /** Records the current snapshot as a new step manually */
    record(): void;
    /** Suspends auto-record (useful for bulk operations) */
    hold(): void;
    /** Resumes auto-record and records the current state as a single step */
    unhold(): void;
    /** Empties undo and redo stacks, doesn't touch the store */
    clear(): void;
    /** Current picked snapshot, doesn't change the store */
    peek(): Dictionary;
    /** Snapshot the next undo() would restore, or null */
    peekUndo(): Dictionary | null;
    /** Snapshot the next redo() would restore, or null */
    peekRedo(): Dictionary | null;
    readonly canUndo: boolean;
    readonly canRedo: boolean;
    readonly isHeld: boolean;
    readonly isDisposed: boolean;
    /** Detaches auto-record from the store, drops the stacks */
    dispose(): void;
}

export const history = <S extends Dictionary = Dictionary>(store: Tardigrade<S>, options?: HistoryOptions): HistoryLink<S> => {
    const {
        limit = 50,
        recordOnStart = true,
        pick = (props: Dictionary): Dictionary => props,
        onUndo,
        onRedo,
    } = options ?? {};

    // past/present/future model: "present" is the last recorded snapshot,
    // past keeps only earlier states, so canUndo/peekUndo read the stacks directly
    const past = createStack(limit);
    const future = createStack();

    let present: Dictionary = {};
    let hasBaseline = false;

    let held = false;
    let disposed = false;
    let restoring = false;

    const peek = (): Dictionary => {
        if (!store.isAlive) {
            return {};
        }

        return takeSnapshot(store, pick);
    };

    const record = (): void => {
        if (disposed || !store.isAlive) {
            return;
        }

        const next = peek();

        // very first record only establishes the baseline, there is no "before" to undo to
        if (!hasBaseline) {
            present = next;
            hasBaseline = true;
            return;
        }

        // content-equal snapshot: no new step, redo branch survives
        if (snapshotsEqual(next, present)) {
            return;
        }

        past.push(present);
        present = next;
        future.clear();
    };

    const applySnapshot = (target: Dictionary, current: Dictionary): void => {
        restoring = true;

        try {
            restoreSnapshot(store, target, current);
        } finally {
            restoring = false;
        }

        present = target;
    };

    const onStoreChange = (name: string | string[]): void => {
        if (held || restoring || disposed) {
            return;
        }

        // resolver calls also reach global listeners; their name isn't a prop, nothing to record
        if (typeof name === "string" && !store.hasProp(name)) {
            return;
        }

        record();
    };

    const link: HistoryLink<S> = {
        store,
        undo: (): boolean => {
            if (!store.isAlive || !past.size) {
                return false;
            }

            // live state (not "present") goes to redo, so unrecorded drift isn't lost
            const current = peek();
            const target = past.pop()!;

            future.push(current);
            applySnapshot(target, current);
            onUndo?.(target);

            return true;
        },
        redo: (): boolean => {
            if (!store.isAlive || !future.size) {
                return false;
            }

            const current = peek();
            const target = future.pop()!;

            past.push(current);
            applySnapshot(target, current);
            onRedo?.(target);

            return true;
        },
        record,
        hold: (): void => {
            held = true;
        },
        unhold: (): void => {
            held = false;
            record();
        },
        clear: (): void => {
            past.clear();
            future.clear();
            // re-baseline: the pre-clear "present" must not leak into the next record
            present = peek();
            hasBaseline = true;

            // store.reset() drops all global listeners including auto-record,
            // so clear() re-attaches it (removeListener first keeps it single)
            if (!disposed && store.isAlive) {
                store.removeListener(onStoreChange);
                store.addListener(onStoreChange);
            }
        },
        peek,
        peekUndo: (): Dictionary | null => {
            const top = past.peek();
            return top ? cloneSnapshot(top) : null;
        },
        peekRedo: (): Dictionary | null => {
            const top = future.peek();
            return top ? cloneSnapshot(top) : null;
        },
        dispose: (): void => {
            if (disposed) {
                return;
            }

            disposed = true;

            if (store.isAlive) {
                store.removeListener(onStoreChange);
            }

            past.clear();
            future.clear();
        },
        get canUndo(): boolean {
            return past.size > 0;
        },
        get canRedo(): boolean {
            return future.size > 0;
        },
        get isHeld(): boolean {
            return held;
        },
        get isDisposed(): boolean {
            return disposed;
        },
    };

    if (recordOnStart) {
        record();
    }

    store.addListener(onStoreChange);

    return link;
};
