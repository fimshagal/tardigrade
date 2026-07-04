import { Dictionary, Tardigrade } from "tardigrade-store";
import { createDefaultStorage, PersistStorage } from "./storage";
import {
    buildSnapshot,
    deserializeEnvelope,
    PersistMigrateFn,
    PersistPickFn,
    serializeEnvelope,
} from "./snapshot";
import { rehydrate } from "./rehydrate";

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

export const persist = <S extends Dictionary = Dictionary>(store: Tardigrade<S>, options: PersistOptions): PersistLink<S> => {
    const {
        key,
        storage = createDefaultStorage(),
        saveAfter = 300,
        restoreOnStart = true,
        version = 1,
        migrate,
        onRestore,
        onSave,
        onError = (error: unknown): void => console.warn("Tardigrade persist:", error),
    } = options;

    let pickFn: PersistPickFn = options.pick ?? ((props: Dictionary): Dictionary => props);

    const allowlist = new Set<string>();

    let held = false;
    let disposed = false;
    let restoring = false;
    let saveTimer: ReturnType<typeof setTimeout> | null = null;

    const cancelPendingSave = (): void => {
        if (saveTimer !== null) {
            clearTimeout(saveTimer);
            saveTimer = null;
        }
    };

    const peek = (): Dictionary => {
        if (!store.isAlive) {
            return {};
        }

        return buildSnapshot(store.props, pickFn, allowlist);
    };

    const save = (): void => {
        cancelPendingSave();

        if (!store.isAlive) {
            onError(new Error(`Tardigrade persist: can't save, store "${String(store.name)}" isn't alive`));
            return;
        }

        try {
            const snapshot = peek();
            storage.write(key, serializeEnvelope(snapshot, version));
            onSave?.(snapshot);
        } catch (error) {
            onError(error);
        }
    };

    const restore = (): void => {
        if (!store.isAlive) {
            onError(new Error(`Tardigrade persist: can't restore, store "${String(store.name)}" isn't alive`));
            return;
        }

        try {
            const raw = storage.read(key);

            if (raw === null) {
                return;
            }

            const envelope = deserializeEnvelope(raw);

            let data = envelope.data;
            const savedVersion = envelope.version ?? 1;

            if (savedVersion < version && migrate) {
                data = migrate(data, savedVersion);
            }

            // suppress auto-save echo: rehydration itself must not schedule a write-back
            restoring = true;

            try {
                rehydrate(store, data);
            } finally {
                restoring = false;
            }

            onRestore?.(data);
        } catch (error) {
            restoring = false;
            onError(error);
        }
    };

    const scheduleSave = (): void => {
        if (held || disposed || restoring) {
            return;
        }

        if (saveAfter === 0) {
            save();
            return;
        }

        cancelPendingSave();
        saveTimer = setTimeout(save, saveAfter);
    };

    const onStoreChange = (name: string | string[]): void => {
        // resolver calls also reach global listeners; their name isn't a prop, nothing to save
        if (typeof name === "string" && !store.hasProp(name)) {
            return;
        }

        scheduleSave();
    };

    const link: PersistLink<S> = {
        store,
        save,
        restore,
        forget: (): void => {
            try {
                storage.remove(key);
            } catch (error) {
                onError(error);
            }
        },
        hold: (): void => {
            held = true;
            cancelPendingSave();
        },
        unhold: (): void => {
            held = false;
            save();
        },
        retain: (propName: string): void => {
            allowlist.add(propName);
        },
        drop: (propName: string): void => {
            allowlist.delete(propName);
        },
        pick: (fn: PersistPickFn): void => {
            pickFn = fn;
        },
        peek,
        dispose: (): void => {
            if (disposed) {
                return;
            }

            disposed = true;
            cancelPendingSave();

            if (store.isAlive) {
                store.removeListener(onStoreChange);
            }
        },
        get isHeld(): boolean {
            return held;
        },
        get isDisposed(): boolean {
            return disposed;
        },
    };

    if (restoreOnStart) {
        restore();
    }

    store.addListener(onStoreChange);

    return link;
};
