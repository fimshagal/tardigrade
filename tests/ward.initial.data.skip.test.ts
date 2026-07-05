import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { ward } from "../sources/ward";

describe("Tardigrade ward - initial data is baseline", () => {
    it("initial props are not affected by rules added later", () => {
        // initial data lands before any ward link can exist: it's the baseline state
        const store = createTardigrade({ counter: -1 });

        const guard = ward(store);

        guard.addRule("counter", (value) => {
            if (typeof value === "number" && value < 0) {
                return { allow: false, reason: "counter cannot be negative" };
            }
            return { allow: true };
        });

        (expect as any)(store.prop("counter")).toBe(-1);

        // but new writes are guarded
        store.setProp("counter", -2);
        (expect as any)(store.prop("counter")).toBe(-1);

        store.setProp("counter", 5);
        (expect as any)(store.prop("counter")).toBe(5);
    });
});
