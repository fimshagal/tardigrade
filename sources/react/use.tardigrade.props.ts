import { useEffect, useRef, useState } from "react";
import { Dictionary, Tardigrade } from "tardigrade-store";
import { useTardigradeStore } from "./context";
import { areValuesEqual } from "./value.helpers";

export const useTardigradeProps = (store?: Tardigrade): Dictionary => {
    const targetStore = useTardigradeStore(store);

    const [props, setProps] = useState<Dictionary>(() => targetStore.props);
    const propsRef = useRef<Dictionary>(props);

    useEffect(() => {
        const applyProps = (): void => {
            // "props" getter already returns fresh clones, so only equality guard is needed
            const nextProps = targetStore.props;

            if (areValuesEqual(propsRef.current, nextProps)) {
                return;
            }

            propsRef.current = nextProps;
            setProps(nextProps);
        };

        // re-read props in case they changed between render and effect
        applyProps();

        targetStore.addListener(applyProps);

        return () => {
            if (!targetStore.isAlive) {
                return;
            }
            targetStore.removeListener(applyProps);
        };
    }, [targetStore]);

    return props;
};
