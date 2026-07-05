/* Tardigrade persist v1.9.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const r=require("vue"),n=require("tardigrade-store"),u=require("tardigrade-store/persist");function c(t,s,i){const d=t instanceof n.Tardigrade?t:n.createTardigrade(t,i),e=u.persist(d,{...s,restoreOnStart:!1}),o=s.restoreOnStart!==!1;return r.getCurrentInstance()?r.onMounted(()=>{o&&e.restore()}):o&&e.restore(),r.getCurrentScope()&&r.onScopeDispose(()=>e.dispose()),e}exports.usePersistedTardigrade=c;
