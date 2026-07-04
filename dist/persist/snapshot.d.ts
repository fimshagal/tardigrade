import { Dictionary } from "tardigrade-store";
export interface PersistEnvelope {
    version: number;
    data: Dictionary;
}
export type PersistPickFn = (props: Dictionary) => Dictionary;
export type PersistMigrateFn = (saved: Dictionary, fromVersion: number) => Dictionary;
export declare const buildSnapshot: (props: Dictionary, pickFn: PersistPickFn, allowlist: Set<string>) => Dictionary;
export declare const serializeEnvelope: (data: Dictionary, version: number) => string;
export declare const deserializeEnvelope: (raw: string) => PersistEnvelope;
