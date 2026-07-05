import { Dictionary, Tardigrade } from "tardigrade-store";
import { TardigradeReadable } from "./contract";
export type TardigradeSelector<T> = (props: Dictionary) => T;
export type TardigradeEqualityFn<T> = (a: T, b: T) => boolean;
export declare const tardigradeSelector: <T>(store: Tardigrade<any>, selector: TardigradeSelector<T>, isEqual?: TardigradeEqualityFn<T>) => TardigradeReadable<T>;
