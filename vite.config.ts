//@ts-nocheck

import { defineConfig } from "vite";
import * as path from "node:path";
import pkg from "./package.json";
import banner from "vite-plugin-banner";

const bannerText: string = `/* Tardigrade store v${pkg.version} */

/* Created by ${pkg.author} | fimashagal@gmail.com */
           
/*
 * Creative Commons Attribution 4.0 International (CC BY 4.0)
 *
 * You are free to:
 *
 * - Share — copy and redistribute the material in any medium or format
 * - Adapt — remix, transform, and build upon the material for any purpose, even commercially.
 *
 * Under the following terms:
 *
 * - Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
 */`;

export default defineConfig({
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
    server: {
        open: 'sources/index.html',
    }
});