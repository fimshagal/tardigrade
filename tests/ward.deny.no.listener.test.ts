import { describe, it, expect, vi } from "vitest";
import { createTardigrade } from "../sources";
import { ward } from "../sources/ward";
import { persist, createInMemoryStorage } from "../sources/persist";

describe("Tardigrade ward - denied write fires no side effects", () => {
    it("prop and global listeners are not called on deny", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        const propListener = vi.fn();
        const globalListener = vi.fn();

        store.addPropListener("counter", propListener);
        store.addListener(globalListener);

        guard.addRule("counter", () => ({ allow: false, reason: "nope" }));

        store.setProp("counter", 1);

        (expect as any)(propListener).not.toHaveBeenCalled();
        (expect as any)(globalListener).not.toHaveBeenCalled();
    });

    it("persist auto-save is not triggered by a denied write", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ counter: 0 });

        const guard = ward(store);
        persist(store, { key: "app", storage, saveAfter: 0 });

        guard.addRule("counter", () => ({ allow: false }));

        store.setProp("counter", 1);

        (expect as any)(storage.read("app")).toBeNull();
    });
});
