import { Dictionary, Tardigrade, TardigradeInitialOptions } from "tardigrade-store";
import { PersistLink, PersistOptions } from "tardigrade-store/persist";
export declare function persistedTardigrade<S extends Dictionary = Dictionary>(store: Tardigrade<S>, persistOptions: PersistOptions): PersistLink<S>;
export declare function persistedTardigrade<S extends Dictionary = Dictionary>(initialData: S | undefined, persistOptions: PersistOptions, initialOptions?: TardigradeInitialOptions): PersistLink<S>;
