import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { Tardigrade } from "../sources/tardigrade";

describe('Tardigrade Store - remove all resolvers', () => {
    it("it should correctly remove all resolvers at once", async () => {
        const resolverAName = "resolverA";
        const resolverBName = "resolverB";
        const tardigrade: Tardigrade = createTardigrade({
            [resolverAName]: () => true,
            [resolverBName]: () => true,
        });

        (expect as any)(tardigrade.hasResolver(resolverAName)).toBe(true);
        (expect as any)(tardigrade.hasResolver(resolverBName)).toBe(true);

        tardigrade.removeAllResolvers();

        (expect as any)(tardigrade.hasProp(resolverAName)).toBe(false);
        (expect as any)(tardigrade.hasProp(resolverBName)).toBe(false);
    });
});