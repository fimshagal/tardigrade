//@ts-nocheck

import { defineConfig } from "vite";
import * as path from "node:path";
import pkg from "./package.json";
import banner from "vite-plugin-banner";

const bannerText: string = `/* Tardigrade ward v${pkg.version} */

/* Created by ${pkg.author} | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */`;

export default defineConfig({
    plugins: [
        banner(bannerText),
    ],
    build: {
        outDir: "dist/ward",
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, "sources/ward/index.ts"),
            fileName: (format: any) => `tardigrade.store.ward.${format}.js`,
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            // core stays external so the app always shares a single store module instance
            external: ["tardigrade-store"],
        },
    },
});
