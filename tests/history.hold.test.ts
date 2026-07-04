import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { history } from "../sources/history";

describe("Tardigrade history - hold and unhold", () => {
    it("hold + bulk changes + unhold should produce a single step", () => {
        const store = createTardigrade({ a: 0, b: 0, c: 0 });
        const timeline = history(store);

        timeline.hold();

        (expect as any)(timeline.isHeld).toBe(true);

        store.setProp("a", 1);
        store.setProp("b", 2);
        store.setProp("c", 3);

        (expect as any)(timeline.canUndo).toBe(false);

        timeline.unhold();

        (expect as any)(timeline.isHeld).toBe(false);
        (expect as any)(timeline.canUndo).toBe(true);

        timeline.undo();

        (expect as any)(store.props).toEqual({ a: 0, b: 0, c: 0 });

        (expect as any)(timeline.canUndo).toBe(false);
    });

    it("unhold with no actual changes should not add a step", () => {
        const store = createTardigrade({ a: 0 });
        const timeline = history(store);

        timeline.hold();
        timeline.unhold();

        (expect as any)(timeline.canUndo).toBe(false);
    });

    it("record should keep working while held", () => {
        const store = createTardigrade({ a: 0 });
        const timeline = history(store);

        timeline.hold();
        store.setProp("a", 1);
        timeline.record(); // explicit record works even on hold

        (expect as any)(timeline.canUndo).toBe(true);

        timeline.undo();
        (expect as any)(store.prop("a")).toBe(0);
    });
});
