import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";

describe('Tardigrade Store - import props test', async () => {
    it("it should correctly import props with and without override", async () => {
        const donorStore = createTardigrade({ propA: 1, propB: 2 });
        const store = createTardigrade({ propB: 200, propC: 300 });

        store.importProps(donorStore, false);
        (expect as any)(store.prop('propA')).toBe(1);
        (expect as any)(store.prop('propB')).toBe(200);
        (expect as any)(store.prop('propC')).toBe(300);

        store.importProps(donorStore, true);
        (expect as any)(store.prop('propB')).toBe(2);

        (expect as any)(donorStore.prop('propA')).toBe(1);
        (expect as any)(donorStore.prop('propB')).toBe(2);
    });
});