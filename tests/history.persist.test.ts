import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { history } from "../sources/history";
import { persist, createInMemoryStorage } from "../sources/persist";

describe("Tardigrade history - persist interplay", () => {
    it("undo should be auto-saved by persist (storage follows the visible state)", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ counter: 0 });

        const timeline = history(store);
        persist(store, { key: "app", storage, saveAfter: 0 });

        store.setProp("counter", 1);
        store.setProp("counter", 2);

        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ counter: 2 });

        timeline.undo();

        // undo restores via setProp, persist sees it as a regular change and saves
        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ counter: 1 });
    });

    it("persist restore should not pollute history when attached after restore", () => {
        const storage = createInMemoryStorage();
        storage.write("app", JSON.stringify({ version: 1, data: { counter: 42 } }));

        const store = createTardigrade({ counter: 0 });

        // order matters: persist restores first, then history takes the baseline
        persist(store, { key: "app", storage, saveAfter: 0 });
        const timeline = history(store);

        (expect as any)(store.prop("counter")).toBe(42);
        (expect as any)(timeline.canUndo).toBe(false);
    });

    it("history attached before restore records the restore as one undoable step", () => {
        const storage = createInMemoryStorage();
        storage.write("app", JSON.stringify({ version: 1, data: { counter: 42 } }));

        const store = createTardigrade({ counter: 0 });

        const timeline = history(store);
        persist(store, { key: "app", storage, saveAfter: 0 });

        (expect as any)(store.prop("counter")).toBe(42);
        (expect as any)(timeline.canUndo).toBe(true);

        timeline.undo();

        (expect as any)(store.prop("counter")).toBe(0);
    });
});
