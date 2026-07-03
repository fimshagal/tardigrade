import { useRef } from "react";
import { createTardigrade, Dictionary, Nullable, Tardigrade, TardigradeInitialOptions } from "tardigrade-store";

export const useTardigrade = (initialData?: Dictionary, initialOptions?: TardigradeInitialOptions): Tardigrade => {
    const storeRef = useRef<Nullable<Tardigrade>>(null);

    if (!storeRef.current) {
        storeRef.current = createTardigrade(initialData, initialOptions);
    }

    return storeRef.current;
};
