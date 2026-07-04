import { Nullable, Tardigrade } from "tardigrade-store";
export declare const useTardigradeResolver: <T>(name: string, store?: Tardigrade<any>) => [() => Promise<void>, Nullable<T>];
