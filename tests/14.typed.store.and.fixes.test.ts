import { describe, it, expect, vi } from "vitest";
import { createTardigrade } from "../sources";
import { Dictionary } from "../sources/lib";

describe("Tardigrade Store - typed store", () => {
    it("should infer prop and resolver types from initial data and keep runtime working", async () => {
        const store = createTardigrade({
            counter: 0,
            username: "guest",
            double: ({ counter }: { counter: number }) => counter * 2,
        });

        store.setProp("counter", 5);

        // @ts-expect-error string is not assignable to the "counter" prop typed as number
        store.setProp("counter", "text");

        // @ts-expect-error boolean is not assignable to the "username" prop typed as string
        store.setProp("username", true);

        const counter: number | null | undefined = store.prop("counter");
        (expect as any)(counter).toBe(5);

        const resolverListener = vi.fn();
        store.addResolverListener("double", resolverListener);
        await store.callResolver("double");
        (expect as any)(resolverListener).toHaveBeenCalledWith(10);

        // dynamic props stay possible and loosely typed
        store.addProp("dynamic", { anything: true });
        (expect as any)(store.prop("dynamic")).toEqual({ anything: true });
    });

    it("should support explicit store shape without initial data", () => {
        interface StoreShape extends Dictionary {
            counter: number;
        }

        const store = createTardigrade<StoreShape>();

        store.addProp("counter", 0);
        store.setProp("counter", 7);

        // @ts-expect-error string is not assignable to the "counter" prop typed as number
        store.addProp("counter", "text");

        (expect as any)(store.prop("counter")).toBe(7);
    });
});

describe("Tardigrade Store - merge listeners migration fix", () => {
    it("should keep own prop listeners and migrate resolver listeners on merge", async () => {
        const base = createTardigrade({ counter: 0 });
        const extra = createTardigrade({ bring: () => 7 });

        const propListener = vi.fn();
        const resolverListener = vi.fn();

        base.addPropListener("counter", propListener);
        extra.addResolverListener("bring", resolverListener);

        base.merge(extra);

        base.setProp("counter", 1);
        (expect as any)(propListener).toHaveBeenCalledWith(1);

        await base.callResolver("bring");
        (expect as any)(resolverListener).toHaveBeenCalledWith(7);
    });
});

describe("Tardigrade Store - strictObjectsInterfaces keys count fix", () => {
    it("should reject object with extra keys", () => {
        const store = createTardigrade<Dictionary>({
            user: { name: "Alise", age: 100 },
        }, {
            strictObjectsInterfaces: true,
        });

        store.setProp("user", { name: "Bob", age: 200, extra: true });

        (expect as any)(store.prop("user")).toEqual({ name: "Alise", age: 100 });
    });

    it("should reject object with missing keys", () => {
        const store = createTardigrade<Dictionary>({
            user: { name: "Alise", age: 100 },
        }, {
            strictObjectsInterfaces: true,
        });

        store.setProp("user", { name: "Bob" });

        (expect as any)(store.prop("user")).toEqual({ name: "Alise", age: 100 });
    });
});
