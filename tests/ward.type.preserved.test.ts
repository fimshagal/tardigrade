import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { ward } from "../sources/ward";

describe("Tardigrade ward - core type check after transform", () => {
    it("transform to a wrong type is rejected by core after ward", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        // rules must preserve prop type; this one violates the contract
        guard.addRule("counter", () => ({ allow: true, value: "not a number" }));

        store.setProp("counter", 5);

        // ward allowed, but core type validation rejected the transformed value
        (expect as any)(store.prop("counter")).toBe(0);
    });

    it("transform preserving type passes core validation", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        guard.addRule("counter", (value) => ({
            allow: true,
            value: typeof value === "number" ? Math.min(value, 10) : value,
        }));

        store.setProp("counter", 100);

        (expect as any)(store.prop("counter")).toBe(10);
    });
});
