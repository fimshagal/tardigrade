/* Tardigrade store v1.1.9 */

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
(function(h,n){typeof exports=="object"&&typeof module<"u"?n(exports):typeof define=="function"&&define.amd?define(["exports"],n):(h=typeof globalThis<"u"?globalThis:h||self,n(h.TardigradeStore={}))})(this,function(h){"use strict";var g=Object.defineProperty;var T=(h,n,l)=>n in h?g(h,n,{enumerable:!0,configurable:!0,writable:!0,value:l}):h[n]=l;var d=(h,n,l)=>(T(h,typeof n!="symbol"?n+"":n,l),l);var n=(i=>(i.Null="null",i.Undefined="undefined",i.Function="function",i.AsyncFunction="asyncfunction",i.Number="number",i.String="string",i.Boolean="boolean",i.Array="array",i.Object="object",i))(n||{});const l=i=>Object.prototype.toString.call(i).replace(/^\[object (.+)\]$/,"$1").toLowerCase(),H=i=>{const e=l(i);return e!=="null"&&e!=="undefined"},L=i=>{const e=l(i);return e==="string"||e==="number"||e==="symbol"},a=(i,e)=>Object.prototype.hasOwnProperty.call(i,e);class P{constructor(){d(this,"_header","Tardigrade");d(this,"_emitErrors",!1)}warn(e){e=e||"Unknown warn",console.warn(e)}error(e){if(e=e||"Unknown error",this._emitErrors)throw Error(`[${this._header}]: ${e}`);console.error(e)}set emitErrors(e){this._emitErrors=e}}const m=i=>{i=i||!1;const e=new P;return e.emitErrors=i,e};class b{constructor(e,r){d(this,"_resolvers",{});d(this,"_props",{});d(this,"_resolverListenerHandlers",{});d(this,"_propListenerHandlers",{});d(this,"_listenerHandlers",[]);d(this,"_alive",!0);d(this,"_mergeAgent",null);d(this,"_incidentsHandler",null);d(this,"_sessionKey",null);if(!e)throw Error("Tardigrade constructor error");const{emitErrors:s}=r;this._incidentsHandler=m(s),this._sessionKey=e}addResolver(e,r){var s,t,o;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}if(l(r)!==n.Function&&l(r)!==n.AsyncFunction){(t=this.incidentsHandler)==null||t.error("Resolver have to be a function");return}if(a(this._resolvers,e)){(o=this.incidentsHandler)==null||o.error("Resolver has been planted");return}this._resolvers[e]=r}setResolver(e,r){var s,t,o;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}if(l(r)!==n.Function&&l(r)!==n.AsyncFunction){(t=this.incidentsHandler)==null||t.error("Resolver have to be a function");return}if(!a(this._resolvers,e)){(o=this.incidentsHandler)==null||o.error("Resolver has been planted");return}this._resolvers[e]=r}removeResolver(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}a(this._resolvers,e)&&(delete this._resolvers[e],delete this._resolverListenerHandlers[e])}async callResolver(e){var s,t;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}if(!a(this._resolvers,e)){(t=this.incidentsHandler)==null||t.error("This resolver hasn't been created yet or been deleted");return}const r=await this._resolvers[e](this.props);this.handleOnCallResolver(e,r),a(this._resolverListenerHandlers,e)&&this._resolverListenerHandlers[e].forEach(o=>o(r))}addResolverListener(e,r){var s,t;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}if(!a(this._resolvers,e)){(t=this.incidentsHandler)==null||t.error(`There is no resolver with name "${e}"`);return}a(this._resolverListenerHandlers,e)||(this._resolverListenerHandlers[e]=[]),this._resolverListenerHandlers[e].push(r)}removeResolverListener(e,r){var s;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}a(this._resolverListenerHandlers,e)&&(this._resolverListenerHandlers[e]=this._resolverListenerHandlers[e].filter(t=>t!==r))}removeAllResolverListeners(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}a(this._resolverListenerHandlers,e)&&delete this._resolverListenerHandlers[e]}addProp(e,r){this.silentAddProp(e,r),this.handleOnSetProp(this._props[e])}removeProp(e){var r,s;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}if(!this.hasProp(e)){(s=this.incidentsHandler)==null||s.error("Prop can't be deleted, you have to remove prop first");return}this.removeAllPropListeners(e),delete this._props[e]}setProp(e,r){var c,u,f,_,v;if(!this._alive){(c=this.incidentsHandler)==null||c.error("This store doesn't support anymore");return}if(!this.hasProp(e)){(u=this.incidentsHandler)==null||u.error(`Prop "${e}" wasn't registered. You have to add this prop first`);return}const s=(y,O)=>{this._props[y].value=O,this.handleOnSetProp(this._props[y])},t=this._props[e],o=l(r);if(!H(r)){s(e,null);return}if(t.type!==o){(f=this.incidentsHandler)==null||f.error(`New value must have same type as initial value for prop "${e}"`);return}if(!t.isValueScalar)try{JSON.stringify(r)}catch{(_=this.incidentsHandler)==null||_.error("Complex data has to be json-friendly");return}if(t.isValueScalar){s(e,r);return}if(!this.isObjectJsonFriendly(r)){(v=this.incidentsHandler)==null||v.error("Complex data has to be json-friendly");return}s(e,r)}addPropListener(e,r){var s,t;if(!this._alive){(s=this.incidentsHandler)==null||s.error("store doesn't support anymore");return}if(!this.hasProp(e)){(t=this.incidentsHandler)==null||t.error(`Prop "${e}" wasn't registered. You have to add this prop first`);return}this.isPropListened(e)||(this._propListenerHandlers[e]=[]),this._propListenerHandlers[e].push(r)}removePropListener(e,r){var s,t;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}if(!this.isPropListened(e)){(t=this.incidentsHandler)==null||t.error(`Prop "${e}" doesn't have any listeners`);return}this._propListenerHandlers[e]=this._propListenerHandlers[e].filter(o=>o!==r)}removeAllPropListeners(e){var r,s;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}if(!this.isPropListened(e)){(s=this.incidentsHandler)==null||s.warn(`Prop "${e}" doesn't have any listeners`);return}delete this._propListenerHandlers[e]}prop(e){var s,t;if(!this._alive)return(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore"),null;if(!this.hasProp(e))return(t=this.incidentsHandler)==null||t.error(`Prop "${e}" wasn't registered. You have to add this prop first`),null;const r=this._props[e];return r.isValueScalar?r.value:this.cloneComplexData(r.value)}hasProp(e){var r;return this._alive?a(this._props,e):((r=this.incidentsHandler)==null||r.error("This store doesn't support anymore"),!1)}addListener(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}this._listenerHandlers.push(e)}removeListener(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}this._listenerHandlers=this._listenerHandlers.filter(s=>s!==e)}removeAllListeners(){var e;if(!this._alive){(e=this.incidentsHandler)==null||e.error("This store doesn't support anymore");return}this._listenerHandlers=[]}importResolvers(e,r){const s=e.exportAllResolvers(this._sessionKey);this._resolvers=r?{...this._resolvers,...s}:{...s,...this._resolvers}}importProps(e,r){var t;if(!this._alive){(t=this.incidentsHandler)==null||t.error("This store doesn't support anymore");return}const s=e.props;Object.entries(s).forEach(([o,p])=>{if(this.hasProp(o)){if(!r)return;this.setProp(o,p)}else this.addProp(o,p)})}merge(e,r){var t;if(!this._alive){(t=this.incidentsHandler)==null||t.error("This store doesn't support anymore");return}const s=Object.keys(e.props);this.silentImportProps(e,r),this.importAllPropsListenerHandlers(e,r),this.importAllListenersHandlers(e,r),this.importResolvers(e,r),this.importAllResolversListenerHandlers(e,r),e.kill(this._sessionKey),e.setMergeAgent(this._sessionKey,this),s.forEach(o=>{this.handleOnSetProp(this._props[o])})}kill(e){if(e!==this._sessionKey||!this._alive)return;const r=Object.keys(this._props);this.removeAllListeners(),r.forEach(s=>{this.removeAllPropListeners(s),this.removeProp(s)}),this._alive=!1}exportAllPropsListenerHandlers(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}return e!==this._sessionKey?null:{...this._propListenerHandlers}}exportAllResolvers(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}return e!==this._sessionKey?null:{...this._resolvers}}exportAllResolversListenerHandlers(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}return e!==this._sessionKey?null:{...this._resolverListenerHandlers}}exportAllListenersHandlers(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}return e!==this._sessionKey?null:[...this._listenerHandlers]}setMergeAgent(e,r){this._mergeAgent=r}silentImportProps(e,r){var t;if(!this._alive){(t=this.incidentsHandler)==null||t.error("This store doesn't support anymore");return}const s=e.props;Object.entries(s).forEach(([o,p])=>{if(this.hasProp(o)){if(!r)return;this.silentSetProp(o,p)}else this.silentAddProp(o,p)})}silentSetProp(e,r){var c,u,f;if(!this.hasProp(e)){(c=this.incidentsHandler)==null||c.error(`Prop "${e}" wasn't registered. You have to add this prop first`);return}const s=(_,v)=>{this._props[_].value=v},t=this._props[e],o=l(r);if(!H(r)){s(e,null);return}if(t.type!==o){(u=this.incidentsHandler)==null||u.error(`New value must have same type as initial value for prop "${e}"`);return}if(t.isValueScalar){s(e,r);return}if(!this.isObjectJsonFriendly(r)){(f=this.incidentsHandler)==null||f.error("Complex data has to be json-friendly");return}s(e,r)}silentAddProp(e,r){var p,c,u,f;if(!this._alive){(p=this.incidentsHandler)==null||p.error("This store doesn't support anymore");return}if(this.hasProp(e)){(c=this.incidentsHandler)==null||c.error("Prop can't be override, you have to remove prop first");return}if(!H(r)){(u=this.incidentsHandler)==null||u.error("Value can't be nullable");return}const s=l(r),t=L(r);if(t){this._props[e]={name:e,value:r,type:s,isValueScalar:t};return}if(!this.isObjectJsonFriendly(r)){(f=this.incidentsHandler)==null||f.error("Complex data has to be json-friendly");return}this._props[e]={name:e,value:r,type:s,isValueScalar:t}}importAllResolversListenerHandlers(e,r){const s=e.exportAllResolversListenerHandlers(this._sessionKey);this._propListenerHandlers=r?{...this._resolverListenerHandlers,...s}:{...s,...this._resolverListenerHandlers}}importAllPropsListenerHandlers(e,r){const s=e.exportAllPropsListenerHandlers(this._sessionKey);this._propListenerHandlers=r?{...this._propListenerHandlers,...s}:{...s,...this._propListenerHandlers}}importAllListenersHandlers(e,r){const s=e.exportAllListenersHandlers(this._sessionKey),t=[...this._listenerHandlers,...s];this._listenerHandlers=r?[...new Set(t)]:t}isPropListened(e){return a(this._propListenerHandlers,e)}handleOnCallResolver(e,r){for(const s of this._listenerHandlers)s(e,r,this.props)}handleOnSetProp(e){if(this.isPropListened(e.name))for(const r of this._propListenerHandlers[e.name])r(e.value);for(const r of this._listenerHandlers)r(e.name,e.value,this.props)}isObjectJsonFriendly(e){try{return JSON.stringify(e),!0}catch{return!1}}cloneComplexData(e){return JSON.parse(JSON.stringify(e))}get mergeAgent(){return this._mergeAgent}get isAlive(){return this._alive}get props(){var r;if(!this._alive)return(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore"),{};const e={};return Object.entries(this._props).forEach(([s,t])=>{e[s]=t.isValueScalar?t.value:this.cloneComplexData(t.value)}),e}get incidentsHandler(){return this._incidentsHandler}}const A=(()=>Symbol(crypto.randomUUID()))();console.log("Tardigrade works!");const S=(i,e)=>{e=e||{};const r=new b(A,e);return i&&Object.entries(i).forEach(([s,t])=>{switch(l(t)){case n.Function:case n.AsyncFunction:r.addResolver(s,t);break;case n.Number:case n.String:case n.Boolean:case n.Array:case n.Object:r.addProp(s,t);break;case n.Null:case n.Undefined:default:console.warn(`Tardigrade: data item "${s}" has incorrect type`);break}}),r};h.createTardigrade=S,Object.defineProperty(h,Symbol.toStringTag,{value:"Module"})});
