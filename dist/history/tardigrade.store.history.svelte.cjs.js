/* Tardigrade history v1.9.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const i=require("tardigrade-store/history"),c=n=>{let d=n;const e=new Set;return{set:o=>{o!==d&&(d=o,e.forEach(s=>s(d)))},readable:{subscribe:o=>(o(d),e.add(o),()=>e.delete(o))}}},l=(n,d)=>{const e=i.history(n,d),o=c(e.canUndo),s=c(e.canRedo),r=()=>{o.set(e.canUndo),s.set(e.canRedo)},a=()=>r();return n.addListener(a),{store:n,undo:()=>{const t=e.undo();return r(),t},redo:()=>{const t=e.redo();return r(),t},record:()=>{e.record(),r()},hold:()=>e.hold(),unhold:()=>{e.unhold(),r()},clear:()=>{e.clear(),r()},peek:()=>e.peek(),peekUndo:()=>e.peekUndo(),peekRedo:()=>e.peekRedo(),dispose:()=>{n.isAlive&&n.removeListener(a),e.dispose()},canUndo:o.readable,canRedo:s.readable,get isHeld(){return e.isHeld},get isDisposed(){return e.isDisposed}}};exports.tardigradeHistory=l;
