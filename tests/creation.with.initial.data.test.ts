import { describe, it, expect, vi } from "vitest";
import { createTardigrade } from "../sources";
import { Tardigrade } from "../sources/tardigrade";
import { getTardigradeMethodsNames } from "./get.tardigrade.methods.names";

describe('Tardigrade Store creation with initial data', () => {
    it("should create a store instance with initial data, apply props\'n\'resolvers properly and notify listener asynchronously", async () => {
        const resolverB = vi.fn(async () => 'resolverBValue');

        const initialData = {
            propA: 'valueA',
            resolverB,
        };

        const resolverListener = vi.fn();

        const tardigrade: Tardigrade = createTardigrade(initialData);

        (expect as any)(tardigrade).toBeDefined();

        getTardigradeMethodsNames()
            .forEach((name) => (expect as any)(tardigrade).toHaveProperty(name));

        (expect as any)(tardigrade.prop('propA')).toBe('valueA');

        tardigrade.addResolverListener('resolverB', resolverListener);

        await tardigrade.callResolver('resolverB');

        (expect as any)(resolverListener).toHaveBeenCalledWith('resolverBValue');
    });
});