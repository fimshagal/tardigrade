import { describe, it, expect, vi } from "vitest";
import { createTardigrade } from "../sources";
import { ward } from "../sources/ward";

describe("Tardigrade ward - basics", () => {
    it("should allow writes that pass rules", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        guard.addRule("counter", (value) => {
            if (typeof value === "number" && value < 0) {
                return { allow: false, reason: "counter cannot be negative" };
            }
            return { allow: true };
        });

        store.setProp("counter", 5);

        (expect as any)(store.prop("counter")).toBe(5);
    });

    it("should deny writes and keep the previous value", () => {
        const store = createTardigrade({ counter: 0 });
        const onDeny = vi.fn();
        const guard = ward(store, { onDeny });

        guard.addRule("counter", (value) => {
            if (typeof value === "number" && value < 0) {
                return { allow: false, reason: "counter cannot be negative" };
            }
            return { allow: true };
        });

        store.setProp("counter", -1);

        (expect as any)(store.prop("counter")).toBe(0);
        (expect as any)(onDeny).toHaveBeenCalledTimes(1);
        (expect as any)(onDeny).toHaveBeenCalledWith(
            { kind: "setProp", name: "counter", value: -1 },
            "counter cannot be negative",
        );
    });

    it("should transform value before write", () => {
        const store = createTardigrade({ email: "" });
        const guard = ward(store);

        guard.addRule("email", (value) => ({
            allow: true,
            value: typeof value === "string" ? value.trim().toLowerCase() : value,
        }));

        store.setProp("email", "  A@B.C  ");

        (expect as any)(store.prop("email")).toBe("a@b.c");
    });

    it("listeners should receive transformed value", () => {
        const store = createTardigrade({ email: "" });
        const guard = ward(store);
        const listener = vi.fn();

        guard.addRule("email", (value) => ({
            allow: true,
            value: typeof value === "string" ? value.trim() : value,
        }));

        store.addPropListener("email", listener);
        store.setProp("email", "  x@y.z  ");

        (expect as any)(listener).toHaveBeenCalledWith("x@y.z");
    });

    it("void or bare allow should pass value through unchanged", () => {
        const store = createTardigrade({ a: 1, b: 1 });
        const guard = ward(store);

        guard.addRule("a", () => undefined);
        guard.addRule("b", () => ({ allow: true }));

        store.setProp("a", 2);
        store.setProp("b", 2);

        (expect as any)(store.prop("a")).toBe(2);
        (expect as any)(store.prop("b")).toBe(2);
    });

    it("a throwing rule should deny the write (fail closed)", () => {
        const store = createTardigrade({ counter: 0 });
        const onDeny = vi.fn();
        const guard = ward(store, { onDeny });

        guard.addRule("counter", () => {
            throw new Error("rule exploded");
        });

        store.setProp("counter", 5);

        (expect as any)(store.prop("counter")).toBe(0);
        (expect as any)(onDeny).toHaveBeenCalledWith(
            { kind: "setProp", name: "counter", value: 5 },
            "rule exploded",
        );
    });

    it("removeRule and clearRules should disable checks", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        const id = guard.addRule("counter", () => ({ allow: false }));
        (expect as any)(guard.ruleCount).toBe(1);

        guard.removeRule(id);
        (expect as any)(guard.ruleCount).toBe(0);

        store.setProp("counter", 1);
        (expect as any)(store.prop("counter")).toBe(1);

        guard.addRule("counter", () => ({ allow: false }));
        guard.clearRules();

        store.setProp("counter", 2);
        (expect as any)(store.prop("counter")).toBe(2);
    });
});
