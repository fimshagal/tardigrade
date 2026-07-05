/* Tardigrade persist v1.9.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const r=require("tardigrade-store"),i=require("tardigrade-store/persist");function o(e,d,t){const s=e instanceof r.Tardigrade?e:r.createTardigrade(e,t);return i.persist(s,d)}exports.persistedTardigrade=o;
