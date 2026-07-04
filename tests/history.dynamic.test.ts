import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { history } from "../sources/history";

describe("Tardigrade history - dynamic props", () => {
    it("undo after addProp should remove the added prop", () => {
        const store = createTardigrade({ title: "doc" });
        const timeline = history(store);

        store.addProp("draft", "text");

        (expect as any)(store.hasProp("draft")).toBe(true);

        timeline.undo();

        (expect as any)(store.hasProp("draft")).toBe(false);
        (expect as any)(store.prop("title")).toBe("doc");

        timeline.redo();

        (expect as any)(store.prop("draft")).toBe("text");
    });

    it("removeProp + explicit record should be undoable (prop comes back)", () => {
        const store = createTardigrade({ title: "doc", draft: "text" });
        const timeline = history(store);

        store.removeProp("draft");
        timeline.record();

        (expect as any)(store.hasProp("draft")).toBe(false);
        (expect as any)(timeline.canUndo).toBe(true);

        timeline.undo();

        (expect as any)(store.prop("draft")).toBe("text");

        timeline.redo();

        (expect as any)(store.hasProp("draft")).toBe(false);
    });

    it("hold + addProp batch should undo both props at once", () => {
        const store = createTardigrade({ title: "form" });
        const timeline = history(store);

        timeline.hold();
        store.addProp("field_email", "a@b.c");
        store.addProp("field_phone", "+380");
        timeline.unhold();

        timeline.undo();

        (expect as any)(store.hasProp("field_email")).toBe(false);
        (expect as any)(store.hasProp("field_phone")).toBe(false);

        timeline.redo();

        (expect as any)(store.prop("field_email")).toBe("a@b.c");
        (expect as any)(store.prop("field_phone")).toBe("+380");
    });

    it("null values should restore as null for existing props", () => {
        const store = createTardigrade({ title: "doc" });
        const timeline = history(store);

        store.setProp("title", null);

        (expect as any)(store.prop("title")).toBeNull();

        timeline.undo();
        (expect as any)(store.prop("title")).toBe("doc");

        timeline.redo();
        (expect as any)(store.prop("title")).toBeNull();
    });
});
