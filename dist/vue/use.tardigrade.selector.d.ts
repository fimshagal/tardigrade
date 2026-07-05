import type { Ref } from "vue";
import { Dictionary, Tardigrade } from "tardigrade-store";
export type TardigradeSelector<T> = (props: Dictionary) => T;
export type TardigradeEqualityFn<T> = (a: T, b: T) => boolean;
export declare const useTardigradeSelector: <T>(selector: TardigradeSelector<T>, store?: Tardigrade<any>, isEqual?: TardigradeEqualityFn<T>) => Ref<T>;
