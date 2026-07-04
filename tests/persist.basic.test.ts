import { describe, it, expect, vi, afterEach } from "vitest";
import { createTardigrade } from "../sources";
import { persist, createInMemoryStorage } from "../sources/persist";

describe("Tardigrade persist - basics", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("should save snapshot and restore it into a fresh store", () => {
        const storage = createInMemoryStorage();

        const store = createTardigrade({ theme: "light", counter: 0 });
        const link = persist(store, { key: "app", storage, saveAfter: 0 });

        store.setProp("theme", "dark");
        store.setProp("counter", 5);

        (expect as any)(JSON.parse(storage.read("app")!)).toEqual({
            version: 1,
            data: { theme: "dark", counter: 5 },
        });

        link.dispose();

        // reload simulation
        const freshStore = createTardigrade({ theme: "light", counter: 0 });
        persist(freshStore, { key: "app", storage });

        (expect as any)(freshStore.prop("theme")).toBe("dark");
        (expect as any)(freshStore.prop("counter")).toBe(5);
    });

    it("should debounce auto-save", () => {
        vi.useFakeTimers();

        const storage = createInMemoryStorage();
        const store = createTardigrade({ counter: 0 });

        persist(store, { key: "app", storage, saveAfter: 300 });

        store.setProp("counter", 1);
        store.setProp("counter", 2);

        (expect as any)(storage.read("app")).toBeNull();

        vi.advanceTimersByTime(300);

        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ counter: 2 });
    });

    it("should apply pick on save but not on restore", () => {
        const storage = createInMemoryStorage();

        storage.write("app", JSON.stringify({ version: 1, data: { counter: 9, extra: "from-storage" } }));

        const store = createTardigrade({ counter: 0, secret: "token" });

        const link = persist(store, {
            key: "app",
            storage,
            saveAfter: 0,
            pick: (props) => ({ counter: props.counter }),
        });

        // restore merged everything, including props outside of pick
        (expect as any)(store.prop("counter")).toBe(9);
        (expect as any)(store.prop("extra")).toBe("from-storage");

        link.save();

        // save keeps only picked props
        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ counter: 9 });
    });

    it("forget should remove key without touching the store", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ counter: 1 });
        const link = persist(store, { key: "app", storage, saveAfter: 0 });

        link.save();
        (expect as any)(storage.read("app")).not.toBeNull();

        link.forget();

        (expect as any)(storage.read("app")).toBeNull();
        (expect as any)(store.prop("counter")).toBe(1);
    });

    it("should not save on resolver calls", async () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ counter: 0, bring: () => 7 });

        persist(store, { key: "app", storage, saveAfter: 0 });

        await store.callResolver("bring");

        (expect as any)(storage.read("app")).toBeNull();
    });

    it("should report malformed envelope through onError and keep store untouched", () => {
        const storage = createInMemoryStorage();
        storage.write("app", "not a json at all");

        const onError = vi.fn();
        const store = createTardigrade({ counter: 1 });

        persist(store, { key: "app", storage, onError });

        (expect as any)(onError).toHaveBeenCalled();
        (expect as any)(store.prop("counter")).toBe(1);
    });
});
