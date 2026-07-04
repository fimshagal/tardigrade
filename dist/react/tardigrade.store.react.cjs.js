/* Tardigrade store react bridge v1.3.1 */

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
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("react"),T=require("tardigrade-store"),g=s.createContext(null),v=({store:e,children:t})=>s.createElement(g.Provider,{value:e},t),f=e=>{const t=s.useContext(g),r=e??t;if(!r)throw new Error("Tardigrade react bridge: store wasn't provided. Pass it into the hook directly or wrap your components with <TardigradeProvider store={...}>");return r},P=(e,t)=>{const r=s.useRef(null);return r.current||(r.current=T.createTardigrade(e,t)),r.current},p=e=>typeof e=="object"&&e!==null,R=e=>p(e)?typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e)):e,S=(e,t)=>{if(Object.is(e,t))return!0;if(!p(e)||!p(t))return!1;try{return JSON.stringify(e)===JSON.stringify(t)}catch{return!1}},y=(e,t)=>{const r=f(t),[o,i]=s.useState(()=>r.hasProp(e)?r.prop(e):null),u=s.useRef(o);s.useEffect(()=>{const a=c=>{if(S(u.current,c))return;const d=R(c);u.current=d,i(d)};a(r.hasProp(e)?r.prop(e):null);const l=(c,d)=>{if(Array.isArray(c)){if(!c.includes(e))return;a(d[e]);return}c===e&&a(d)};return r.addListener(l),()=>{r.isAlive&&r.removeListener(l)}},[r,e]);const n=s.useCallback(a=>{r.setProp(e,a)},[r,e]);return[o,n]},h=e=>{const t=f(e),[r,o]=s.useState(()=>t.props),i=s.useRef(r);return s.useEffect(()=>{const u=()=>{const n=t.props;S(i.current,n)||(i.current=n,o(n))};return u(),t.addListener(u),()=>{t.isAlive&&t.removeListener(u)}},[t]),r},C=(e,t)=>{const r=f(t),[o,i]=s.useState(null);return s.useEffect(()=>{const n=(a,l)=>{a===e&&i(l)};return r.addListener(n),()=>{r.isAlive&&r.removeListener(n)}},[r,e]),[s.useCallback(()=>r.callResolver(e),[r,e]),o]},L=(e,t,r=S)=>{const o=f(t),i=s.useRef(e);i.current=e;const u=s.useRef(r);u.current=r;const[n,a]=s.useState(()=>e(o.props)),l=s.useRef(n);return s.useEffect(()=>{const c=()=>{const d=i.current(o.props);u.current(l.current,d)||(l.current=d,a(d))};return c(),o.addListener(c),()=>{o.isAlive&&o.removeListener(c)}},[o]),n};exports.TardigradeContext=g;exports.TardigradeProvider=v;exports.useTardigrade=P;exports.useTardigradeProp=y;exports.useTardigradeProps=h;exports.useTardigradeResolver=C;exports.useTardigradeSelector=L;exports.useTardigradeStore=f;
