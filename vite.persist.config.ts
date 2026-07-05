//@ts-nocheck

import { defineConfig } from "vite";
import * as path from "node:path";
import pkg from "./package.json";
import banner from "vite-plugin-banner";

const bannerText: string = `/* Tardigrade persist v${pkg.version} */

/* Created by ${pkg.author} | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */`;

export default defineConfig({
    plugins: [
        banner(bannerText),
    ],
    build: {
        outDir: "dist/persist",
        emptyOutDir: false,
        lib: {
            entry: {
                "tardigrade.store.persist": path.resolve(__dirname, "sources/persist/index.ts"),
                "tardigrade.store.persist.react": path.resolve(__dirname, "sources/persist/react/index.ts"),
                "tardigrade.store.persist.vue": path.resolve(__dirname, "sources/persist/vue/index.ts"),
                "tardigrade.store.persist.svelte": path.resolve(__dirname, "sources/persist/svelte/index.ts"),
            },
            formats: ["es", "cjs"],
            fileName: (format: any, entryName: any) => `${entryName}.${format}.js`,
        },
        rollupOptions: {
            // core and persist stay external so the app always shares single instances
            external: ["react", "react/jsx-runtime", "vue", "tardigrade-store", "tardigrade-store/persist"],
        },
    },
});
