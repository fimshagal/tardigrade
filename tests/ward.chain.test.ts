import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { ward } from "../sources/ward";

describe("Tardigrade ward - rules chain", () => {
    it("transform then validate: next rule sees transformed value", () => {
        const store = createTardigrade({ email: "placeholder@x.y" });
        const guard = ward(store);

        guard.addRule("email", (value) => ({
            allow: true,
            value: typeof value === "string" ? value.trim() : value,
        }));

        guard.addRule("email", (value) => {
            if (typeof value === "string" && !value.includes("@")) {
                return { allow: false, reason: "invalid email" };
            }
            return { allow: true };
        });

        store.setProp("email", "  a@b.c  ");
        (expect as any)(store.prop("email")).toBe("a@b.c");

        store.setProp("email", "  not-an-email  ");
        (expect as any)(store.prop("email")).toBe("a@b.c");
    });

    it("first deny stops the chain", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        let secondRuleCalls = 0;

        guard.addRule("counter", () => ({ allow: false, reason: "always deny" }));
        guard.addRule("counter", () => {
            secondRuleCalls++;
            return { allow: true };
        });

        store.setProp("counter", 1);

        (expect as any)(store.prop("counter")).toBe(0);
        (expect as any)(secondRuleCalls).toBe(0);
    });

    it("execution order: global, then kind, then prop", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);
        const order: string[] = [];

        guard.addRule("counter", () => {
            order.push("prop");
            return { allow: true };
        });

        guard.addRule((context) => {
            if (context.kind === "setProp") {
                order.push("global");
            }
            return { allow: true };
        });

        guard.addRule("setProp", () => {
            order.push("kind");
            return { allow: true };
        });

        store.setProp("counter", 1);

        (expect as any)(order).toEqual(["global", "kind", "prop"]);
    });

    it("global transform feeds prop rule", () => {
        const store = createTardigrade({ username: "guest" });
        const guard = ward(store);

        guard.addRule((context) => {
            if (context.kind === "setProp" && typeof context.value === "string") {
                return { allow: true, value: context.value.trim() };
            }
            return { allow: true };
        });

        guard.addRule("username", (value) => {
            if (typeof value === "string" && value.length === 0) {
                return { allow: false, reason: "username cannot be empty" };
            }
            return { allow: true };
        });

        store.setProp("username", "   ");
        (expect as any)(store.prop("username")).toBe("guest");

        store.setProp("username", "  admin  ");
        (expect as any)(store.prop("username")).toBe("admin");
    });
});
