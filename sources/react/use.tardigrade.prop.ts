import { useCallback, useRef } from "react";
import { Nullable, Tardigrade } from "tardigrade-store";
import { useTardigradeStore } from "./context";
import { areValuesEqual } from "./value.helpers";
import { useSyncExternalStoreCompat } from "./use.sync.external.store";

export const useTardigradeProp = <T>(name: string, store?: Tardigrade<any>): [Nullable<T>, (value: Nullable<T>) => void] => {
    const targetStore = useTardigradeStore(store);

    // snapshot cache: getSnapshot must return a stable reference between changes,
    // while store.prop() returns a fresh clone on every read
    const cacheRef = useRef<Nullable<T>>(null);
    const primedRef = useRef(false);

    const subscribe = useCallback((onStoreChange: () => void): (() => void) => {
        // global listener catches updates even for props added after mount;
        // batched setProps updates arrive as (names[], values dictionary)
        const handler = (updatedName: string | string[]): void => {
            const isRelevant = Array.isArray(updatedName)
                ? updatedName.includes(name)
                : updatedName === name;

            if (isRelevant) {
                onStoreChange();
            }
        };

        targetStore.addListener(handler);

        return () => {
            if (!targetStore.isAlive) {
                return;
            }
            targetStore.removeListener(handler);
        };
    }, [targetStore, name]);

    const getSnapshot = (): Nullable<T> => {
        // killed store: keep the last rendered value, don't spam error logs
        if (!targetStore.isAlive) {
            return cacheRef.current;
        }

        // prop() clones complex values, so react never holds store's internal reference
        const fresh = targetStore.hasProp(name) ? (targetStore.prop(name) as Nullable<T>) : null;

        // skip content-equal objects to keep referential stability and avoid extra re-renders
        if (primedRef.current && areValuesEqual(cacheRef.current, fresh)) {
            return cacheRef.current;
        }

        cacheRef.current = fresh;
        primedRef.current = true;

        return cacheRef.current;
    };

    const value = useSyncExternalStoreCompat(subscribe, getSnapshot, getSnapshot);

    const setProp = useCallback((nextValue: Nullable<T>): void => {
        targetStore.setProp(name, nextValue);
    }, [targetStore, name]);

    return [value, setProp];
};
