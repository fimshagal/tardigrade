import {describe, it, expect, vi, Mock} from "vitest";
import { createTardigrade } from "../sources";
import { Tardigrade } from "../sources/tardigrade";

describe('Tardigrade Store props base methods and listener', () => {
    it("it should correctly add, set, get, remove props and notify listeners", async () => {
        const propName: string = "prop";
        const propValue: number = 0;
        const nextPropValue: number = 1;

        const tardigrade: Tardigrade = createTardigrade();
        const listener: Mock = vi.fn();

        tardigrade.addProp(propName, propValue);
        tardigrade.addPropListener(propName, listener);
        (expect as any)(tardigrade.prop(propName)).toBe(propValue);

        tardigrade.setProp(propName, nextPropValue);
        (expect as any)(tardigrade.prop(propName)).toBe(nextPropValue);
        (expect as any)(listener).toHaveBeenCalledWith(nextPropValue);

        tardigrade.removeProp(propName);
        (expect as any)(tardigrade.prop(propName)).toBeNull();
        (expect as any)(tardigrade.hasProp(propName)).toBe(false);
    });
});