
'use strict';

(() => {
    if (typeof module !== 'undefined' && module.exports && require) {
        // CommonJS
        module.exports = require('./dist/tardigrade.store.cjs.js');
    } else if (typeof define === 'function' && define.amd) {
        // AMD (Asynchronous Module Definition)
        define(function () {
            return require('./dist/tardigrade.store.umd.js');
        });
    } else if (typeof window !== 'undefined') {
        // Browser environment (IIFE)
        window.createTardigrade = window.createTardigrade || {};
        const script = document.createElement('script');
        script.src = 'dist/tardigrade.store.iife.js';
        document.body.appendChild(script);
    } else {
        // ES Module
        import('./dist/tardigrade.store.es.js').then(module => {
            window.createTardigrade = module;
        });
    }
})();
