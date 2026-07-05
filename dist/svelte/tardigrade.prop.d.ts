import { Nullable, Tardigrade } from "tardigrade-store";
import { TardigradeWritable } from "./contract";
export declare const tardigradeProp: <T>(store: Tardigrade<any>, name: string) => TardigradeWritable<Nullable<T>>;
