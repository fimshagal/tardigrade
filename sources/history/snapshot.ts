import { Dictionary, Tardigrade } from "tardigrade-store";

export type HistoryPickFn = (props: Dictionary) => Dictionary;

// store.props getter already returns fresh clones, so the picked snapshot is detached from store internals
export const takeSnapshot = (store: Tardigrade<any>, pickFn: HistoryPickFn): Dictionary => pickFn(store.props);

export const cloneSnapshot = (snapshot: Dictionary): Dictionary => {
    if (typeof structuredClone === "function") {
        return structuredClone(snapshot);
    }

    return JSON.parse(JSON.stringify(snapshot));
};

// props are json-friendly by core contract, so string comparison is a valid content-equality check
export const snapshotsEqual = (a: Dictionary, b: Dictionary): boolean =>
    JSON.stringify(a) === JSON.stringify(b);
