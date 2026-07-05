import type { WritableComputedRef } from "vue";
import { Nullable, Tardigrade } from "tardigrade-store";
export declare const useTardigradeProp: <T>(name: string, store?: Tardigrade<any>) => WritableComputedRef<Nullable<T>>;
