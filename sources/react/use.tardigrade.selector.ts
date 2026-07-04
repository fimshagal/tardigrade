import { useCallback, useRef } from "react";
import { Dictionary, Nullable, Tardigrade } from "tardigrade-store";
import { useTardigradeStore } from "./context";
import { areValuesEqual } from "./value.helpers";
import { useSyncExternalStoreCompat } from "./use.sync.external.store";

export type TardigradeSelector<T> = (props: Dictionary) => T;

export type TardigradeEqualityFn<T> = (a: T, b: T) => boolean;

export const useTardigradeSelector = <T>(
    selector: TardigradeSelector<T>,
    store?: Tardigrade<any>,
    isEqual: TardigradeEqualityFn<T> = areValuesEqual,
): T => {
    const targetStore = useTardigradeStore(store);

    // refs keep the subscription stable, so inline selectors work without useCallback
    const selectorRef = useRef(selector);
    selectorRef.current = selector;

    const isEqualRef = useRef(isEqual);
    isEqualRef.current = isEqual;

    // boxed cache: T itself may be null/undefined, the box tells "computed at least once"
    const cacheRef = useRef<Nullable<{ value: T }>>(null);

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

    const getSnapshot = (): T => {
        // killed store: keep the last rendered value, don't spam error logs
        if (!targetStore.isAlive && cacheRef.current) {
            return cacheRef.current.value;
        }

        const next = selectorRef.current(targetStore.props);

        // re-render only when the selector result really changed
        if (cacheRef.current && isEqualRef.current(cacheRef.current.value, next)) {
            return cacheRef.current.value;
        }

        cacheRef.current = { value: next };

        return next;
    };

    return useSyncExternalStoreCompat(subscribe, getSnapshot, getSnapshot);
};
