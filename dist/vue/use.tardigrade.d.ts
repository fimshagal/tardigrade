import { Dictionary, Tardigrade, TardigradeInitialOptions } from "tardigrade-store";
export declare const useTardigrade: <S extends Dictionary = Dictionary>(initialData?: S, initialOptions?: TardigradeInitialOptions) => Tardigrade<S>;
