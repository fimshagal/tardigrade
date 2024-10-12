import {describe, it, expect, vi} from "vitest";
import { createTardigrade } from "../sources";
import { Tardigrade } from "../sources/tardigrade";
import {as} from "vitest/dist/chunks/reporters.DAfKSDh5";

describe('Tardigrade Store - async resolver test', async () => {
    it("it should fetch data async and notify listener", async () => {
        const resolverName = "resolver";
        const resolverListener = vi.fn();
        const mockFetchResponse = [{ id: 1, title: 'Test Post' }];
        const testUrl = 'url://';

        global.fetch = vi.fn(async () => {
           return Promise.resolve({
               json: async () => mockFetchResponse,
           });
        });

        const tardigrade: Tardigrade = createTardigrade({
            [resolverName]: async () => {
                const response = await fetch('url://');
                return response.json();
            },
        });

        tardigrade.addResolverListener(resolverName, resolverListener);

        await tardigrade.callResolver(resolverName);

        (expect as any)(global.fetch).toHaveBeenCalledWith(testUrl);
        (expect as any)(resolverListener).toHaveBeenCalledWith(mockFetchResponse);
    });
});