import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { persist, createInMemoryStorage } from "../sources/persist";

describe("Tardigrade persist - dynamic props", () => {
    it("addProp should trigger auto-save", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ step: 1 });

        persist(store, { key: "wizard", storage, saveAfter: 0 });

        store.addProp("field_email", "user@example.com");

        (expect as any)(JSON.parse(storage.read("wizard")!).data).toEqual({
            step: 1,
            field_email: "user@example.com",
        });
    });

    it("removeProp requires explicit save to leave storage", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ step: 1, draft: "text" });
        const link = persist(store, { key: "wizard", storage, saveAfter: 0 });

        link.save();
        (expect as any)(JSON.parse(storage.read("wizard")!).data).toEqual({ step: 1, draft: "text" });

        store.removeProp("draft");

        // core doesn't notify on removeProp, storage still holds the old snapshot
        (expect as any)(JSON.parse(storage.read("wizard")!).data).toEqual({ step: 1, draft: "text" });

        link.save();

        (expect as any)(JSON.parse(storage.read("wizard")!).data).toEqual({ step: 1 });
    });

    it("restore should add unknown props through addProp", () => {
        const storage = createInMemoryStorage();
        storage.write("wizard", JSON.stringify({ version: 1, data: { step: 3, field_email: "a@b.c" } }));

        const store = createTardigrade({ step: 1 });
        persist(store, { key: "wizard", storage });

        (expect as any)(store.prop("step")).toBe(3);
        (expect as any)(store.hasProp("field_email")).toBe(true);
        (expect as any)(store.prop("field_email")).toBe("a@b.c");
    });

    it("restore should skip null values for unknown props", () => {
        const storage = createInMemoryStorage();
        storage.write("wizard", JSON.stringify({ version: 1, data: { ghost: null, step: 2 } }));

        const store = createTardigrade({ step: 1 });
        persist(store, { key: "wizard", storage });

        (expect as any)(store.hasProp("ghost")).toBe(false);
        (expect as any)(store.prop("step")).toBe(2);
    });
});
