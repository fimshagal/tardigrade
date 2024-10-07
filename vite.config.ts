//@ts-nocheck

import { defineConfig } from "vite";
import * as path from "node:path";

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'sources/index.ts'),
            name: 'Tardigrade',
            fileName: (format: any) => `tardigrade.store.${format}.js`,
            formats: ['es', 'cjs', 'umd', 'iife'],
        },
    },
    server: {
        open: 'sources/index.html',
    }
});