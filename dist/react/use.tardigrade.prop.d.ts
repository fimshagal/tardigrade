import { Nullable, Tardigrade } from "tardigrade-store";
export declare const useTardigradeProp: <T>(name: string, store?: Tardigrade<any>) => [Nullable<T>, (value: Nullable<T>) => void];
