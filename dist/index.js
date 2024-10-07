
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
}