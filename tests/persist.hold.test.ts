import { describe, it, expect, vi, afterEach } from "vitest";
import { createTardigrade } from "../sources";
import { persist, createInMemoryStorage } from "../sources/persist";

describe("Tardigrade persist - hold/unhold", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("hold blocks auto-save, unhold resumes and saves once", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ a: 0, b: 0 });
        const onSave = vi.fn();
        const link = persist(store, { key: "app", storage, saveAfter: 0, onSave });

        link.hold();
        (expect as any)(link.isHeld).toBe(true);

        store.setProp("a", 1);
        store.addProp("c", 3);
        store.removeProp("b");

        (expect as any)(storage.read("app")).toBeNull();
        (expect as any)(onSave).not.toHaveBeenCalled();

        link.unhold();

        (expect as any)(link.isHeld).toBe(false);
        (expect as any)(onSave).toHaveBeenCalledTimes(1);
        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ a: 1, c: 3 });
    });

    it("hold cancels a pending debounced save", () => {
        vi.useFakeTimers();

        const storage = createInMemoryStorage();
        const store = createTardigrade({ a: 0 });
        const link = persist(store, { key: "app", storage, saveAfter: 300 });

        store.setProp("a", 1);
        link.hold();

        vi.advanceTimersByTime(1000);

        (expect as any)(storage.read("app")).toBeNull();
    });

    it("explicit save works even on hold", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ a: 0 });
        const link = persist(store, { key: "app", storage, saveAfter: 0 });

        link.hold();
        store.setProp("a", 5);
        link.save();

        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ a: 5 });
    });

    it("dispose detaches auto-save but keeps explicit save working", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ a: 0 });
        const link = persist(store, { key: "app", storage, saveAfter: 0 });

        link.dispose();
        (expect as any)(link.isDisposed).toBe(true);

        store.setProp("a", 5);
        (expect as any)(storage.read("app")).toBeNull();

        link.save();
        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ a: 5 });
    });
});
