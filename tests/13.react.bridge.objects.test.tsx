import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { createTardigrade } from "../sources";
import { useTardigradeProp, useTardigradeProps } from "../sources/react";

interface User {
    name: string;
    age: number;
}

describe("Tardigrade Store - react bridge objects handling", () => {
    it("useTardigradeProp should not re-render on mount sync for object props", () => {
        const store = createTardigrade({ user: { name: "Alise", age: 100 } });

        let renders = 0;

        renderHook(() => {
            renders++;
            return useTardigradeProp<User>("user", store);
        });

        (expect as any)(renders).toBe(1);
    });

    it("useTardigradeProp should skip content-equal object updates", () => {
        const store = createTardigrade({ user: { name: "Alise", age: 100 } });

        let renders = 0;

        const { result } = renderHook(() => {
            renders++;
            return useTardigradeProp<User>("user", store);
        });

        const rendersBefore = renders;
        const valueBefore = result.current[0];

        act(() => {
            store.setProp("user", { name: "Alise", age: 100 });
        });

        (expect as any)(renders).toBe(rendersBefore);
        (expect as any)(result.current[0]).toBe(valueBefore);
    });

    it("useTardigradeProp should re-render when object content really changes", () => {
        const store = createTardigrade({ user: { name: "Alise", age: 100 } });

        const { result } = renderHook(() => useTardigradeProp<User>("user", store));

        act(() => {
            store.setProp("user", { name: "Bob", age: 200 });
        });

        (expect as any)(result.current[0]).toEqual({ name: "Bob", age: 200 });
    });

    it("useTardigradeProp state should not expose store internals to mutations", () => {
        const store = createTardigrade({ user: { name: "Alise", age: 100 } });

        const { result } = renderHook(() => useTardigradeProp<User>("user", store));

        act(() => {
            store.setProp("user", { name: "Bob", age: 200 });
        });

        result.current[0]!.name = "Hacked";

        (expect as any)(store.prop("user")).toEqual({ name: "Bob", age: 200 });
    });

    it("useTardigradeProps should skip content-equal updates", () => {
        const store = createTardigrade({ user: { name: "Alise", age: 100 }, counter: 0 });

        let renders = 0;

        const { result } = renderHook(() => {
            renders++;
            return useTardigradeProps(store);
        });

        const rendersBefore = renders;
        const propsBefore = result.current;

        act(() => {
            store.setProp("user", { name: "Alise", age: 100 });
        });

        (expect as any)(renders).toBe(rendersBefore);
        (expect as any)(result.current).toBe(propsBefore);

        act(() => {
            store.setProp("counter", 1);
        });

        (expect as any)(result.current).toEqual({ user: { name: "Alise", age: 100 }, counter: 1 });
    });
});
