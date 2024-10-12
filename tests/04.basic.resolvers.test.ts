import {describe, it, expect, vi, Mock} from "vitest";
import { createTardigrade } from "../sources";
import { Tardigrade } from "../sources/tardigrade";

describe('Tardigrade Store resolvers base methods and listener', () => {
    it("it should correctly add, set, remove props and notify listeners", async () => {
        const resolveName: string = "resolver";
        const resolverValue: string = 'resolverValue';
        const resolverListener: Mock = vi.fn();
        const resolver: Mock = vi.fn(async () => resolverValue);

        const tardigrade: Tardigrade = createTardigrade();

        tardigrade.addResolver(resolveName, resolver);
        tardigrade.addResolverListener(resolveName, resolverListener);
        await tardigrade.callResolver(resolveName);
        (expect as any)(resolverListener).toHaveBeenCalledWith(resolverValue);

        tardigrade.removeResolver(resolveName);

        (expect as any)(tardigrade.hasResolver(resolveName)).toBe(false);
    });
});