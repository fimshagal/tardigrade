import { Dictionary, Tardigrade } from "tardigrade-store";
export type HistoryPickFn = (props: Dictionary) => Dictionary;
export declare const takeSnapshot: (store: Tardigrade<any>, pickFn: HistoryPickFn) => Dictionary;
export declare const cloneSnapshot: (snapshot: Dictionary) => Dictionary;
export declare const snapshotsEqual: (a: Dictionary, b: Dictionary) => boolean;
