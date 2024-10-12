import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { Tardigrade } from "../sources/tardigrade";

describe('Tardigrade Store - remove all props', () => {
    it("it should correctly remove all props at once", async () => {
        const propAName = "propA";
        const propBName = "propB";
        const tardigrade: Tardigrade = createTardigrade({
            [propAName]: 0,
            [propBName]: 0,
        });

        (expect as any)(tardigrade.hasProp(propAName)).toBe(true);
        (expect as any)(tardigrade.hasProp(propBName)).toBe(true);

        tardigrade.removeAllProps();

        (expect as any)(tardigrade.hasProp(propAName)).toBe(false);
        (expect as any)(tardigrade.hasProp(propBName)).toBe(false);
    });
});