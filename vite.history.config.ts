//@ts-nocheck

import { defineConfig } from "vite";
import * as path from "node:path";
import pkg from "./package.json";
import banner from "vite-plugin-banner";

const bannerText: string = `/* Tardigrade history v${pkg.version} */

/* Created by ${pkg.author} | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */`;

export default defineConfig({
    plugins: [
        banner(bannerText),
    ],
    build: {
        outDir: "dist/history",
        emptyOutDir: false,
        lib: {
            entry: {
                "tardigrade.store.history": path.resolve(__dirname, "sources/history/index.ts"),
                "tardigrade.store.history.react": path.resolve(__dirname, "sources/history/react/index.ts"),
                "tardigrade.store.history.vue": path.resolve(__dirname, "sources/history/vue/index.ts"),
                "tardigrade.store.history.svelte": path.resolve(__dirname, "sources/history/svelte/index.ts"),
            },
            formats: ["es", "cjs"],
            fileName: (format: any, entryName: any) => `${entryName}.${format}.js`,
        },
        rollupOptions: {
            // core and history stay external so the app always shares single instances
            external: ["react", "react/jsx-runtime", "vue", "tardigrade-store", "tardigrade-store/history"],
        },
    },
});
