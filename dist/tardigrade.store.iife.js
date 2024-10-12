/* Tardigrade store v1.1.24 */

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
var TardigradeStore=function(c){"use strict";var R=Object.defineProperty;var S=(c,o,l)=>o in c?R(c,o,{enumerable:!0,configurable:!0,writable:!0,value:l}):c[o]=l;var a=(c,o,l)=>(S(c,typeof o!="symbol"?o+"":o,l),l);var o=(n=>(n.Null="null",n.Undefined="undefined",n.Function="function",n.AsyncFunction="asyncfunction",n.Number="number",n.String="string",n.Boolean="boolean",n.Array="array",n.Object="object",n.Any="any",n))(o||{});const l=n=>Object.prototype.toString.call(n).replace(/^\[object (.+)\]$/,"$1").toLowerCase(),b=n=>{const e=l(n);return e!=="null"&&e!=="undefined"},L=n=>{const e=l(n);return e==="string"||e==="number"||e==="symbol"},h=(n,e)=>Object.prototype.hasOwnProperty.call(n,e);class P{constructor(){a(this,"_header","Tardigrade");a(this,"_emitErrors",!1)}warn(e){e=e||"Unknown warn",console.warn(e)}error(e){if(e=e||"Unknown error",this._emitErrors)throw Error(`[${this._header}]: ${e}`);console.error(e)}set emitErrors(e){this._emitErrors=e}}const x=n=>{n=n||!1;const e=new P;return e.emitErrors=n,e},m=()=>typeof crypto.randomUUID=="function"?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,n=>{const e=Math.random()*16|0;return(n==="x"?e:e&3|8).toString(16)});class _{constructor(e,r){a(this,"_resolvers",{});a(this,"_props",{});a(this,"_resolverListenerHandlers",{});a(this,"_propListenerHandlers",{});a(this,"_listenerHandlers",[]);a(this,"_alive",!0);a(this,"_mergeAgent",null);a(this,"_incidentsHandler",null);a(this,"_sessionKey",null);a(this,"_strictObjectsInterfaces",!1);a(this,"_name",m());if(!e)throw Error("Tardigrade constructor error");const{emitErrors:s,name:t,strictObjectsInterfaces:i}=r;t&&(this._name=t),i&&(this._strictObjectsInterfaces=i),this._incidentsHandler=x(s),this._sessionKey=e}static isFn(e){const r=l(e);return r===o.Function||r===o.AsyncFunction}hasResolver(e){var r;return this._alive?h(this._resolvers,e):((r=this.incidentsHandler)==null||r.error("This store doesn't support anymore"),!1)}addResolver(e,r){var s,t,i;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}if(!_.isFn(r)){(t=this.incidentsHandler)==null||t.error("Resolver have to be a function");return}if(h(this._resolvers,e)){(i=this.incidentsHandler)==null||i.error("Resolver has been already planted");return}this._resolvers[e]=r}setResolver(e,r){var s,t,i;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}if(!_.isFn(r)){(t=this.incidentsHandler)==null||t.error("Resolver have to be a function");return}if(!h(this._resolvers,e)){(i=this.incidentsHandler)==null||i.error("Resolver has been planted");return}this._resolvers[e]=r}removeResolver(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}h(this._resolvers,e)&&(delete this._resolvers[e],delete this._resolverListenerHandlers[e])}async callResolver(e){var s,t;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}if(!h(this._resolvers,e)){(t=this.incidentsHandler)==null||t.error("This resolver hasn't been created yet or been deleted");return}const r=await this._resolvers[e](this.props);this.handleOnCallResolver(e,r),h(this._resolverListenerHandlers,e)&&this._resolverListenerHandlers[e].forEach(i=>i(r))}addResolverListener(e,r){var s,t;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}if(!h(this._resolvers,e)){(t=this.incidentsHandler)==null||t.error(`There is no resolver with name "${e}"`);return}h(this._resolverListenerHandlers,e)||(this._resolverListenerHandlers[e]=[]),this._resolverListenerHandlers[e].push(r)}removeResolverListener(e,r){var s;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}h(this._resolverListenerHandlers,e)&&(this._resolverListenerHandlers[e]=this._resolverListenerHandlers[e].filter(t=>t!==r))}removeAllResolverListeners(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}h(this._resolverListenerHandlers,e)&&delete this._resolverListenerHandlers[e]}addProp(e,r){var s;if(_.isFn(r)){(s=this.incidentsHandler)==null||s.error("Prop can't be a function. Use resolvers for this purpose");return}this.silentAddProp(e,r),this.handleOnSetProp(this._props[e])}hasProp(e){var r;return this._alive?h(this._props,e):((r=this.incidentsHandler)==null||r.error("This store doesn't support anymore"),!1)}removeProp(e){var r,s;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}if(!this.hasProp(e)){(s=this.incidentsHandler)==null||s.error("Prop can't be deleted, you have to remove prop first");return}this.removeAllPropListeners(e),delete this._props[e]}setProp(e,r){var p,u,f,v,H;if(!this._alive){(p=this.incidentsHandler)==null||p.error("This store doesn't support anymore");return}if(!this.hasProp(e)){(u=this.incidentsHandler)==null||u.error(`Prop "${e}" wasn't registered. You have to add this prop first`);return}const s=(y,j)=>{this._props[y].value=j,this.handleOnSetProp(this._props[y])},t=this._props[e],i=l(r);if(!b(r)){s(e,null);return}if(t.type!==i){(f=this.incidentsHandler)==null||f.error(`New value must have same type as initial value for prop "${e}"`);return}if(t.isValueScalar){if(r===t.value)return;s(e,r);return}if(!this.isObjectJsonFriendly(r)){(v=this.incidentsHandler)==null||v.error("Complex data has to be json-friendly");return}if(this._strictObjectsInterfaces&&t.type===o.Object){if(!this.checkObjectInterface(t.interface,r)){(H=this.incidentsHandler)==null||H.error("Income object interface isn't correct");return}s(e,r);return}s(e,r)}addPropListener(e,r){var s,t;if(!this._alive){(s=this.incidentsHandler)==null||s.error("store doesn't support anymore");return}if(!this.hasProp(e)){(t=this.incidentsHandler)==null||t.error(`Prop "${e}" wasn't registered. You have to add this prop first`);return}this.isPropListened(e)||(this._propListenerHandlers[e]=[]),this._propListenerHandlers[e].push(r)}removePropListener(e,r){var s,t;if(!this._alive){(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore");return}if(!this.isPropListened(e)){(t=this.incidentsHandler)==null||t.error(`Prop "${e}" doesn't have any listeners`);return}this._propListenerHandlers[e]=this._propListenerHandlers[e].filter(i=>i!==r)}removeAllPropListeners(e){var r,s;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}if(!this.isPropListened(e)){(s=this.incidentsHandler)==null||s.warn(`Prop "${e}" doesn't have any listeners`);return}delete this._propListenerHandlers[e]}prop(e){var s,t;if(!this._alive)return(s=this.incidentsHandler)==null||s.error("This store doesn't support anymore"),null;if(!this.hasProp(e))return(t=this.incidentsHandler)==null||t.error(`Prop "${e}" wasn't registered. You have to add this prop first`),null;const r=this._props[e];return r.isValueScalar?r.value:this.cloneComplexData(r.value)}addListener(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}this._listenerHandlers.push(e)}removeListener(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}this._listenerHandlers=this._listenerHandlers.filter(s=>s!==e)}removeAllListeners(){var e;if(!this._alive){(e=this.incidentsHandler)==null||e.error("This store doesn't support anymore");return}this._listenerHandlers=[]}importResolvers(e,r){var t;if(!this._alive){(t=this.incidentsHandler)==null||t.error("This store doesn't support anymore");return}const s=e.exportAllResolvers(this._sessionKey);this._resolvers=r?{...this._resolvers,...s}:{...s,...this._resolvers}}importProps(e,r){var t;if(!this._alive){(t=this.incidentsHandler)==null||t.error("This store doesn't support anymore");return}const s=e.props;Object.entries(s).forEach(([i,d])=>{if(this.hasProp(i)){if(!r)return;this.setProp(i,d)}else this.addProp(i,d)})}merge(e,r){var t;if(!this._alive){(t=this.incidentsHandler)==null||t.error("This store doesn't support anymore");return}const s=Object.keys(e.props);this.silentImportProps(e,r),this.importAllPropsListenerHandlers(e,r),this.importAllListenersHandlers(e,r),this.importResolvers(e,r),this.importAllResolversListenerHandlers(e,r),e.kill(this._sessionKey),e.setMergeAgent(this._sessionKey,this),s.forEach(i=>{this.handleOnSetProp(this._props[i])})}removeAllResolvers(){const e=Object.keys(this._resolvers);for(const r of e)this.removeAllResolverListeners(r),this.removeResolver(r)}removeAllProps(){const e=Object.keys(this.props);for(const r of e)this.removeAllPropListeners(r),this.removeProp(r)}reset(){var e;if(!this._alive){(e=this.incidentsHandler)==null||e.error("This store doesn't support anymore");return}this.removeAllListeners(),this.removeAllProps(),this.removeAllResolvers()}kill(e){e!==this._sessionKey||!this._alive||(this.reset(),this._alive=!1)}exportAllPropsListenerHandlers(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}return e!==this._sessionKey?null:{...this._propListenerHandlers}}exportAllResolvers(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}return e!==this._sessionKey?null:{...this._resolvers}}exportAllResolversListenerHandlers(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}return e!==this._sessionKey?null:{...this._resolverListenerHandlers}}exportAllListenersHandlers(e){var r;if(!this._alive){(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore");return}return e!==this._sessionKey?null:[...this._listenerHandlers]}setMergeAgent(e,r){this._mergeAgent=r}checkObjectInterface(e,r){const s=Object.keys(e),t=Object.keys(e);if(s.length!==t.length)return!1;for(const i of s){const d=e[i];if(!h(r,i))return!1;if(d!==o.Any&&l(r[i])!==d)return!1}return!0}silentImportProps(e,r){var t;if(!this._alive){(t=this.incidentsHandler)==null||t.error("This store doesn't support anymore");return}const s=e.props;Object.entries(s).forEach(([i,d])=>{if(this.hasProp(i)){if(!r)return;this.silentSetProp(i,d)}else this.silentAddProp(i,d)})}silentSetProp(e,r){var p,u,f,v;if(!this.hasProp(e)){(p=this.incidentsHandler)==null||p.error(`Prop "${e}" wasn't registered. You have to add this prop first`);return}const s=(H,y)=>{this._props[H].value=y},t=this._props[e],i=l(r);if(!b(r)){s(e,null);return}if(t.type!==i){(u=this.incidentsHandler)==null||u.error(`New value must have same type as initial value for prop "${e}"`);return}if(t.isValueScalar){if(r===t.value)return;s(e,r);return}if(!this.isObjectJsonFriendly(r)){(f=this.incidentsHandler)==null||f.error("Complex data has to be json-friendly");return}if(this._strictObjectsInterfaces&&t.type===o.Object){if(!this.checkObjectInterface(t.interface,r)){(v=this.incidentsHandler)==null||v.error("Income object interface isn't correct");return}s(e,r);return}s(e,r)}silentAddProp(e,r){var d,p,u,f,v;if(!this._alive){(d=this.incidentsHandler)==null||d.error("This store doesn't support anymore");return}if(_.isFn(r)){(p=this.incidentsHandler)==null||p.error("Prop can't be a function. Use resolvers for this purpose");return}if(this.hasProp(e)){(u=this.incidentsHandler)==null||u.error("Prop can't be override, you have to remove prop first");return}if(!b(r)){(f=this.incidentsHandler)==null||f.error("Value can't be nullable");return}const s=l(r),t=L(r);if(t){this._props[e]={name:e,value:r,type:s,isValueScalar:t};return}if(!this.isObjectJsonFriendly(r)){(v=this.incidentsHandler)==null||v.error("Complex data has to be json-friendly");return}this._props[e]=this._strictObjectsInterfaces&&s===o.Object?{name:e,value:r,type:s,isValueScalar:t,interface:this.extractInterface(r)}:{name:e,value:r,type:s,isValueScalar:t}}extractInterface(e){const r={};return Object.entries(e).forEach(([s,t])=>{const i=l(t);if(i===o.Null||i===o.Undefined){r[s]=o.Any;return}r[s]=i}),r}importAllResolversListenerHandlers(e,r){const s=e.exportAllResolversListenerHandlers(this._sessionKey);this._propListenerHandlers=r?{...this._resolverListenerHandlers,...s}:{...s,...this._resolverListenerHandlers}}importAllPropsListenerHandlers(e,r){const s=e.exportAllPropsListenerHandlers(this._sessionKey);this._propListenerHandlers=r?{...this._propListenerHandlers,...s}:{...s,...this._propListenerHandlers}}importAllListenersHandlers(e,r){const s=e.exportAllListenersHandlers(this._sessionKey),t=[...this._listenerHandlers,...s];this._listenerHandlers=r?[...new Set(t)]:t}isPropListened(e){return h(this._propListenerHandlers,e)}handleOnCallResolver(e,r){for(const s of this._listenerHandlers)s(e,r,this.props)}handleOnSetProp(e){if(this.isPropListened(e.name))for(const r of this._propListenerHandlers[e.name])r(e.value);for(const r of this._listenerHandlers)r(e.name,e.value,this.props)}isObjectJsonFriendly(e){try{return JSON.stringify(e),!0}catch{return!1}}cloneComplexData(e){return JSON.parse(JSON.stringify(e))}get mergeAgent(){return this._mergeAgent}get isAlive(){return this._alive}get name(){return this._name}get props(){var r;if(!this._alive)return(r=this.incidentsHandler)==null||r.error("This store doesn't support anymore"),{};const e={};return Object.entries(this._props).forEach(([s,t])=>{e[s]=t.isValueScalar?t.value:this.cloneComplexData(t.value)}),e}get incidentsHandler(){return this._incidentsHandler}}const A=(()=>Symbol(m()))();console.log("Tardigrade v1.1.24");const O=(n,e)=>{e=e||{};const r=new _(A,e);return n&&Object.entries(n).forEach(([s,t])=>{switch(l(t)){case o.Function:case o.AsyncFunction:r.addResolver(s,t);break;case o.Number:case o.String:case o.Boolean:case o.Array:case o.Object:r.addProp(s,t);break;case o.Null:case o.Undefined:default:console.warn(`Tardigrade: data item "${s}" has incorrect type`);break}}),r};return c.createTardigrade=O,Object.defineProperty(c,Symbol.toStringTag,{value:"Module"}),c}({});
