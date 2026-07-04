import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { createTardigrade } from "../sources";
import { useTardigradeProp, useTardigradeProps } from "../sources/react";

describe("Tardigrade Store - setProps batch update", () => {
    it("should update several props and call global listener only once", () => {
        const store = createTardigrade({ a: 0, b: 0, c: "text" });
        const globalListener = vi.fn();

        store.addListener(globalListener);

        store.setProps({ a: 1, b: 2 });

        (expect as any)(store.prop("a")).toBe(1);
        (expect as any)(store.prop("b")).toBe(2);

        (expect as any)(globalListener).toHaveBeenCalledTimes(1);
        (expect as any)(globalListener).toHaveBeenCalledWith(
            ["a", "b"],
            { a: 1, b: 2 },
            { a: 1, b: 2, c: "text" },
        );
    });

    it("should notify prop listeners for each changed prop", () => {
        const store = createTardigrade({ a: 0, b: 0 });
        const listenerA = vi.fn();
        const listenerB = vi.fn();

        store.addPropListener("a", listenerA);
        store.addPropListener("b", listenerB);

        store.setProps({ a: 1, b: 2 });

        (expect as any)(listenerA).toHaveBeenCalledTimes(1);
        (expect as any)(listenerA).toHaveBeenCalledWith(1);
        (expect as any)(listenerB).toHaveBeenCalledTimes(1);
        (expect as any)(listenerB).toHaveBeenCalledWith(2);
    });

    it("should skip unchanged scalar values in batch", () => {
        const store = createTardigrade({ a: 0, b: 0 });
        const globalListener = vi.fn();
        const listenerA = vi.fn();

        store.addListener(globalListener);
        store.addPropListener("a", listenerA);

        store.setProps({ a: 0, b: 5 });

        (expect as any)(listenerA).not.toHaveBeenCalled();
        (expect as any)(globalListener).toHaveBeenCalledTimes(1);
        (expect as any)(globalListener).toHaveBeenCalledWith(["b"], { b: 5 }, { a: 0, b: 5 });
    });

    it("should not call global listener when nothing changed", () => {
        const store = createTardigrade({ a: 0 });
        const globalListener = vi.fn();

        store.addListener(globalListener);

        store.setProps({ a: 0 });

        (expect as any)(globalListener).not.toHaveBeenCalled();
    });

    it("should apply valid props even when patch contains unknown ones", () => {
        const store = createTardigrade({ a: 0 });

        store.setProps({ a: 9, unknown: 1 });

        (expect as any)(store.prop("a")).toBe(9);
        (expect as any)(store.hasProp("unknown")).toBe(false);
    });

    it("should respect store shape typing", () => {
        const store = createTardigrade({ counter: 0, username: "guest" });

        store.setProps({ counter: 1, username: "admin" });

        // @ts-expect-error string is not assignable to the "counter" prop typed as number
        store.setProps({ counter: "text" });

        (expect as any)(store.prop("counter")).toBe(1);
        (expect as any)(store.prop("username")).toBe("admin");
    });
});

describe("Tardigrade Store - setProps with react bridge", () => {
    it("useTardigradeProps should re-render only once per batch", () => {
        const store = createTardigrade({ a: 1, b: 2 });

        let renders = 0;

        const { result } = renderHook(() => {
            renders++;
            return useTardigradeProps(store);
        });

        const rendersBefore = renders;

        act(() => {
            store.setProps({ a: 10, b: 20 });
        });

        (expect as any)(renders).toBe(rendersBefore + 1);
        (expect as any)(result.current).toEqual({ a: 10, b: 20 });
    });

    it("useTardigradeProp should receive its value from a batched update", () => {
        const store = createTardigrade({ a: 1, b: 2 });

        const { result: resultA } = renderHook(() => useTardigradeProp<number>("a", store));
        const { result: resultB } = renderHook(() => useTardigradeProp<number>("b", store));

        act(() => {
            store.setProps({ a: 10, b: 20 });
        });

        (expect as any)(resultA.current[0]).toBe(10);
        (expect as any)(resultB.current[0]).toBe(20);
    });

    it("useTardigradeProp should ignore batches without its prop", () => {
        const store = createTardigrade({ a: 1, b: 2, user: { name: "Alise" } });

        let renders = 0;

        renderHook(() => {
            renders++;
            return useTardigradeProp<{ name: string }>("user", store);
        });

        const rendersBefore = renders;

        act(() => {
            store.setProps({ a: 10, b: 20 });
        });

        (expect as any)(renders).toBe(rendersBefore);
    });
});
