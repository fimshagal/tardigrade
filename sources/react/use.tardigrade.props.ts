import { useCallback, useRef } from "react";
import { Dictionary, Nullable, Tardigrade } from "tardigrade-store";
import { useTardigradeStore } from "./context";
import { areValuesEqual } from "./value.helpers";
import { useSyncExternalStoreCompat } from "./use.sync.external.store";

export const useTardigradeProps = (store?: Tardigrade<any>): Dictionary => {
    const targetStore = useTardigradeStore(store);

    // snapshot cache: getSnapshot must return a stable reference between changes,
    // while the "props" getter returns fresh clones on every read
    const cacheRef = useRef<Nullable<Dictionary>>(null);

    const subscribe = useCallback((onStoreChange: () => void): (() => void) => {
        const handler = (): void => onStoreChange();

        targetStore.addListener(handler);

        return () => {
            if (!targetStore.isAlive) {
                return;
            }
            targetStore.removeListener(handler);
        };
    }, [targetStore]);

    const getSnapshot = (): Dictionary => {
        // killed store: keep the last rendered snapshot, don't spam error logs
        if (!targetStore.isAlive) {
            return cacheRef.current ?? {};
        }

        const fresh = targetStore.props;

        // content-equal snapshot keeps the previous reference: no extra re-renders
        if (cacheRef.current && areValuesEqual(cacheRef.current, fresh)) {
            return cacheRef.current;
        }

        cacheRef.current = fresh;

        return fresh;
    };

    return useSyncExternalStoreCompat(subscribe, getSnapshot, getSnapshot);
};
