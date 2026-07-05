import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { ward } from "../sources/ward";

describe("Tardigrade ward - addProp rules", () => {
    it("kind rule should validate dynamic prop names", () => {
        const store = createTardigrade({ step: 1 });
        const guard = ward(store);

        guard.addRule("addProp", (context) => {
            if (context.kind !== "addProp") {
                return { allow: true };
            }
            if (!context.name.startsWith("field_")) {
                return { allow: false, reason: "dynamic props must use field_ prefix" };
            }
            return { allow: true };
        });

        store.addProp("field_email", "");
        store.addProp("email", "");

        (expect as any)(store.hasProp("field_email")).toBe(true);
        (expect as any)(store.hasProp("email")).toBe(false);
    });

    it("prop rule should also guard addProp with the same name", () => {
        const store = createTardigrade({ step: 1 });
        const guard = ward(store);

        guard.addRule("counter", (value) => {
            if (typeof value === "number" && value < 0) {
                return { allow: false, reason: "counter cannot be negative" };
            }
            return { allow: true };
        });

        // bypass attempt: prop doesn't exist yet, value comes through addProp
        store.addProp("counter", -5);
        (expect as any)(store.hasProp("counter")).toBe(false);

        store.addProp("counter", 5);
        (expect as any)(store.prop("counter")).toBe(5);
    });

    it("transform should apply on addProp", () => {
        const store = createTardigrade({ step: 1 });
        const guard = ward(store);

        guard.addRule("addProp", (context) => {
            if (context.kind === "addProp" && typeof context.value === "string") {
                return { allow: true, value: context.value.trim() };
            }
            return { allow: true };
        });

        store.addProp("username", "  guest  ");

        (expect as any)(store.prop("username")).toBe("guest");
    });

    it("denied addProp should not notify listeners", () => {
        const store = createTardigrade({ step: 1 });
        const guard = ward(store);

        let globalCalls = 0;
        store.addListener(() => globalCalls++);

        guard.addRule("addProp", () => ({ allow: false, reason: "no dynamic props" }));

        store.addProp("dynamic", 1);

        (expect as any)(store.hasProp("dynamic")).toBe(false);
        (expect as any)(globalCalls).toBe(0);
    });
});
