import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { persist, createInMemoryStorage } from "../sources/persist";

describe("Tardigrade persist - allowlist (retain/drop)", () => {
    it("empty allowlist persists everything from pick", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ a: 1, b: 2 });
        const link = persist(store, { key: "app", storage, saveAfter: 0 });

        link.save();

        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ a: 1, b: 2 });
    });

    it("retain narrows snapshot to allowlisted keys", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ a: 1, b: 2, c: 3 });
        const link = persist(store, { key: "app", storage, saveAfter: 0 });

        link.retain("a");
        link.retain("c");
        link.save();

        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ a: 1, c: 3 });
    });

    it("drop removes key from allowlist", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ a: 1, b: 2 });
        const link = persist(store, { key: "app", storage, saveAfter: 0 });

        link.retain("a");
        link.retain("b");
        link.drop("b");
        link.save();

        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ a: 1 });
    });

    it("allowlist applies after pick", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ a: 1, b: 2, c: 3 });

        const link = persist(store, {
            key: "app",
            storage,
            saveAfter: 0,
            pick: (props) => ({ a: props.a, b: props.b }),
        });

        link.retain("b");
        link.retain("c"); // not in pick result, must be ignored
        link.save();

        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ b: 2 });
    });

    it("pick function can be replaced at runtime", () => {
        const storage = createInMemoryStorage();
        const store = createTardigrade({ a: 1, b: 2 });
        const link = persist(store, { key: "app", storage, saveAfter: 0 });

        link.pick((props) => ({ b: props.b }));
        link.save();

        (expect as any)(JSON.parse(storage.read("app")!).data).toEqual({ b: 2 });
    });
});
