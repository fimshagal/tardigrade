import { describe, it, expect, vi } from "vitest";
import { createTardigrade } from "../sources";
import { createInMemoryStorage } from "../sources/persist";
import { persistedTardigrade } from "../sources/persist/svelte";
import { tardigradeHistory } from "../sources/history/svelte";

const seed = (storage: ReturnType<typeof createInMemoryStorage>, key: string, data: object): void => {
    storage.write(key, JSON.stringify({ version: 1, data }));
};

describe("Tardigrade svelte persist", () => {
    it("creates a store, restores synchronously and auto-saves", () => {
        const storage = createInMemoryStorage();
        seed(storage, "app", { counter: 42 });

        const link = persistedTardigrade({ counter: 0 }, { key: "app", storage, saveAfter: 0 });

        (expect as any)(link.store.prop("counter")).toBe(42);

        link.store.setProp("counter", 7);
        (expect as any)(JSON.parse(storage.read("app")!)).toEqual({ version: 1, data: { counter: 7 } });

        link.dispose();
    });

    it("accepts an existing store", () => {
        const storage = createInMemoryStorage();
        seed(storage, "app", { counter: 9 });

        const store = createTardigrade({ counter: 0 });
        const link = persistedTardigrade(store, { key: "app", storage });

        (expect as any)(link.store).toBe(store);
        (expect as any)(store.prop("counter")).toBe(9);

        link.dispose();
    });
});

describe("Tardigrade svelte history", () => {
    it("canUndo/canRedo follow the store contract and flip correctly", () => {
        const store = createTardigrade({ counter: 0 });
        const timeline = tardigradeHistory(store);

        const undoFlips: boolean[] = [];
        const redoFlips: boolean[] = [];

        const offUndo = timeline.canUndo.subscribe((value) => undoFlips.push(value));
        const offRedo = timeline.canRedo.subscribe((value) => redoFlips.push(value));

        store.setProp("counter", 1); // auto-record → canUndo true
        timeline.undo();             // canUndo false, canRedo true
        timeline.redo();             // canUndo true, canRedo false

        (expect as any)(undoFlips).toEqual([false, true, false, true]);
        (expect as any)(redoFlips).toEqual([false, true, false]);
        (expect as any)(store.prop("counter")).toBe(1);

        offUndo();
        offRedo();
        timeline.dispose();
    });

    it("undo/redo restore values, hold groups steps", () => {
        const store = createTardigrade({ counter: 0, title: "a" });
        const timeline = tardigradeHistory(store);

        timeline.hold();
        store.setProp("counter", 1);
        store.setProp("title", "b");
        timeline.unhold(); // one step for both writes

        timeline.undo();

        (expect as any)(store.prop("counter")).toBe(0);
        (expect as any)(store.prop("title")).toBe("a");

        timeline.dispose();
    });

    it("dispose detaches auto-record and flag subscriptions", () => {
        const store = createTardigrade({ counter: 0 });
        const timeline = tardigradeHistory(store);

        const spy = vi.fn();
        const off = timeline.canUndo.subscribe(spy);

        timeline.dispose();
        store.setProp("counter", 5);

        (expect as any)(spy).toHaveBeenCalledTimes(1); // initial only
        (expect as any)(timeline.isDisposed).toBe(true);

        off();
    });
});
