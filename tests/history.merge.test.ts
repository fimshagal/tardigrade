import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { history } from "../sources/history";

describe("Tardigrade history - merge interplay", () => {
    it("hold/unhold around merge should record it as a single step", () => {
        const host = createTardigrade({ a: 1 });
        const donor = createTardigrade({ b: 2, c: 3 });

        const timeline = history(host);

        timeline.hold();
        host.merge(donor);
        timeline.unhold();

        (expect as any)(host.props).toEqual({ a: 1, b: 2, c: 3 });

        timeline.undo();

        (expect as any)(host.props).toEqual({ a: 1 });

        timeline.redo();

        (expect as any)(host.props).toEqual({ a: 1, b: 2, c: 3 });
    });

    it("merge without hold should auto-record steps per donor prop", () => {
        const host = createTardigrade({ a: 1 });
        const donor = createTardigrade({ b: 2 });

        const timeline = history(host);

        host.merge(donor);

        (expect as any)(timeline.canUndo).toBe(true);

        timeline.undo();

        (expect as any)(host.props).toEqual({ a: 1 });
    });
});
