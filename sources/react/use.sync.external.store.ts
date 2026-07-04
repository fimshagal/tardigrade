import * as React from "react";
import { useEffect, useRef, useState } from "react";

export type StoreSubscribe = (onStoreChange: () => void) => () => void;

/**
 * Fallback for react 16.8–17 (simplified official use-sync-external-store shim):
 * reads the snapshot on render, re-checks it after subscription and on every
 * store notification, forcing an update when the reference changed.
 *
 * Snapshot getters in this bridge are cached with content equality, so the
 * Object.is check below is a reliable "changed" signal.
 */
const useSyncExternalStoreFallback = <T>(subscribe: StoreSubscribe, getSnapshot: () => T): T => {
    const value = getSnapshot();
    const [, forceUpdate] = useState(0);

    const instRef = useRef({ value, getSnapshot });
    instRef.current.value = value;
    instRef.current.getSnapshot = getSnapshot;

    useEffect(() => {
        const checkForUpdates = (): void => {
            const inst = instRef.current;
            const next = inst.getSnapshot();

            if (!Object.is(inst.value, next)) {
                forceUpdate((tick) => tick + 1);
            }
        };

        // the store may have changed between render and subscription
        checkForUpdates();

        return subscribe(checkForUpdates);
    }, [subscribe]);

    return value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nativeUseSyncExternalStore = (React as any).useSyncExternalStore as
    | (<T>(subscribe: StoreSubscribe, getSnapshot: () => T, getServerSnapshot?: () => T) => T)
    | undefined;

export const useSyncExternalStoreCompat: <T>(
    subscribe: StoreSubscribe,
    getSnapshot: () => T,
    getServerSnapshot?: () => T,
) => T = nativeUseSyncExternalStore ?? useSyncExternalStoreFallback;
