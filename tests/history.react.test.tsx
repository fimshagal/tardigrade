import { describe, it, expect } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { createTardigrade } from "../sources";
import { useHistory } from "../sources/history/react";

describe("Tardigrade history - react hook", () => {
    it("should attach history and undo/redo through the hook", () => {
        const store = createTardigrade({ counter: 0 });

        const { result } = renderHook(() => useHistory(store));

        act(() => {
            store.setProp("counter", 1);
            store.setProp("counter", 2);
        });

        (expect as any)(result.current.canUndo).toBe(true);

        act(() => {
            result.current.undo();
        });

        (expect as any)(store.prop("counter")).toBe(1);
        (expect as any)(result.current.canRedo).toBe(true);

        act(() => {
            result.current.redo();
        });

        (expect as any)(store.prop("counter")).toBe(2);
    });

    it("should keep the same link between re-renders", () => {
        const store = createTardigrade({ counter: 0 });

        const { result, rerender } = renderHook(() => useHistory(store));

        const firstLink = result.current;

        rerender();

        (expect as any)(result.current).toBe(firstLink);
        (expect as any)(result.current.store).toBe(store);
    });

    it("should re-render when canUndo flips so toolbars stay in sync", () => {
        const store = createTardigrade({ counter: 0 });

        let renders = 0;

        const { result } = renderHook(() => {
            renders++;
            return useHistory(store);
        });

        (expect as any)(result.current.canUndo).toBe(false);

        const before = renders;

        act(() => {
            store.setProp("counter", 1);
        });

        (expect as any)(renders).toBeGreaterThan(before);
        (expect as any)(result.current.canUndo).toBe(true);
    });

    it("should dispose history on unmount", () => {
        const store = createTardigrade({ counter: 0 });

        const { result, unmount } = renderHook(() => useHistory(store));

        act(() => {
            store.setProp("counter", 1);
        });

        const link = result.current;

        unmount();

        (expect as any)(link.isDisposed).toBe(true);

        act(() => {
            store.setProp("counter", 2);
        });

        // detached: no new steps, undo is no-op
        (expect as any)(link.canUndo).toBe(false);
        (expect as any)(link.undo()).toBe(false);
        (expect as any)(store.prop("counter")).toBe(2);
    });
});
