/* Tardigrade store react bridge v1.2.1 */

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
"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const s=require("react"),v=require("tardigrade-store"),g=s.createContext(null),P=({store:r,children:t})=>s.createElement(g.Provider,{value:r},t),p=r=>{const t=s.useContext(g),e=r??t;if(!e)throw new Error("Tardigrade react bridge: store wasn't provided. Pass it into the hook directly or wrap your components with <TardigradeProvider store={...}>");return e},S=(r,t)=>{const e=s.useRef(null);return e.current||(e.current=v.createTardigrade(r,t)),e.current},f=r=>typeof r=="object"&&r!==null,y=r=>f(r)?typeof structuredClone=="function"?structuredClone(r):JSON.parse(JSON.stringify(r)):r,T=(r,t)=>{if(Object.is(r,t))return!0;if(!f(r)||!f(t))return!1;try{return JSON.stringify(r)===JSON.stringify(t)}catch{return!1}},R=(r,t)=>{const e=p(t),[u,a]=s.useState(()=>e.hasProp(r)?e.prop(r):null),n=s.useRef(u);s.useEffect(()=>{const i=d=>{if(T(n.current,d))return;const l=y(d);n.current=l,a(l)};i(e.hasProp(r)?e.prop(r):null);const c=(d,l)=>{d===r&&i(l)};return e.addListener(c),()=>{e.isAlive&&e.removeListener(c)}},[e,r]);const o=s.useCallback(i=>{e.setProp(r,i)},[e,r]);return[u,o]},h=r=>{const t=p(r),[e,u]=s.useState(()=>t.props),a=s.useRef(e);return s.useEffect(()=>{const n=()=>{const o=t.props;T(a.current,o)||(a.current=o,u(o))};return n(),t.addListener(n),()=>{t.isAlive&&t.removeListener(n)}},[t]),e},C=(r,t)=>{const e=p(t),[u,a]=s.useState(null);return s.useEffect(()=>{const o=(i,c)=>{i===r&&a(c)};return e.addListener(o),()=>{e.isAlive&&e.removeListener(o)}},[e,r]),[s.useCallback(()=>e.callResolver(r),[e,r]),u]};exports.TardigradeContext=g;exports.TardigradeProvider=P;exports.useTardigrade=S;exports.useTardigradeProp=R;exports.useTardigradeProps=h;exports.useTardigradeResolver=C;exports.useTardigradeStore=p;
