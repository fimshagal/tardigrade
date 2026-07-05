/* Tardigrade persist v1.9.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("react"),i=require("tardigrade-store"),a=require("tardigrade-store/persist");function f(r,n,o){const t=s.useRef(null);t.current||(t.current=r instanceof i.Tardigrade?r:i.createTardigrade(r,o));const e=s.useRef(null),u=()=>((!e.current||e.current.isDisposed)&&(e.current=a.persist(t.current,{...n,restoreOnStart:!1})),e.current),d=u();return s.useEffect(()=>{const c=u();return n.restoreOnStart!==!1&&c.restore(),()=>c.dispose()},[]),d}exports.usePersistedTardigrade=f;
