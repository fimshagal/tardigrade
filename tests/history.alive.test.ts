import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { history } from "../sources/history";

describe("Tardigrade history - dead store handling", () => {
    it("undo and redo are no-op on a killed store", () => {
        const main = createTardigrade({ a: 1 });
        const target = createTardigrade({ b: 2 });

        const timeline = history(target);

        target.setProp("b", 3);

        main.merge(target); // target is killed by merge

        (expect as any)(timeline.undo()).toBe(false);
        (expect as any)(timeline.redo()).toBe(false);
    });

    it("peek returns empty object for a killed store", () => {
        const main = createTardigrade({ a: 1 });
        const target = createTardigrade({ b: 2 });

        const timeline = history(target);

        main.merge(target);

        (expect as any)(timeline.peek()).toEqual({});
    });

    it("record is no-op on a killed store", () => {
        const main = createTardigrade({ a: 1 });
        const target = createTardigrade({ b: 2 });

        const timeline = history(target);

        main.merge(target);

        timeline.record();

        (expect as any)(timeline.canUndo).toBe(false);
    });

    it("dispose on a killed store should not throw", () => {
        const main = createTardigrade({ a: 1 });
        const target = createTardigrade({ b: 2 });

        const timeline = history(target);

        main.merge(target);

        (expect as any)(() => timeline.dispose()).not.toThrow();
        (expect as any)(timeline.isDisposed).toBe(true);
    });
});
