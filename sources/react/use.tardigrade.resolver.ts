import { useCallback, useEffect, useState } from "react";
import { Nullable, Tardigrade } from "tardigrade-store";
import { useTardigradeStore } from "./context";

export const useTardigradeResolver = <T>(name: string, store?: Tardigrade): [() => Promise<void>, Nullable<T>] => {
    const targetStore = useTardigradeStore(store);

    const [value, setValue] = useState<Nullable<T>>(null);

    useEffect(() => {
        // global listener catches resolver calls even for resolvers added after mount
        const handler = (updatedName: string, updatedValue: Nullable<T>): void => {
            if (updatedName !== name) {
                return;
            }
            setValue(updatedValue);
        };

        targetStore.addListener(handler);

        return () => {
            if (!targetStore.isAlive) {
                return;
            }
            targetStore.removeListener(handler);
        };
    }, [targetStore, name]);

    const callResolver = useCallback((): Promise<void> => targetStore.callResolver(name), [targetStore, name]);

    return [callResolver, value];
};
