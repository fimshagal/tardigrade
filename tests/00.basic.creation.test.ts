import { describe, it, expect } from "vitest";
import { createTardigrade } from "../sources";
import { Tardigrade } from "../sources/tardigrade";
import { getTardigradeMethodsNames } from "./get.tardigrade.methods.names";

describe('Tardigrade Store creation', () => {
    it("should create a store instance without parameters", () => {
        const tardigrade: Tardigrade = createTardigrade();

        (expect as any)(tardigrade).toBeDefined();

        getTardigradeMethodsNames()
            .forEach((name: string) => (expect as any)(tardigrade).toHaveProperty(name));
    });
});