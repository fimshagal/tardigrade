import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { history } from "../sources/history";

describe("Tardigrade history - limit", () => {
    it("should shift the oldest step when limit is exceeded", () => {
        const store = createTardigrade({ counter: 0 });
        const timeline = history(store, { limit: 3 });

        for (let value = 1; value <= 10; value++) {
            store.setProp("counter", value);
        }

        // only the last 3 steps survive
        (expect as any)(timeline.undo()).toBe(true);
        (expect as any)(store.prop("counter")).toBe(9);

        (expect as any)(timeline.undo()).toBe(true);
        (expect as any)(store.prop("counter")).toBe(8);

        (expect as any)(timeline.undo()).toBe(true);
        (expect as any)(store.prop("counter")).toBe(7);

        (expect as any)(timeline.undo()).toBe(false);
        (expect as any)(store.prop("counter")).toBe(7);
    });

    it("redo should stay complete after partial undo within limit", () => {
        const store = createTardigrade({ counter: 0 });
        const timeline = history(store, { limit: 2 });

        store.setProp("counter", 1);
        store.setProp("counter", 2);
        store.setProp("counter", 3);

        timeline.undo();
        timeline.undo();

        (expect as any)(store.prop("counter")).toBe(1);

        timeline.redo();
        timeline.redo();

        (expect as any)(store.prop("counter")).toBe(3);
    });
});
