import { describe, it, expect, vi } from "vitest";
import { createTardigrade } from "../sources";
import { history } from "../sources/history";

describe("Tardigrade history - basics", () => {
    it("should auto-record setProp steps and undo/redo them", () => {
        const store = createTardigrade({ counter: 0, title: "draft" });
        const timeline = history(store);

        store.setProp("counter", 1);
        store.setProp("counter", 2);

        (expect as any)(timeline.canUndo).toBe(true);
        (expect as any)(timeline.canRedo).toBe(false);

        (expect as any)(timeline.undo()).toBe(true);
        (expect as any)(store.prop("counter")).toBe(1);

        (expect as any)(timeline.undo()).toBe(true);
        (expect as any)(store.prop("counter")).toBe(0);

        (expect as any)(timeline.canUndo).toBe(false);
        (expect as any)(timeline.undo()).toBe(false);

        (expect as any)(timeline.redo()).toBe(true);
        (expect as any)(store.prop("counter")).toBe(1);

        (expect as any)(timeline.redo()).toBe(true);
        (expect as any)(store.prop("counter")).toBe(2);

        (expect as any)(timeline.canRedo).toBe(false);
        (expect as any)(timeline.redo()).toBe(false);
    });

    it("should record setProps batch as a single step", () => {
        const store = createTardigrade({ a: 1, b: 2 });
        const timeline = history(store);

        store.setProps({ a: 10, b: 20 });

        timeline.undo();

        (expect as any)(store.prop("a")).toBe(1);
        (expect as any)(store.prop("b")).toBe(2);
    });

    it("should not touch resolvers on undo", async () => {
        const store = createTardigrade({ counter: 0, bring: () => 7 });
        const timeline = history(store);

        store.setProp("counter", 1);
        timeline.undo();

        (expect as any)(store.hasResolver("bring")).toBe(true);

        const listener = vi.fn();
        store.addResolverListener("bring", listener);
        await store.callResolver("bring");

        (expect as any)(listener).toHaveBeenCalledWith(7);
    });

    it("resolver calls should not create history steps", async () => {
        const store = createTardigrade({ counter: 0, bring: () => 7 });
        const timeline = history(store);

        await store.callResolver("bring");

        (expect as any)(timeline.canUndo).toBe(false);
    });

    it("peek should return current picked snapshot without touching the store", () => {
        const store = createTardigrade({ counter: 5 });
        const timeline = history(store);

        (expect as any)(timeline.peek()).toEqual({ counter: 5 });

        store.setProp("counter", 6);

        (expect as any)(timeline.peek()).toEqual({ counter: 6 });
        (expect as any)(store.prop("counter")).toBe(6);
    });

    it("peekUndo and peekRedo should expose stack tops without popping", () => {
        const store = createTardigrade({ counter: 0 });
        const timeline = history(store);

        (expect as any)(timeline.peekUndo()).toBeNull();
        (expect as any)(timeline.peekRedo()).toBeNull();

        store.setProp("counter", 1);

        (expect as any)(timeline.peekUndo()).toEqual({ counter: 0 });
        (expect as any)(timeline.canUndo).toBe(true);

        timeline.undo();

        (expect as any)(timeline.peekRedo()).toEqual({ counter: 1 });
        (expect as any)(timeline.canRedo).toBe(true);
    });

    it("onUndo and onRedo callbacks should receive the restored snapshot", () => {
        const onUndo = vi.fn();
        const onRedo = vi.fn();

        const store = createTardigrade({ counter: 0 });
        const timeline = history(store, { onUndo, onRedo });

        store.setProp("counter", 1);

        timeline.undo();
        (expect as any)(onUndo).toHaveBeenCalledWith({ counter: 0 });

        timeline.redo();
        (expect as any)(onRedo).toHaveBeenCalledWith({ counter: 1 });
    });

    it("recordOnStart false should skip the baseline until the first change", () => {
        const store = createTardigrade({ counter: 0 });
        const timeline = history(store, { recordOnStart: false });

        (expect as any)(timeline.canUndo).toBe(false);

        // first change establishes the baseline, second creates the first undoable step
        store.setProp("counter", 1);
        (expect as any)(timeline.canUndo).toBe(false);

        store.setProp("counter", 2);
        (expect as any)(timeline.canUndo).toBe(true);

        timeline.undo();
        (expect as any)(store.prop("counter")).toBe(1);
    });

    it("dispose should detach auto-record and drop stacks", () => {
        const store = createTardigrade({ counter: 0 });
        const timeline = history(store);

        store.setProp("counter", 1);
        timeline.dispose();

        (expect as any)(timeline.isDisposed).toBe(true);
        (expect as any)(timeline.canUndo).toBe(false);

        store.setProp("counter", 2);

        (expect as any)(timeline.canUndo).toBe(false);
        (expect as any)(timeline.undo()).toBe(false);
        (expect as any)(store.prop("counter")).toBe(2);
    });
});
