import { Dictionary } from "tardigrade-store";
export interface HistoryStack {
    push(snapshot: Dictionary): void;
    pop(): Dictionary | null;
    peek(): Dictionary | null;
    clear(): void;
    readonly size: number;
}
export declare const createStack: (limit?: number) => HistoryStack;
