import { useCallback, useEffect, useRef, useState } from "react";
import { Nullable, Tardigrade } from "tardigrade-store";
import { useTardigradeStore } from "./context";
import { areValuesEqual, cloneValue } from "./value.helpers";

export const useTardigradeProp = <T>(name: string, store?: Tardigrade<any>): [Nullable<T>, (value: Nullable<T>) => void] => {
    const targetStore = useTardigradeStore(store);

    const [value, setValue] = useState<Nullable<T>>(() => (targetStore.hasProp(name) ? targetStore.prop(name) : null));
    const valueRef = useRef<Nullable<T>>(value);

    useEffect(() => {
        const applyValue = (nextValue: Nullable<T>): void => {
            // skip content-equal objects to keep referential stability and avoid extra re-renders
            if (areValuesEqual(valueRef.current, nextValue)) {
                return;
            }

            // clone to never hold store's internal reference in react state
            const clonedValue = cloneValue(nextValue);

            valueRef.current = clonedValue;
            setValue(clonedValue);
        };

        // re-read value in case it changed between render and effect
        applyValue(targetStore.hasProp(name) ? targetStore.prop(name) : null);

        // global listener catches updates even for props added after mount
        const handler = (updatedName: string, updatedValue: Nullable<T>): void => {
            if (updatedName !== name) {
                return;
            }
            applyValue(updatedValue);
        };

        targetStore.addListener(handler);

        return () => {
            if (!targetStore.isAlive) {
                return;
            }
            targetStore.removeListener(handler);
        };
    }, [targetStore, name]);

    const setProp = useCallback((nextValue: Nullable<T>): void => {
        targetStore.setProp(name, nextValue);
    }, [targetStore, name]);

    return [value, setProp];
};
