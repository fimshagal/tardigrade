import { describe, it, expect, vi } from "vitest";
import { createTardigrade } from "../sources";
import { persist, createInMemoryStorage } from "../sources/persist";

describe("Tardigrade persist - migrations", () => {
    it("should run migrate when stored version is lower", () => {
        const storage = createInMemoryStorage();
        storage.write("app", JSON.stringify({ version: 1, data: { fullName: "John Doe" } }));

        const migrate = vi.fn((saved, fromVersion) => {
            if (fromVersion < 2) {
                const [firstName, lastName] = (saved.fullName as string).split(" ");
                return { firstName, lastName };
            }
            return saved;
        });

        const store = createTardigrade({ firstName: "", lastName: "" });

        persist(store, { key: "app", storage, version: 2, migrate });

        (expect as any)(migrate).toHaveBeenCalledTimes(1);
        (expect as any)(migrate).toHaveBeenCalledWith({ fullName: "John Doe" }, 1);
        (expect as any)(store.prop("firstName")).toBe("John");
        (expect as any)(store.prop("lastName")).toBe("Doe");
    });

    it("should not run migrate when versions match", () => {
        const storage = createInMemoryStorage();
        storage.write("app", JSON.stringify({ version: 2, data: { counter: 5 } }));

        const migrate = vi.fn();
        const store = createTardigrade({ counter: 0 });

        persist(store, { key: "app", storage, version: 2, migrate });

        (expect as any)(migrate).not.toHaveBeenCalled();
        (expect as any)(store.prop("counter")).toBe(5);
    });

    it("save should write current version into envelope", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ counter: 0 });
        const link = persist(store, { key: "app", storage, saveAfter: 0, version: 3 });

        link.save();

        (expect as any)(JSON.parse(storage.read("app")!).version).toBe(3);
    });
});
