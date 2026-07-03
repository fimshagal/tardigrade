import { Nullable, Tardigrade } from "tardigrade-store";
export declare const useTardigradeResolver: <T>(name: string, store?: Tardigrade) => [() => Promise<void>, Nullable<T>];
