import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { history } from "../sources/history";

describe("Tardigrade history - redo branch clearing", () => {
    it("new change after undo should clear the redo branch", () => {
        const store = createTardigrade({ counter: 0 });
        const timeline = history(store);

        store.setProp("counter", 1);
        store.setProp("counter", 2);

        timeline.undo();

        (expect as any)(store.prop("counter")).toBe(1);
        (expect as any)(timeline.canRedo).toBe(true);

        store.setProp("counter", 42);

        (expect as any)(timeline.canRedo).toBe(false);
        (expect as any)(timeline.redo()).toBe(false);
        (expect as any)(store.prop("counter")).toBe(42);

        // undo path follows the new branch
        timeline.undo();
        (expect as any)(store.prop("counter")).toBe(1);

        timeline.undo();
        (expect as any)(store.prop("counter")).toBe(0);
    });

    it("clear should empty both stacks and keep the store intact", () => {
        const store = createTardigrade({ counter: 0 });
        const timeline = history(store);

        store.setProp("counter", 1);
        timeline.undo();

        (expect as any)(timeline.canRedo).toBe(true);

        timeline.clear();

        (expect as any)(timeline.canUndo).toBe(false);
        (expect as any)(timeline.canRedo).toBe(false);
        (expect as any)(store.prop("counter")).toBe(0);

        // history keeps working after clear with a fresh baseline
        store.setProp("counter", 5);

        (expect as any)(timeline.canUndo).toBe(true);
        timeline.undo();
        (expect as any)(store.prop("counter")).toBe(0);
    });
});
