import { Dictionary, Tardigrade } from "tardigrade-store";
import { HistoryPickFn } from "./snapshot";
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
export declare const history: <S extends Dictionary = Dictionary>(store: Tardigrade<S>, options?: HistoryOptions) => HistoryLink<S>;
