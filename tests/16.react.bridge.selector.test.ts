import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { createTardigrade } from "../sources";
import { useTardigradeSelector } from "../sources/react";

describe("Tardigrade Store - react bridge selector", () => {
    it("should compute derived value from several props", () => {
        const store = createTardigrade({ firstName: "John", lastName: "Doe", theme: "dark" });

        const { result } = renderHook(() =>
            useTardigradeSelector((p) => `${p.firstName} ${p.lastName}`, store));

        (expect as any)(result.current).toBe("John Doe");

        act(() => {
            store.setProp("lastName", "Smith");
        });

        (expect as any)(result.current).toBe("John Smith");
    });

    it("should not re-render on unrelated prop changes", () => {
        const store = createTardigrade({ firstName: "John", lastName: "Doe", theme: "dark" });

        let renders = 0;

        renderHook(() => {
            renders++;
            return useTardigradeSelector((p) => `${p.firstName} ${p.lastName}`, store);
        });

        const rendersBefore = renders;

        act(() => {
            store.setProp("theme", "light");
        });

        (expect as any)(renders).toBe(rendersBefore);
    });

    it("should keep referential stability for object slices with equal content", () => {
        const store = createTardigrade({ user: { name: "Alise", role: "admin" }, counter: 0 });

        let renders = 0;

        const { result } = renderHook(() => {
            renders++;
            return useTardigradeSelector((p) => ({ name: p.user.name, role: p.user.role }), store);
        });

        const rendersBefore = renders;
        const sliceBefore = result.current;

        act(() => {
            store.setProp("counter", 1);
        });

        (expect as any)(renders).toBe(rendersBefore);
        (expect as any)(result.current).toBe(sliceBefore);

        act(() => {
            store.setProp("user", { name: "Alise", role: "customer" });
        });

        (expect as any)(result.current).toEqual({ name: "Alise", role: "customer" });
    });

    it("should support custom equality function", () => {
        const store = createTardigrade({ items: [1, 2, 3] });

        let renders = 0;

        const { result } = renderHook(() => {
            renders++;
            return useTardigradeSelector(
                (p) => p.items as number[],
                store,
                (a, b) => a.length === b.length,
            );
        });

        const rendersBefore = renders;

        // same length, different content: custom isEqual treats it as equal
        act(() => {
            store.setProp("items", [4, 5, 6]);
        });

        (expect as any)(renders).toBe(rendersBefore);
        (expect as any)(result.current).toEqual([1, 2, 3]);

        act(() => {
            store.setProp("items", [1, 2, 3, 4]);
        });

        (expect as any)(result.current).toEqual([1, 2, 3, 4]);
    });

    it("should recompute once per setProps batch", () => {
        const store = createTardigrade({ firstName: "John", lastName: "Doe" });

        let renders = 0;

        const { result } = renderHook(() => {
            renders++;
            return useTardigradeSelector((p) => `${p.firstName} ${p.lastName}`, store);
        });

        const rendersBefore = renders;

        act(() => {
            store.setProps({ firstName: "Jane", lastName: "Smith" });
        });

        (expect as any)(renders).toBe(rendersBefore + 1);
        (expect as any)(result.current).toBe("Jane Smith");
    });

    it("should work with inline selector closures without resubscribing", () => {
        const store = createTardigrade({ counter: 1 });

        const { result, rerender } = renderHook(({ multiplier }: { multiplier: number }) =>
            useTardigradeSelector((p) => p.counter * multiplier, store), {
            initialProps: { multiplier: 2 },
        });

        (expect as any)(result.current).toBe(2);

        // new closure is picked up via ref on the next store update
        rerender({ multiplier: 10 });

        act(() => {
            store.setProp("counter", 3);
        });

        (expect as any)(result.current).toBe(30);
    });
});
