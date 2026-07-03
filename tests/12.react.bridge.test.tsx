import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { ReactNode, createElement } from "react";
import { createTardigrade } from "../sources";
import {
    TardigradeProvider,
    useTardigrade,
    useTardigradeProp,
    useTardigradeProps,
    useTardigradeResolver,
} from "../sources/react";

describe("Tardigrade Store - react bridge", () => {
    it("useTardigrade should create store once and keep it between renders", () => {
        const { result, rerender } = renderHook(() => useTardigrade({ counter: 0 }));

        const firstInstance = result.current;

        (expect as any)(firstInstance.prop("counter")).toBe(0);

        rerender();

        (expect as any)(result.current).toBe(firstInstance);
    });

    it("useTardigradeProp should read and update prop with direct store", () => {
        const store = createTardigrade({ counter: 0 });

        const { result } = renderHook(() => useTardigradeProp<number>("counter", store));

        (expect as any)(result.current[0]).toBe(0);

        act(() => {
            result.current[1](5);
        });

        (expect as any)(result.current[0]).toBe(5);
        (expect as any)(store.prop("counter")).toBe(5);
    });

    it("useTardigradeProp should react to external setProp calls", () => {
        const store = createTardigrade({ counter: 0 });

        const { result } = renderHook(() => useTardigradeProp<number>("counter", store));

        act(() => {
            store.setProp("counter", 42);
        });

        (expect as any)(result.current[0]).toBe(42);
    });

    it("useTardigradeProp should take store from TardigradeProvider", () => {
        const store = createTardigrade({ username: "guest" });

        const wrapper = ({ children }: { children: ReactNode }) =>
            createElement(TardigradeProvider, { store }, children);

        const { result } = renderHook(() => useTardigradeProp<string>("username"), { wrapper });

        (expect as any)(result.current[0]).toBe("guest");

        act(() => {
            store.setProp("username", "admin");
        });

        (expect as any)(result.current[0]).toBe("admin");
    });

    it("useTardigradeProps should return all props and stay in sync", () => {
        const store = createTardigrade({ counter: 0, username: "guest" });

        const { result } = renderHook(() => useTardigradeProps(store));

        (expect as any)(result.current).toEqual({ counter: 0, username: "guest" });

        act(() => {
            store.setProp("counter", 1);
        });

        (expect as any)(result.current).toEqual({ counter: 1, username: "guest" });
    });

    it("useTardigradeResolver should call resolver and bring value", async () => {
        const store = createTardigrade({ random: () => 7 });

        const { result } = renderHook(() => useTardigradeResolver<number>("random", store));

        (expect as any)(result.current[1]).toBeNull();

        await act(async () => {
            await result.current[0]();
        });

        (expect as any)(result.current[1]).toBe(7);
    });

    it("useTardigradeProp should unsubscribe on unmount", () => {
        const store = createTardigrade({ counter: 0 });

        const { result, unmount } = renderHook(() => useTardigradeProp<number>("counter", store));

        unmount();

        act(() => {
            store.setProp("counter", 100);
        });

        (expect as any)(result.current[0]).toBe(0);
    });
});
