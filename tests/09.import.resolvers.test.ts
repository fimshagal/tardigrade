import { describe, it, expect, vi } from 'vitest';
import { createTardigrade } from '../sources';

describe('Tardigrade Store - \"importResolvers\" test', async () => {
    it('should correctly import resolvers without override and with', async () => {
        const donorStore = createTardigrade();
        const store = createTardigrade();

        store.addResolver('resolverA', () => 'valueA');
        const listenerA = vi.fn();
        store.addResolverListener('resolverA', listenerA);

        store.addResolver('resolverB', () => 'oldValueB');
        const listenerB = vi.fn();
        store.addResolverListener('resolverB', listenerB);

        donorStore.addResolver('resolverC', () => 'valueC');
        donorStore.addResolver('resolverB', () => 'valueB');

        store.importResolvers(donorStore, false);

        await store.callResolver('resolverB');
        (expect as any)(listenerB).toHaveBeenCalledWith('oldValueB');

        (expect as any)(store.hasResolver('resolverC')).toBe(true);

        store.importResolvers(donorStore, true);

        await store.callResolver('resolverB');
        (expect as any)(listenerB).toHaveBeenCalledWith('valueB');
    });
});