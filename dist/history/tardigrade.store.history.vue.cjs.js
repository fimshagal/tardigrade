/* Tardigrade history v1.9.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("vue"),u=require("tardigrade-store/history"),l=(n,i)=>{const e=u.history(n,i),d=s.shallowRef(e.canUndo),t=s.shallowRef(e.canRedo),o=()=>{d.value=e.canUndo,t.value=e.canRedo},c=()=>o();return n.addListener(c),s.getCurrentScope()&&s.onScopeDispose(()=>{n.isAlive&&n.removeListener(c),e.dispose()}),{store:n,undo:()=>{const r=e.undo();return o(),r},redo:()=>{const r=e.redo();return o(),r},record:()=>{e.record(),o()},hold:()=>e.hold(),unhold:()=>{e.unhold(),o()},clear:()=>{e.clear(),o()},peek:()=>e.peek(),peekUndo:()=>e.peekUndo(),peekRedo:()=>e.peekRedo(),dispose:()=>e.dispose(),get canUndo(){return d.value},get canRedo(){return t.value},get isHeld(){return e.isHeld},get isDisposed(){return e.isDisposed}}};exports.useHistory=l;
