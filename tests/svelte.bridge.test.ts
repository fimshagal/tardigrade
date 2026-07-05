import { describe, it, expect, vi } from "vitest";
import { createTardigrade } from "../sources";
import { tardigradeProp, tardigradeProps, tardigradeResolver, tardigradeSelector } from "../sources/svelte";

describe("Tardigrade svelte bridge", () => {
    it("subscriber receives the current value synchronously (store contract)", () => {
        const store = createTardigrade({ counter: 3 });
        const counter = tardigradeProp<number>(store, "counter");

        const values: unknown[] = [];
        const unsubscribe = counter.subscribe((value) => values.push(value));

        (expect as any)(values).toEqual([3]);

        unsubscribe();
    });

    it("store updates notify subscribers, set/update write back", () => {
        const store = createTardigrade({ counter: 0 });
        const counter = tardigradeProp<number>(store, "counter");

        const values: unknown[] = [];
        const unsubscribe = counter.subscribe((value) => values.push(value));

        store.setProp("counter", 1);
        counter.set(2);
        counter.update((value) => (value ?? 0) + 10);

        (expect as any)(values).toEqual([0, 1, 2, 12]);
        (expect as any)(store.prop("counter")).toBe(12);

        unsubscribe();
    });

    it("unsubscribe stops notifications", () => {
        const store = createTardigrade({ counter: 0 });
        const counter = tardigradeProp<number>(store, "counter");

        const spy = vi.fn();
        const unsubscribe = counter.subscribe(spy);

        unsubscribe();
        store.setProp("counter", 5);

        // only the initial synchronous call
        (expect as any)(spy).toHaveBeenCalledTimes(1);
    });

    it("content-equal object updates don't notify (referential stability)", () => {
        const store = createTardigrade({ user: { name: "a" } });
        const user = tardigradeProp<{ name: string }>(store, "user");

        const spy = vi.fn();
        const unsubscribe = user.subscribe(spy);

        store.setProp("user", { name: "a" });
        (expect as any)(spy).toHaveBeenCalledTimes(1);

        store.setProp("user", { name: "b" });
        (expect as any)(spy).toHaveBeenCalledTimes(2);
        (expect as any)(spy).toHaveBeenLastCalledWith({ name: "b" });

        unsubscribe();
    });

    it("batched setProps notifies prop subscribers once", () => {
        const store = createTardigrade({ counter: 0, title: "x" });
        const counter = tardigradeProp<number>(store, "counter");

        const spy = vi.fn();
        const unsubscribe = counter.subscribe(spy);

        store.setProps({ counter: 3, title: "y" });

        (expect as any)(spy).toHaveBeenCalledTimes(2); // initial + batch
        (expect as any)(spy).toHaveBeenLastCalledWith(3);

        unsubscribe();
    });

    it("tardigradeProps exposes the whole snapshot", () => {
        const store = createTardigrade({ counter: 0, title: "x" });
        const props = tardigradeProps(store);

        const values: unknown[] = [];
        const unsubscribe = props.subscribe((value) => values.push(value));

        store.setProp("counter", 1);

        (expect as any)(values).toEqual([
            { counter: 0, title: "x" },
            { counter: 1, title: "x" },
        ]);

        unsubscribe();
    });

    it("tardigradeSelector notifies only when the result changes", () => {
        const store = createTardigrade({ a: 1, b: 10 });
        const doubled = tardigradeSelector<number>(store, (props) => props.a * 2);

        const values: unknown[] = [];
        const unsubscribe = doubled.subscribe((value) => values.push(value));

        store.setProp("b", 20); // irrelevant for the selector result
        store.setProp("a", 5);

        (expect as any)(values).toEqual([2, 10]);

        unsubscribe();
    });

    it("tardigradeResolver delivers resolver values", async () => {
        const store = createTardigrade({ counter: 2 });
        store.addResolver("double", (props: any) => props.counter * 2);

        const double = tardigradeResolver<number>(store, "double");

        const values: unknown[] = [];
        const unsubscribe = double.subscribe((value) => values.push(value));

        await double.call();

        (expect as any)(values).toEqual([null, 4]);

        unsubscribe();
    });

    it("writes through the bridge respect ward rules", async () => {
        const { ward } = await import("../sources/ward");

        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        guard.addRule("counter", (value) => {
            if (typeof value === "number" && value < 0) {
                return { allow: false, reason: "counter cannot be negative" };
            }
            return { allow: true };
        });

        const counter = tardigradeProp<number>(store, "counter");
        counter.set(-1);

        (expect as any)(store.prop("counter")).toBe(0);
    });
});
