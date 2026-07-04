import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { createTardigrade } from "../sources";
import { createInMemoryStorage } from "../sources/persist";
import { usePersistedTardigrade } from "../sources/persist/react";

describe("Tardigrade persist - react hook", () => {
    it("should create store, restore from storage on mount and auto-save changes", () => {
        const storage = createInMemoryStorage();
        storage.write("app", JSON.stringify({ version: 1, data: { counter: 42 } }));

        const { result } = renderHook(() =>
            usePersistedTardigrade({ counter: 0 }, { key: "app", storage, saveAfter: 0 }));

        const link = result.current;

        // restore happened in the mount effect
        (expect as any)(link.store.prop("counter")).toBe(42);

        act(() => {
            link.store.setProp("counter", 100);
        });

        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ counter: 100 });
    });

    it("should keep the same link between re-renders", () => {
        const storage = createInMemoryStorage();

        const { result, rerender } = renderHook(() =>
            usePersistedTardigrade({ counter: 0 }, { key: "app", storage, saveAfter: 0 }));

        const firstLink = result.current;

        rerender();

        (expect as any)(result.current).toBe(firstLink);
        (expect as any)(result.current.store).toBe(firstLink.store);
    });

    it("should accept an existing store", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ theme: "light" });

        const { result } = renderHook(() =>
            usePersistedTardigrade(store, { key: "app", storage, saveAfter: 0 }));

        (expect as any)(result.current.store).toBe(store);

        act(() => {
            store.setProp("theme", "dark");
        });

        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ theme: "dark" });
    });

    it("should dispose auto-save on unmount", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ counter: 0 });

        const { result, unmount } = renderHook(() =>
            usePersistedTardigrade(store, { key: "app", storage, saveAfter: 0 }));

        const link = result.current;

        unmount();

        (expect as any)(link.isDisposed).toBe(true);

        act(() => {
            store.setProp("counter", 5);
        });

        (expect as any)(storage.read("app")).toBeNull();
    });

    it("should skip restore when restoreOnStart is false", () => {
        const storage = createInMemoryStorage();
        storage.write("app", JSON.stringify({ version: 1, data: { counter: 42 } }));

        const { result } = renderHook(() =>
            usePersistedTardigrade({ counter: 0 }, { key: "app", storage, saveAfter: 0, restoreOnStart: false }));

        (expect as any)(result.current.store.prop("counter")).toBe(0);
    });
});
