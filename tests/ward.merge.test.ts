import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { ward } from "../sources/ward";

describe("Tardigrade ward - merge and import", () => {
    it("merge should run rules on imported props", () => {
        const base = createTardigrade({ counter: 0 });
        const extra = createTardigrade({ counter: -5, injected: -1 });

        const guard = ward(base);

        guard.addRule((context) => {
            if ((context.kind === "setProp" || context.kind === "addProp")
                && typeof context.value === "number"
                && context.value < 0) {
                return { allow: false, reason: "negative values are not allowed" };
            }
            return { allow: true };
        });

        base.merge(extra, true);

        // both imported values were negative: existing prop kept, new prop not created
        (expect as any)(base.prop("counter")).toBe(0);
        (expect as any)(base.hasProp("injected")).toBe(false);
    });

    it("hold allows bulk import without rules", () => {
        const base = createTardigrade({ counter: 0 });
        const extra = createTardigrade({ counter: -5 });

        const guard = ward(base);

        guard.addRule("counter", (value) => {
            if (typeof value === "number" && value < 0) {
                return { allow: false };
            }
            return { allow: true };
        });

        guard.hold();
        base.merge(extra, true);
        guard.unhold();

        (expect as any)(base.prop("counter")).toBe(-5);

        // rules are active again after unhold
        base.setProp("counter", -10);
        (expect as any)(base.prop("counter")).toBe(-5);
    });

    it("importProps should respect rules too", () => {
        const base = createTardigrade({ counter: 0 });
        const source = createTardigrade({ counter: -3 });

        const guard = ward(base);

        guard.addRule("counter", (value) => {
            if (typeof value === "number" && value < 0) {
                return { allow: false };
            }
            return { allow: true };
        });

        base.importProps(source, true);

        (expect as any)(base.prop("counter")).toBe(0);
    });
});
