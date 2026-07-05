import { Nullable, Tardigrade } from "tardigrade-store";
import { TardigradeReadable } from "./contract";
export interface TardigradeResolverStore<T> extends TardigradeReadable<Nullable<T>> {
    call(): Promise<void>;
}
export declare const tardigradeResolver: <T>(store: Tardigrade<any>, name: string) => TardigradeResolverStore<T>;
