//@ts-nocheck

import { defineConfig } from "vite";
import * as path from "node:path";
import pkg from "./package.json";
import banner from "vite-plugin-banner";

const bannerText: string = `/* Tardigrade store vue bridge v${pkg.version} */

/* Created by ${pkg.author} | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */`;

export default defineConfig({
    plugins: [
        banner(bannerText),
    ],
    build: {
        outDir: "dist/vue",
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, 'sources/vue/index.ts'),
            name: 'TardigradeStoreVue',
            fileName: (format: any) => `tardigrade.store.vue.${format}.js`,
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            // keep vue and the core out of the bridge bundle:
            // the core must stay a single module instance (shared sessionKey)
            external: ["vue", "tardigrade-store"],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
});
