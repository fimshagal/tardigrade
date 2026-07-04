import { describe, it, expect, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

// simulates react 16.8–17: the bridge sees a react without useSyncExternalStore
// and must pick the internal fallback shim; react-dom keeps the real react,
// so rendering itself works as usual
vi.mock("react", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react")>();

    return {
        ...actual,
        useSyncExternalStore: undefined,
    };
});

import * as React from "react";
import { createTardigrade } from "../sources";
import { useTardigradeProp, useTardigradeProps, useTardigradeSelector } from "../sources/react";

describe("Tardigrade react bridge - useSyncExternalStore fallback (react 16/17)", () => {
    it("sanity: bridge really sees react without native useSyncExternalStore", () => {
        (expect as any)((React as any).useSyncExternalStore).toBeUndefined();
    });

    it("useTardigradeProp should read, update and write through the shim", () => {
        const store = createTardigrade({ counter: 0 });

        const { result } = renderHook(() => useTardigradeProp<number>("counter", store));

        (expect as any)(result.current[0]).toBe(0);

        act(() => {
            store.setProp("counter", 5);
        });

        (expect as any)(result.current[0]).toBe(5);

        act(() => {
            result.current[1](7);
        });

        (expect as any)(store.prop("counter")).toBe(7);
        (expect as any)(result.current[0]).toBe(7);
    });

    it("useTardigradeProp should re-subscribe when the prop name changes", () => {
        const store = createTardigrade({ a: 1, b: 2 });

        const { result, rerender } = renderHook(({ name }) => useTardigradeProp<number>(name, store), {
            initialProps: { name: "a" },
        });

        (expect as any)(result.current[0]).toBe(1);

        rerender({ name: "b" });

        (expect as any)(result.current[0]).toBe(2);

        act(() => {
            store.setProp("b", 20);
        });

        (expect as any)(result.current[0]).toBe(20);

        // old subscription is gone: changes of "a" don't leak into the value
        act(() => {
            store.setProp("a", 10);
        });

        (expect as any)(result.current[0]).toBe(20);
    });

    it("useTardigradeProp should keep referential stability for content-equal objects", () => {
        const store = createTardigrade({ user: { name: "Alise" } });

        let renders = 0;

        const { result } = renderHook(() => {
            renders++;
            return useTardigradeProp<{ name: string }>("user", store);
        });

        const firstValue = result.current[0];
        const rendersBefore = renders;

        act(() => {
            store.setProp("user", { name: "Alise" }); // new reference, same content
        });

        (expect as any)(result.current[0]).toBe(firstValue);
        (expect as any)(renders).toBe(rendersBefore);
    });

    it("useTardigradeProps should deliver batched setProps as a single re-render", () => {
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

        (expect as any)(result.current).toEqual({ a: 10, b: 20 });
        (expect as any)(renders).toBe(rendersBefore + 1);
    });

    it("useTardigradeProps should see dynamically added props", () => {
        const store = createTardigrade({ a: 1 });

        const { result } = renderHook(() => useTardigradeProps(store));

        act(() => {
            store.addProp("b", 2);
        });

        (expect as any)(result.current).toEqual({ a: 1, b: 2 });
    });

    it("useTardigradeSelector should re-render only when the result changes", () => {
        const store = createTardigrade({ firstName: "Ada", lastName: "Lovelace", theme: "light" });

        let renders = 0;

        const { result } = renderHook(() => {
            renders++;
            return useTardigradeSelector((p) => `${p.firstName} ${p.lastName}`, store);
        });

        (expect as any)(result.current).toBe("Ada Lovelace");

        const rendersBefore = renders;

        // unrelated prop: selector result unchanged, no re-render
        act(() => {
            store.setProp("theme", "dark");
        });

        (expect as any)(renders).toBe(rendersBefore);

        act(() => {
            store.setProp("firstName", "Grace");
        });

        (expect as any)(result.current).toBe("Grace Lovelace");
    });

    it("should unsubscribe on unmount", () => {
        const store = createTardigrade({ counter: 0 });

        const { result, unmount } = renderHook(() => useTardigradeProp<number>("counter", store));

        unmount();

        act(() => {
            store.setProp("counter", 5);
        });

        // unmounted hook keeps the last value and doesn't blow up
        (expect as any)(result.current[0]).toBe(0);
        (expect as any)(store.prop("counter")).toBe(5);
    });
});
