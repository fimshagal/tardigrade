import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { history } from "../sources/history";

describe("Tardigrade history - reset interplay", () => {
    it("clear + record after reset should start a fresh baseline", () => {
        const store = createTardigrade({ counter: 5 });
        const timeline = history(store);

        store.setProp("counter", 6);

        store.reset(); // silent: no listener fires, drops all listeners too

        timeline.clear();
        timeline.record();

        (expect as any)(timeline.canUndo).toBe(false);
        (expect as any)(timeline.canRedo).toBe(false);
        (expect as any)(timeline.peek()).toEqual({});

        // auto-record is re-attached by clear() even though reset dropped listeners
        store.addProp("counter", 0);
        store.setProp("counter", 1);

        (expect as any)(timeline.canUndo).toBe(true);

        timeline.undo();
        (expect as any)(store.prop("counter")).toBe(0);
    });

    it("stale undo into a reset store should not resurrect old props silently", () => {
        const store = createTardigrade({ counter: 5 }, {});
        const timeline = history(store);

        store.setProp("counter", 6);
        store.reset();
        timeline.clear();

        (expect as any)(timeline.undo()).toBe(false);
        (expect as any)(store.props).toEqual({});
    });
});
