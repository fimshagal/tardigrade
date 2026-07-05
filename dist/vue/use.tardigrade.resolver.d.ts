import type { Ref } from "vue";
import { Nullable, Tardigrade } from "tardigrade-store";
export declare const useTardigradeResolver: <T>(name: string, store?: Tardigrade<any>) => [() => Promise<void>, Ref<Nullable<T>>];
