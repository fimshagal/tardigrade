import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { history } from "../sources/history";

describe("Tardigrade history - pick", () => {
    it("unpicked props should not enter the history nor be touched by undo", () => {
        const store = createTardigrade({ title: "draft", sidebarOpen: false });

        const timeline = history(store, {
            pick: (p) => ({ title: p.title }),
        });

        store.setProp("title", "New");
        store.setProp("sidebarOpen", true);

        timeline.undo();

        (expect as any)(store.prop("title")).toBe("draft");
        // ephemeral UI state survives undo
        (expect as any)(store.prop("sidebarOpen")).toBe(true);
    });

    it("changes of unpicked props should not create steps", () => {
        const store = createTardigrade({ title: "draft", sidebarOpen: false });

        const timeline = history(store, {
            pick: (p) => ({ title: p.title }),
        });

        store.setProp("sidebarOpen", true);
        store.setProp("sidebarOpen", false);

        (expect as any)(timeline.canUndo).toBe(false);
    });

    it("undo should not remove unpicked dynamic props", () => {
        const store = createTardigrade({ title: "draft" });

        const timeline = history(store, {
            pick: (p) => ({ title: p.title }),
        });

        store.setProp("title", "New");
        store.addProp("sessionToken", "abc"); // outside of pick

        timeline.undo();

        (expect as any)(store.prop("title")).toBe("draft");
        (expect as any)(store.prop("sessionToken")).toBe("abc");
    });

    it("picked dynamic props should be added and removed by undo/redo", () => {
        const store = createTardigrade({ title: "draft" });

        const timeline = history(store, {
            pick: (p) => {
                const picked: Record<string, unknown> = { title: p.title };

                if ("subtitle" in p) {
                    picked.subtitle = p.subtitle;
                }

                return picked;
            },
        });

        store.addProp("subtitle", "sub");

        timeline.undo();
        (expect as any)(store.hasProp("subtitle")).toBe(false);

        timeline.redo();
        (expect as any)(store.prop("subtitle")).toBe("sub");
    });
});
