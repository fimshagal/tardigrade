import { Dictionary, Tardigrade } from "tardigrade-store";
import { PersistStorage } from "./storage";
import { PersistMigrateFn, PersistPickFn } from "./snapshot";
export interface PersistOptions {
    /** Unique storage key. Required */
    key: string;
    /** Storage adapter. Default: localStorage in browser, in-memory map elsewhere */
    storage?: PersistStorage;
    /** Props selection applied on save only. Default: all props */
    pick?: PersistPickFn;
    /** Auto-save debounce in ms. 0 means synchronous save. Default: 300 */
    saveAfter?: number;
    /** Restore from storage right away on persist(). Default: true */
    restoreOnStart?: boolean;
    /** Snapshot schema version. Default: 1 */
    version?: number;
    /** Transforms saved data when stored version is lower than options.version */
    migrate?: PersistMigrateFn;
    onRestore?: (saved: Dictionary) => void;
    onSave?: (saved: Dictionary) => void;
    /** Default: console.warn */
    onError?: (error: unknown) => void;
}
export interface PersistLink<S extends Dictionary = Dictionary> {
    readonly store: Tardigrade<S>;
    /** Writes current snapshot into storage right now, works even on hold */
    save(): void;
    /** Reads storage, migrates if needed and merges data into the store */
    restore(): void;
    /** Removes the key from storage, doesn't touch the store */
    forget(): void;
    /** Suspends auto-save (useful for bulk operations) */
    hold(): void;
    /** Resumes auto-save and saves immediately */
    unhold(): void;
    /** Adds prop name to the allowlist (applied on top of pick) */
    retain(key: string): void;
    /** Removes prop name from the allowlist */
    drop(key: string): void;
    /** Replaces the pick function at runtime */
    pick(fn: PersistPickFn): void;
    /** Returns the snapshot that would be written right now, without writing */
    peek(): Dictionary;
    readonly isHeld: boolean;
    readonly isDisposed: boolean;
    /** Detaches auto-save from the store. Explicit save/restore keep working */
    dispose(): void;
}
export declare const persist: <S extends Dictionary = Dictionary>(store: Tardigrade<S>, options: PersistOptions) => PersistLink<S>;
