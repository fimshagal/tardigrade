import { useRef } from "react";
import { createTardigrade, Dictionary, Nullable, Tardigrade, TardigradeInitialOptions } from "tardigrade-store";

export const useTardigrade = <S extends Dictionary = Dictionary>(initialData?: S, initialOptions?: TardigradeInitialOptions): Tardigrade<S> => {
    const storeRef = useRef<Nullable<Tardigrade<S>>>(null);

    if (!storeRef.current) {
        storeRef.current = createTardigrade<S>(initialData, initialOptions);
    }

    return storeRef.current;
};
