import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { ward } from "../sources/ward";

describe("Tardigrade ward - emitErrors interplay", () => {
    it("deny with emitErrors: true throws a real error", () => {
        const store = createTardigrade({ counter: 0 }, { emitErrors: true });
        const guard = ward(store);

        guard.addRule("counter", () => ({ allow: false, reason: "counter cannot be negative" }));

        (expect as any)(() => store.setProp("counter", -1)).toThrowError(/counter cannot be negative/);
        (expect as any)(store.prop("counter")).toBe(0);
    });

    it("deny with emitErrors: false only reports to console", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        guard.addRule("counter", () => ({ allow: false, reason: "denied" }));

        (expect as any)(() => store.setProp("counter", -1)).not.toThrow();
        (expect as any)(store.prop("counter")).toBe(0);
    });
});
