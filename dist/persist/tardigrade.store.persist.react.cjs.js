/* Tardigrade persist v1.5.0 */

/* Created by fSha | fimashagal@gmail.com */
           
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
 */
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("react"),i=require("tardigrade-store"),a=require("tardigrade-store/persist");function f(r,n,o){const t=s.useRef(null);t.current||(t.current=r instanceof i.Tardigrade?r:i.createTardigrade(r,o));const e=s.useRef(null),u=()=>((!e.current||e.current.isDisposed)&&(e.current=a.persist(t.current,{...n,restoreOnStart:!1})),e.current),d=u();return s.useEffect(()=>{const c=u();return n.restoreOnStart!==!1&&c.restore(),()=>c.dispose()},[]),d}exports.usePersistedTardigrade=f;
