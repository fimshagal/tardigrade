import { describe, it, expect, vi } from 'vitest';
import { createTardigrade } from '../sources';

describe('Tardigrade Store - reset test', async () => {
    it('should correctly reset store and remove props, listeners and resolvers', async () => {
        const propName = "prop";
        const resolverName = "resolver";

        const store = createTardigrade({
            [propName]: 1,
            [resolverName]: () => 2,
        });
        const listener = vi.fn();

        store.addResolverListener(resolverName, listener);

        (expect as any)(store.prop(propName)).toBe(1);
        (expect as any)(store.hasResolver(resolverName)).toBe(true);

        await store.callResolver(resolverName);

        (expect as any)(listener).toHaveBeenCalledWith(2);

        store.reset();

        (expect as any)(store.prop(propName)).toBeNull();
        (expect as any)(store.hasResolver(resolverName)).toBe(false);
    });
});