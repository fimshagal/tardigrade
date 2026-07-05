import { describe, it, expect, vi } from "vitest";
import { createApp, defineComponent, effectScope, h, nextTick } from "vue";
import type { Ref } from "vue";
import { createTardigrade, Nullable } from "../sources";
import {
    provideTardigradeStore,
    useTardigradeProp,
    useTardigradeProps,
    useTardigradeResolver,
    useTardigradeSelector,
} from "../sources/vue";

describe("Tardigrade vue bridge", () => {
    it("useTardigradeProp reads and reacts to store updates", () => {
        const store = createTardigrade({ counter: 0 });

        const scope = effectScope();
        const counter = scope.run(() => useTardigradeProp<number>("counter", store))!;

        (expect as any)(counter.value).toBe(0);

        store.setProp("counter", 5);
        (expect as any)(counter.value).toBe(5);

        scope.stop();
    });

    it("writing to the ref goes through store.setProp", () => {
        const store = createTardigrade({ counter: 0 });

        const scope = effectScope();
        const counter = scope.run(() => useTardigradeProp<number>("counter", store))!;

        counter.value = 7;

        (expect as any)(store.prop("counter")).toBe(7);
        (expect as any)(counter.value).toBe(7);

        scope.stop();
    });

    it("object values keep referential stability for content-equal updates", () => {
        const store = createTardigrade({ user: { name: "a" } });

        const scope = effectScope();
        const user = scope.run(() => useTardigradeProp<{ name: string }>("user", store))!;

        const before = user.value;

        store.setProp("user", { name: "a" });
        (expect as any)(user.value).toBe(before);

        store.setProp("user", { name: "b" });
        (expect as any)(user.value).not.toBe(before);
        (expect as any)(user.value).toEqual({ name: "b" });

        scope.stop();
    });

    it("batched setProps updates the ref once with the final value", () => {
        const store = createTardigrade({ counter: 0, title: "x" });

        const scope = effectScope();
        const counter = scope.run(() => useTardigradeProp<number>("counter", store))!;

        store.setProps({ counter: 3, title: "y" });

        (expect as any)(counter.value).toBe(3);

        scope.stop();
    });

    it("useTardigradeProps exposes the whole snapshot", () => {
        const store = createTardigrade({ counter: 0, title: "x" });

        const scope = effectScope();
        const props = scope.run(() => useTardigradeProps(store))!;

        (expect as any)(props.value).toEqual({ counter: 0, title: "x" });

        store.setProp("counter", 1);
        (expect as any)(props.value).toEqual({ counter: 1, title: "x" });

        scope.stop();
    });

    it("useTardigradeSelector recomputes only when the result changes", () => {
        const store = createTardigrade({ a: 1, b: 10 });

        const scope = effectScope();
        const selectorSpy = vi.fn((props: any) => props.a * 2);
        const doubled = scope.run(() => useTardigradeSelector<number>(selectorSpy, store))!;

        (expect as any)(doubled.value).toBe(2);

        const before = doubled.value;

        store.setProp("b", 20); // irrelevant for the selector result
        (expect as any)(doubled.value).toBe(before);

        store.setProp("a", 5);
        (expect as any)(doubled.value).toBe(10);

        scope.stop();
    });

    it("useTardigradeResolver delivers resolver value into the ref", async () => {
        const store = createTardigrade({ counter: 1 });
        store.addResolver("double", (props: any) => props.counter * 2);

        const scope = effectScope();
        const [callDouble, doubled] = scope.run(() => useTardigradeResolver<number>("double", store))!;

        (expect as any)(doubled.value).toBeNull();

        await callDouble();
        (expect as any)(doubled.value).toBe(2);

        scope.stop();
    });

    it("scope dispose detaches the listener", () => {
        const store = createTardigrade({ counter: 0 });

        const scope = effectScope();
        const counter = scope.run(() => useTardigradeProp<number>("counter", store))!;

        scope.stop();

        store.setProp("counter", 42);

        // no live subscription anymore: the ref keeps the last value
        (expect as any)(counter.value).toBe(0);
    });

    it("provideTardigradeStore / inject works through the component tree", async () => {
        const store = createTardigrade({ counter: 11 });

        let injectedValue: Nullable<Ref<Nullable<number>>> = null;

        const Child = defineComponent({
            setup() {
                injectedValue = useTardigradeProp<number>("counter");
                return () => h("span");
            },
        });

        const Parent = defineComponent({
            setup() {
                provideTardigradeStore(store);
                return () => h(Child);
            },
        });

        const host = document.createElement("div");
        const app = createApp(Parent);
        app.mount(host);
        await nextTick();

        (expect as any)(injectedValue!.value).toBe(11);

        app.unmount();
    });

    it("composable without store and without provider throws", () => {
        (expect as any)(() => useTardigradeProp<number>("counter")).toThrowError(/store wasn't provided/);
    });
});
