import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { history } from "../sources/history";

describe("Tardigrade history - content-equal skip", () => {
    it("manual record with unchanged state should not add a step", () => {
        const store = createTardigrade({ counter: 0 });
        const timeline = history(store);

        timeline.record();
        timeline.record();

        (expect as any)(timeline.canUndo).toBe(false);
    });

    it("content-equal object update should not add a step", () => {
        const store = createTardigrade({ user: { name: "Alise" } });
        const timeline = history(store);

        // new reference, same content: core writes it, history skips the step
        store.setProp("user", { name: "Alise" });

        (expect as any)(timeline.canUndo).toBe(false);
    });

    it("same scalar setProp is skipped by core and by history", () => {
        const store = createTardigrade({ counter: 5 });
        const timeline = history(store);

        store.setProp("counter", 5);

        (expect as any)(timeline.canUndo).toBe(false);
    });

    it("equal snapshot must not clear the redo branch", () => {
        const store = createTardigrade({ counter: 0 });
        const timeline = history(store);

        store.setProp("counter", 1);
        timeline.undo();

        (expect as any)(timeline.canRedo).toBe(true);

        timeline.record(); // state equals present, no-op

        (expect as any)(timeline.canRedo).toBe(true);
        (expect as any)(timeline.redo()).toBe(true);
        (expect as any)(store.prop("counter")).toBe(1);
    });
});
