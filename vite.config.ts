/// <reference types="vitest" />
//@ts-nocheck

import { defineConfig } from "vite";
import * as path from "node:path";
import pkg from "./package.json";
import banner from "vite-plugin-banner";

const bannerText: string = `/* Tardigrade store v${pkg.version} */

/* Created by ${pkg.author} | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */`;

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['tests/**/*.test.{js,ts,tsx}'],
    },
    resolve: {
        // array form matters: the more specific subpath must be matched first
        alias: [
            { find: "tardigrade-store/persist", replacement: path.resolve(__dirname, 'sources/persist/index.ts') },
            { find: "tardigrade-store/history", replacement: path.resolve(__dirname, 'sources/history/index.ts') },
            { find: "tardigrade-store/ward", replacement: path.resolve(__dirname, 'sources/ward/index.ts') },
            { find: "tardigrade-store/vue", replacement: path.resolve(__dirname, 'sources/vue/index.ts') },
            { find: "tardigrade-store/svelte", replacement: path.resolve(__dirname, 'sources/svelte/index.ts') },
            { find: "tardigrade-store", replacement: path.resolve(__dirname, 'sources/index.ts') },
        ],
    },
    plugins: [
        banner(bannerText),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'sources/index.ts'),
            name: 'TardigradeStore',
            fileName: (format: any) => `tardigrade.store.${format}.js`,
            formats: ['es', 'cjs', 'umd', 'iife'],
        },
    },
    rollupOptions: {
        output: {
            dir: "dist",
            preserveModules: true,
            globals: {},
        },
    },
    server: {
        open: 'sources/index.html',
    }
});