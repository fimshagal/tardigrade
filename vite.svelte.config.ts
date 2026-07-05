//@ts-nocheck

import { defineConfig } from "vite";
import * as path from "node:path";
import pkg from "./package.json";
import banner from "vite-plugin-banner";

const bannerText: string = `/* Tardigrade store svelte bridge v${pkg.version} */

/* Created by ${pkg.author} | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */`;

export default defineConfig({
    plugins: [
        banner(bannerText),
    ],
    build: {
        outDir: "dist/svelte",
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, 'sources/svelte/index.ts'),
            name: 'TardigradeStoreSvelte',
            fileName: (format: any) => `tardigrade.store.svelte.${format}.js`,
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            // the bridge implements the svelte store contract by hand, so only the core is external
            external: ["tardigrade-store"],
        },
    },
});
