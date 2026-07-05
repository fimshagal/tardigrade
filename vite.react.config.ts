//@ts-nocheck

import { defineConfig } from "vite";
import * as path from "node:path";
import pkg from "./package.json";
import banner from "vite-plugin-banner";

const bannerText: string = `/* Tardigrade store react bridge v${pkg.version} */

/* Created by ${pkg.author} | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */`;

export default defineConfig({
    plugins: [
        banner(bannerText),
    ],
    build: {
        outDir: "dist/react",
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, 'sources/react/index.ts'),
            name: 'TardigradeStoreReact',
            fileName: (format: any) => `tardigrade.store.react.${format}.js`,
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            // keep react and the core out of the bridge bundle:
            // the core must stay a single module instance (shared sessionKey)
            external: ["react", "react/jsx-runtime", "tardigrade-store"],
            output: {
                globals: {
                    react: "React",
                },
            },
        },
    },
});
