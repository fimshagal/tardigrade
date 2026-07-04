import { Tardigrade } from "../tardigrade";
import { Dictionary, TardigradeInitialOptions } from "../lib";
export declare const createTardigrade: <S extends Dictionary = Dictionary>(initialData?: S, initialOptions?: TardigradeInitialOptions) => Tardigrade<S>;
