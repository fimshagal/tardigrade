import { Dictionary } from "tardigrade-store";

export interface PersistEnvelope {
    version: number;
    data: Dictionary;
}

export type PersistPickFn = (props: Dictionary) => Dictionary;

export type PersistMigrateFn = (saved: Dictionary, fromVersion: number) => Dictionary;

export const buildSnapshot = (props: Dictionary, pickFn: PersistPickFn, allowlist: Set<string>): Dictionary => {
    const picked = pickFn(props);

    if (!allowlist.size) {
        return picked;
    }

    const result: Dictionary = {};

    for (const key of allowlist) {
        if (key in picked) {
            result[key] = picked[key];
        }
    }

    return result;
};

export const serializeEnvelope = (data: Dictionary, version: number): string =>
    JSON.stringify({ version, data } as PersistEnvelope);

export const deserializeEnvelope = (raw: string): PersistEnvelope => {
    const parsed = JSON.parse(raw);

    const isMalformed = !parsed
        || typeof parsed !== "object"
        || typeof parsed.version !== "number"
        || !parsed.data
        || typeof parsed.data !== "object";

    if (isMalformed) {
        throw new Error("Tardigrade persist: malformed envelope in storage");
    }

    return parsed as PersistEnvelope;
};
