import { describe, it, expect, vi } from "vitest";
import { createTardigrade } from "../sources";
import { persist, createInMemoryStorage } from "../sources/persist";

describe("Tardigrade persist - dead store handling", () => {
    it("save and restore are no-op with onError on a killed store", () => {
        const storage = createInMemoryStorage();
        storage.write("app", JSON.stringify({ version: 1, data: { b: 5 } }));

        const main = createTardigrade({ a: 1 });
        const target = createTardigrade({ b: 2 });

        main.merge(target); // target is killed by merge

        const onError = vi.fn();
        const link = persist(target, { key: "app", storage, restoreOnStart: false, onError });

        link.save();
        link.restore();

        (expect as any)(onError).toHaveBeenCalledTimes(2);
        // storage still holds the original envelope, save didn't overwrite it
        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ b: 5 });
    });

    it("peek returns empty object for a killed store", () => {
        const main = createTardigrade({ a: 1 });
        const target = createTardigrade({ b: 2 });

        main.merge(target);

        const link = persist(target, {
            key: "app",
            storage: createInMemoryStorage(),
            restoreOnStart: false,
            onError: () => {},
        });

        (expect as any)(link.peek()).toEqual({});
    });
});
