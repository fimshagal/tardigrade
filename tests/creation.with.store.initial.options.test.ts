import { describe, it, expect, vi } from "vitest";
import { createTardigrade } from "../sources";
import { Tardigrade } from "../sources/tardigrade";
import { getTardigradeMethodsNames } from "./get.tardigrade.methods.names";

describe('Tardigrade Store creation with initial data', () => {
    it("should create a store instance and apply initial options properly", async () => {
        const initialData = {
            propA: { a: 0, b: 0, c: 0 },
        };

        const initialOptions = {
            name: "Alice",
            strictObjectsInterfaces: true,
        };

        const tardigrade: Tardigrade = createTardigrade(initialData, initialOptions);

        (expect as any)(tardigrade).toBeDefined();

        getTardigradeMethodsNames()
            .forEach((name) => (expect as any)(tardigrade).toHaveProperty(name));

        (expect as any)(tardigrade.name).toBe("Alice");

        tardigrade.setProp('propA', { f: 0 });

        const propA = tardigrade.prop('propA');

        ['a', 'b', 'c']
            .forEach((key) => {
                (expect as any)(propA).toHaveProperty(key);
            });
    });
});