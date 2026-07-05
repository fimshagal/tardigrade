import { createTardigrade, Dictionary, Tardigrade, TardigradeInitialOptions } from "tardigrade-store";

// setup() runs once per component instance, so a plain create is already component-scoped
export const useTardigrade = <S extends Dictionary = Dictionary>(initialData?: S, initialOptions?: TardigradeInitialOptions): Tardigrade<S> =>
    createTardigrade<S>(initialData, initialOptions);
