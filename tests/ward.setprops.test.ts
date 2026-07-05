import { describe, it, expect, vi } from "vitest";
import { createTardigrade } from "../sources";
import { ward } from "../sources/ward";

describe("Tardigrade ward - setProps batch", () => {
    it("batch rule should deny the whole patch", () => {
        const store = createTardigrade({ counter: 0, username: "guest" });
        const guard = ward(store);

        guard.addRule("setProps", (context) => {
            if (context.kind === "setProps" && typeof context.patch.counter === "number" && context.patch.counter < 0) {
                return { allow: false, reason: "counter cannot be negative" };
            }
            return { allow: true };
        });

        store.setProps({ counter: -1, username: "admin" });

        // nothing from the batch was applied
        (expect as any)(store.prop("counter")).toBe(0);
        (expect as any)(store.prop("username")).toBe("guest");
    });

    it("prop rules should apply to every key of the batch (no bypass)", () => {
        const store = createTardigrade({ email: "", counter: 0 });
        const guard = ward(store);

        guard.addRule("email", (value) => ({
            allow: true,
            value: typeof value === "string" ? value.trim().toLowerCase() : value,
        }));

        store.setProps({ email: "  A@B.C  ", counter: 1 });

        (expect as any)(store.prop("email")).toBe("a@b.c");
        (expect as any)(store.prop("counter")).toBe(1);
    });

    it("per-key deny inside batch skips only that key (partial apply)", () => {
        const store = createTardigrade({ counter: 0, username: "guest" });
        const guard = ward(store);
        const globalListener = vi.fn();

        guard.addRule("counter", (value) => {
            if (typeof value === "number" && value < 0) {
                return { allow: false, reason: "counter cannot be negative" };
            }
            return { allow: true };
        });

        store.addListener(globalListener);
        store.setProps({ counter: -1, username: "admin" });

        (expect as any)(store.prop("counter")).toBe(0);
        (expect as any)(store.prop("username")).toBe("admin");

        // single batch notification containing only the applied key
        (expect as any)(globalListener).toHaveBeenCalledTimes(1);
        (expect as any)(globalListener).toHaveBeenCalledWith(
            ["username"],
            { username: "admin" },
            { counter: 0, username: "admin" },
        );
    });

    it("batch-level transform is ignored (documented v1 limitation)", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        guard.addRule("setProps", () => ({ allow: true, value: { counter: 100 } }));

        store.setProps({ counter: 1 });

        (expect as any)(store.prop("counter")).toBe(1);
    });
});
