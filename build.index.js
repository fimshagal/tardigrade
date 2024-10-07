const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.js');

// Вміст index.js, який буде згенеровано
const content = `
'use strict';

if (typeof module !== 'undefined' && module.exports && require) {
    // CommonJS
    module.exports = require('./tardigrade.store.cjs.js');
} else if (typeof define === 'function' && define.amd) {
    // AMD (Asynchronous Module Definition)
    define(function () {
        return require('./tardigrade.store.umd.js');
    });
} else if (typeof window !== 'undefined') {
    // Browser environment (IIFE)
    window.createTardigrade = window.createTardigrade || {};
    const script = document.createElement('script');
    script.src = 'tardigrade.store.iife.js';
} else {
    // ES Module
    import('./tardigrade.store.es.js').then(module => {
        window.createTardigrade = module;
    });
}`;

// Переконайся, що папка dist існує, і створюй index.js
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Записуємо згенерований файл index.js у папку dist
fs.writeFileSync(indexPath, content, 'utf8');

console.log('index.js has been successfully generated in the dist folder.');