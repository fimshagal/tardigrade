import { describe, it, expect, vi } from 'vitest';
import { createTardigrade } from '../sources';

describe('Tardigrade Store - merging test', async () => {
    it('should correctly merge stores without override', async () => {
        const donorStore = createTardigrade({ propA: 1, propB: 2 });
        const store = createTardigrade({ propB: 100, propC: 200 });

        store.merge(donorStore, false);

        (expect as any)(store.prop('propA')).toBe(1);
        (expect as any)(store.prop('propB')).toBe(100);
        (expect as any)(store.prop('propC')).toBe(200);

        (expect as any)(donorStore.isAlive).toBe(false);
        (expect as any)(donorStore.mergeAgent).toBe(store);
    });

    it('should correctly merge stores with override', async () => {
        const donorStore = createTardigrade({ propA: 1, propB: 2 });
        const store = createTardigrade({ propB: 100, propC: 200 });

        store.merge(donorStore, true);

        (expect as any)(store.prop('propA')).toBe(1);
        (expect as any)(store.prop('propB')).toBe(2);
        (expect as any)(store.prop('propC')).toBe(200);

        (expect as any)(donorStore.isAlive).toBe(false);
        (expect as any)(donorStore.mergeAgent).toBe(store);
    });
});