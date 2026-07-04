import { Dictionary } from "tardigrade-store";

export interface HistoryStack {
    push(snapshot: Dictionary): void;
    pop(): Dictionary | null;
    peek(): Dictionary | null;
    clear(): void;
    readonly size: number;
}

export const createStack = (limit: number = Infinity): HistoryStack => {
    const items: Dictionary[] = [];

    return {
        push: (snapshot: Dictionary): void => {
            items.push(snapshot);

            while (items.length > limit) {
                items.shift();
            }
        },
        pop: (): Dictionary | null => items.pop() ?? null,
        peek: (): Dictionary | null => (items.length ? items[items.length - 1] : null),
        clear: (): void => {
            items.length = 0;
        },
        get size(): number {
            return items.length;
        },
    };
};
