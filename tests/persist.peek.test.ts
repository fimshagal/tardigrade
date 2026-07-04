import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { persist, createInMemoryStorage } from "../sources/persist";

describe("Tardigrade persist - peek", () => {
    it("peek returns the snapshot that save would write, without writing", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ a: 1, b: 2, secret: "token" });

        const link = persist(store, {
            key: "app",
            storage,
            saveAfter: 0,
            pick: (props) => ({ a: props.a, b: props.b }),
        });

        const snapshot = link.peek();

        (expect as any)(snapshot).toEqual({ a: 1, b: 2 });
        (expect as any)(storage.read("app")).toBeNull();

        link.save();

        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual(snapshot);
    });

    it("peek respects allowlist", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ a: 1, b: 2 });
        const link = persist(store, { key: "app", storage, saveAfter: 0 });

        link.retain("b");

        (expect as any)(link.peek()).toEqual({ b: 2 });
    });
});
