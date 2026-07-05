import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { ward } from "../sources/ward";

describe("Tardigrade ward - dispose and single link", () => {
    it("after dispose writes pass without rules", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        guard.addRule("counter", () => ({ allow: false }));

        store.setProp("counter", 1);
        (expect as any)(store.prop("counter")).toBe(0);

        guard.dispose();
        (expect as any)(guard.isDisposed).toBe(true);

        store.setProp("counter", 1);
        (expect as any)(store.prop("counter")).toBe(1);
    });

    it("second ward() on the same store throws", () => {
        const store = createTardigrade({ counter: 0 });
        ward(store);

        (expect as any)(() => ward(store)).toThrowError(/already registered/);
    });

    it("ward can be re-created after dispose", () => {
        const store = createTardigrade({ counter: 0 });

        const first = ward(store);
        first.dispose();

        const second = ward(store);
        second.addRule("counter", () => ({ allow: false }));

        store.setProp("counter", 1);
        (expect as any)(store.prop("counter")).toBe(0);
    });

    it("addRule on disposed link throws", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        guard.dispose();

        (expect as any)(() => guard.addRule(() => ({ allow: true }))).toThrowError(/disposed/);
    });

    it("hold suspends rules, unhold resumes", () => {
        const store = createTardigrade({ counter: 0 });
        const guard = ward(store);

        guard.addRule("counter", () => ({ allow: false }));

        guard.hold();
        (expect as any)(guard.isHeld).toBe(true);

        store.setProp("counter", 1);
        (expect as any)(store.prop("counter")).toBe(1);

        guard.unhold();

        store.setProp("counter", 2);
        (expect as any)(store.prop("counter")).toBe(1);
    });
});
