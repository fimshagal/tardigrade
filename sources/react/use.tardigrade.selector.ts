import { useEffect, useRef, useState } from "react";
import { Dictionary, Tardigrade } from "tardigrade-store";
import { useTardigradeStore } from "./context";
import { areValuesEqual } from "./value.helpers";

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

    const [selected, setSelected] = useState<T>(() => selector(targetStore.props));
    const selectedRef = useRef<T>(selected);

    useEffect(() => {
        const apply = (): void => {
            const next = selectorRef.current(targetStore.props);

            // re-render only when the selector result really changed
            if (isEqualRef.current(selectedRef.current, next)) {
                return;
            }

            selectedRef.current = next;
            setSelected(next);
        };

        // re-run in case the store changed between render and effect
        apply();

        targetStore.addListener(apply);

        return () => {
            if (!targetStore.isAlive) {
                return;
            }
            targetStore.removeListener(apply);
        };
    }, [targetStore]);

    return selected;
};
