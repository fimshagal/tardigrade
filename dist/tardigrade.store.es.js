/* Tardigrade store v1.8.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
var m = Object.defineProperty;
var b = (i, e, r) => e in i ? m(i, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : i[e] = r;
var l = (i, e, r) => (b(i, typeof e != "symbol" ? e + "" : e, r), r);
var o = /* @__PURE__ */ ((i) => (i.Null = "null", i.Undefined = "undefined", i.Function = "function", i.AsyncFunction = "asyncfunction", i.Number = "number", i.String = "string", i.Boolean = "boolean", i.Array = "array", i.Object = "object", i.Any = "any", i))(o || {});
const p = (i) => Object.prototype.toString.call(i).replace(/^\[object (.+)\]$/, "$1").toLowerCase(), L = (i) => {
  const e = p(i);
  return e !== "null" && e !== "undefined";
}, x = (i) => {
  const e = p(i);
  return e === "string" || e === "number" || e === "symbol";
}, h = (i, e) => Object.prototype.hasOwnProperty.call(i, e);
class A {
  constructor() {
    l(this, "_header", "Tardigrade");
    l(this, "_emitErrors", !1);
  }
  warn(e) {
    e = e || "Unknown warn", console.warn(e);
  }
  error(e) {
    if (e = e || "Unknown error", this._emitErrors)
      throw Error(`[${this._header}]: ${e}`);
    console.error(e);
  }
  set emitErrors(e) {
    this._emitErrors = e;
  }
}
const R = (i) => {
  i = i || !1;
  const e = new A();
  return e.emitErrors = i, e;
}, P = () => typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (i) => {
  const e = Math.random() * 16 | 0;
  return (i === "x" ? e : e & 3 | 8).toString(16);
});
class u {
  constructor(e, r) {
    l(this, "_resolvers", {});
    l(this, "_props", {});
    l(this, "_resolverListenerHandlers", {});
    l(this, "_propListenerHandlers", {});
    l(this, "_listenerHandlers", []);
    l(this, "_alive", !0);
    l(this, "_mergeAgent", null);
    l(this, "_wardRunner", null);
    l(this, "_wardRunning", !1);
    l(this, "_incidentsHandler", null);
    l(this, "_sessionKey", null);
    l(this, "_strictObjectsInterfaces", !1);
    l(this, "_name", P());
    if (!e)
      throw Error("Tardigrade constructor error");
    const { emitErrors: s, name: t, strictObjectsInterfaces: n } = r;
    t && (this._name = t), n && (this._strictObjectsInterfaces = n), this._incidentsHandler = R(s), this._sessionKey = e;
  }
  static isFn(e) {
    const r = p(e);
    return r === o.Function || r === o.AsyncFunction;
  }
  hasResolver(e) {
    var r;
    return this._alive ? h(this._resolvers, e) : ((r = this.incidentsHandler) == null || r.error("This store doesn't support anymore"), !1);
  }
  addResolver(e, r) {
    var s, t, n;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!u.isFn(r)) {
      (t = this.incidentsHandler) == null || t.error("Resolver have to be a function");
      return;
    }
    if (h(this._resolvers, e)) {
      (n = this.incidentsHandler) == null || n.error("Resolver has been already planted");
      return;
    }
    this._resolvers[e] = r;
  }
  setResolver(e, r) {
    var s, t, n;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!u.isFn(r)) {
      (t = this.incidentsHandler) == null || t.error("Resolver have to be a function");
      return;
    }
    if (!h(this._resolvers, e)) {
      (n = this.incidentsHandler) == null || n.error("Resolver has been planted");
      return;
    }
    this._resolvers[e] = r;
  }
  removeResolver(e) {
    var r;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    h(this._resolvers, e) && (delete this._resolvers[e], delete this._resolverListenerHandlers[e]);
  }
  async callResolver(e) {
    var s, t;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!h(this._resolvers, e)) {
      (t = this.incidentsHandler) == null || t.error("This resolver hasn't been created yet or been deleted");
      return;
    }
    const r = await this._resolvers[e](this.props);
    this.handleOnCallResolver(e, r), h(this._resolverListenerHandlers, e) && this._resolverListenerHandlers[e].forEach((n) => n(r));
  }
  addResolverListener(e, r) {
    var s, t;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!h(this._resolvers, e)) {
      (t = this.incidentsHandler) == null || t.error(`There is no resolver with name "${e}"`);
      return;
    }
    h(this._resolverListenerHandlers, e) || (this._resolverListenerHandlers[e] = []), this._resolverListenerHandlers[e].push(r);
  }
  removeResolverListener(e, r) {
    var s;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    h(this._resolverListenerHandlers, e) && (this._resolverListenerHandlers[e] = this._resolverListenerHandlers[e].filter((t) => t !== r));
  }
  removeAllResolverListeners(e) {
    var r;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    h(this._resolverListenerHandlers, e) && delete this._resolverListenerHandlers[e];
  }
  addProp(e, r) {
    var s;
    if (u.isFn(r)) {
      (s = this.incidentsHandler) == null || s.error("Prop can't be a function. Use resolvers for this purpose");
      return;
    }
    this.silentAddProp(e, r) && this.handleOnSetProp(this._props[e]);
  }
  hasProp(e) {
    var r;
    return this._alive ? h(this._props, e) : ((r = this.incidentsHandler) == null || r.error("This store doesn't support anymore"), !1);
  }
  removeProp(e) {
    var r, s;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    if (!this.hasProp(e)) {
      (s = this.incidentsHandler) == null || s.error("Prop can't be deleted, you have to remove prop first");
      return;
    }
    this.isPropListened(e) && this.removeAllPropListeners(e), delete this._props[e];
  }
  setProp(e, r) {
    var s;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    this.writeProp(e, r) && this.handleOnSetProp(this._props[e]);
  }
  setProps(e) {
    var n, a;
    if (!this._alive) {
      (n = this.incidentsHandler) == null || n.error("This store doesn't support anymore");
      return;
    }
    const r = this.runWard({ kind: "setProps", patch: e });
    if (r && !r.allow) {
      (a = this.incidentsHandler) == null || a.error(`Ward denied batch update${r.reason ? `: ${r.reason}` : ""}`);
      return;
    }
    const s = [], t = {};
    if (Object.entries(e).forEach(([d, c]) => {
      this.writeProp(d, c) && (s.push(d), t[d] = this._props[d].value);
    }), !!s.length) {
      for (const d of s)
        this.notifyPropListeners(this._props[d]);
      for (const d of this._listenerHandlers)
        d(s, t, this.props);
    }
  }
  addPropListener(e, r) {
    var s, t;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("store doesn't support anymore");
      return;
    }
    if (!this.hasProp(e)) {
      (t = this.incidentsHandler) == null || t.error(`Prop "${e}" wasn't registered. You have to add this prop first`);
      return;
    }
    this.isPropListened(e) || (this._propListenerHandlers[e] = []), this._propListenerHandlers[e].push(r);
  }
  removePropListener(e, r) {
    var s, t;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!this.isPropListened(e)) {
      (t = this.incidentsHandler) == null || t.error(`Prop "${e}" doesn't have any listeners`);
      return;
    }
    this._propListenerHandlers[e] = this._propListenerHandlers[e].filter((n) => n !== r);
  }
  removeAllPropListeners(e) {
    var r, s;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    if (!this.isPropListened(e)) {
      (s = this.incidentsHandler) == null || s.warn(`Prop "${e}" doesn't have any listeners`);
      return;
    }
    delete this._propListenerHandlers[e];
  }
  prop(e) {
    var s, t;
    if (!this._alive)
      return (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore"), null;
    if (!this.hasProp(e))
      return (t = this.incidentsHandler) == null || t.error(`Prop "${e}" wasn't registered. You have to add this prop first`), null;
    const r = this._props[e];
    return r.isValueScalar ? r.value : this.cloneComplexData(r.value);
  }
  addListener(e) {
    var r;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    this._listenerHandlers.push(e);
  }
  removeListener(e) {
    var r;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    this._listenerHandlers = this._listenerHandlers.filter((s) => s !== e);
  }
  removeAllListeners() {
    var e;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    this._listenerHandlers = [];
  }
  importResolvers(e, r) {
    var t;
    if (!this._alive) {
      (t = this.incidentsHandler) == null || t.error("This store doesn't support anymore");
      return;
    }
    const s = e.exportAllResolvers(this._sessionKey);
    this._resolvers = r ? {
      ...this._resolvers,
      ...s
    } : {
      ...s,
      ...this._resolvers
    };
  }
  importProps(e, r) {
    var t;
    if (!this._alive) {
      (t = this.incidentsHandler) == null || t.error("This store doesn't support anymore");
      return;
    }
    const s = e.props;
    Object.entries(s).forEach(([n, a]) => {
      if (this.hasProp(n)) {
        if (!r)
          return;
        this.setProp(n, a);
      } else
        this.addProp(n, a);
    });
  }
  merge(e, r) {
    var t;
    if (!this._alive) {
      (t = this.incidentsHandler) == null || t.error("This store doesn't support anymore");
      return;
    }
    const s = Object.keys(e.props);
    this.silentImportProps(e, r), this.importAllPropsListenerHandlers(e, r), this.importAllListenersHandlers(e, r), this.importResolvers(e, r), this.importAllResolversListenerHandlers(e, r), e.kill(this._sessionKey), e.setMergeAgent(this._sessionKey, this), s.forEach((n) => {
      h(this._props, n) && this.handleOnSetProp(this._props[n]);
    });
  }
  removeAllResolvers() {
    const e = Object.keys(this._resolvers);
    for (const r of e)
      this.removeAllResolverListeners(r), this.removeResolver(r);
  }
  removeAllProps() {
    const e = Object.keys(this.props);
    for (const r of e)
      this.removeAllPropListeners(r), this.removeProp(r);
  }
  reset() {
    var e;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    this.removeAllListeners(), this.removeAllProps(), this.removeAllResolvers();
  }
  kill(e) {
    e !== this._sessionKey || !this._alive || (this.reset(), this._alive = !1);
  }
  exportAllPropsListenerHandlers(e) {
    var r;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    return e !== this._sessionKey ? null : { ...this._propListenerHandlers };
  }
  exportAllResolvers(e) {
    var r;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    return e !== this._sessionKey ? null : { ...this._resolvers };
  }
  exportAllResolversListenerHandlers(e) {
    var r;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    return e !== this._sessionKey ? null : { ...this._resolverListenerHandlers };
  }
  exportAllListenersHandlers(e) {
    var r;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    return e !== this._sessionKey ? null : [...this._listenerHandlers];
  }
  setMergeAgent(e, r) {
    this._mergeAgent = r;
  }
  // extension point for the ward package only, not a part of the public store API
  registerWardRunner(e) {
    if (this._wardRunner)
      throw Error("Tardigrade: a ward runner is already registered for this store. Dispose the previous ward link first");
    return this._wardRunner = e, () => {
      this._wardRunner === e && (this._wardRunner = null);
    };
  }
  runWard(e) {
    if (!this._wardRunner || this._wardRunning)
      return null;
    this._wardRunning = !0;
    try {
      return this._wardRunner(e) ?? null;
    } finally {
      this._wardRunning = !1;
    }
  }
  checkObjectInterface(e, r) {
    const s = Object.keys(e), t = Object.keys(r);
    if (s.length !== t.length)
      return !1;
    for (const n of s) {
      const a = e[n];
      if (!h(r, n))
        return !1;
      if (a !== o.Any && p(r[n]) !== a)
        return !1;
    }
    return !0;
  }
  silentImportProps(e, r) {
    var t;
    if (!this._alive) {
      (t = this.incidentsHandler) == null || t.error("This store doesn't support anymore");
      return;
    }
    const s = e.props;
    Object.entries(s).forEach(([n, a]) => {
      if (this.hasProp(n)) {
        if (!r)
          return;
        this.writeProp(n, a);
      } else
        this.silentAddProp(n, a);
    });
  }
  // validates and writes a single prop value, returns true when the value was actually written
  writeProp(e, r) {
    var c, f, _, v, H;
    if (!this.hasProp(e))
      return (c = this.incidentsHandler) == null || c.error(`Prop "${e}" wasn't registered. You have to add this prop first`), !1;
    const s = this.runWard({ kind: "setProp", name: e, value: r });
    if (s && !s.allow)
      return (f = this.incidentsHandler) == null || f.error(`Ward denied writing prop "${e}"${s.reason ? `: ${s.reason}` : ""}`), !1;
    s && s.allow && s.value !== void 0 && (r = s.value);
    const t = (y) => (this._props[e].value = y, !0), n = this._props[e], a = p(r);
    return L(r) ? n.type !== a ? ((_ = this.incidentsHandler) == null || _.error(`New value must have same type as initial value for prop "${e}"`), !1) : n.isValueScalar ? r === n.value ? !1 : t(r) : this.isObjectJsonFriendly(r) ? this._strictObjectsInterfaces && n.type === o.Object && !this.checkObjectInterface(n.interface, r) ? ((H = this.incidentsHandler) == null || H.error("Income object interface isn't correct"), !1) : t(r) : ((v = this.incidentsHandler) == null || v.error("Complex data has to be json-friendly"), !1) : t(null);
  }
  // returns true when the prop was actually created
  silentAddProp(e, r) {
    var d, c, f, _, v, H;
    if (!this._alive)
      return (d = this.incidentsHandler) == null || d.error("This store doesn't support anymore"), !1;
    if (u.isFn(r))
      return (c = this.incidentsHandler) == null || c.error("Prop can't be a function. Use resolvers for this purpose"), !1;
    if (this.hasProp(e))
      return (f = this.incidentsHandler) == null || f.error("Prop can't be override, you have to remove prop first"), !1;
    const s = this.runWard({ kind: "addProp", name: e, value: r });
    if (s && !s.allow)
      return (_ = this.incidentsHandler) == null || _.error(`Ward denied adding prop "${e}"${s.reason ? `: ${s.reason}` : ""}`), !1;
    if (s && s.allow && s.value !== void 0 && (r = s.value), !L(r))
      return (v = this.incidentsHandler) == null || v.error("Value can't be nullable"), !1;
    const t = p(r), n = x(r);
    return n ? (this._props[e] = { name: e, value: r, type: t, isValueScalar: n }, !0) : this.isObjectJsonFriendly(r) ? (this._props[e] = this._strictObjectsInterfaces && t === o.Object ? { name: e, value: r, type: t, isValueScalar: n, interface: this.extractInterface(r) } : { name: e, value: r, type: t, isValueScalar: n }, !0) : ((H = this.incidentsHandler) == null || H.error("Complex data has to be json-friendly"), !1);
  }
  extractInterface(e) {
    const r = {};
    return Object.entries(e).forEach(([s, t]) => {
      const n = p(t);
      if (n === o.Null || n === o.Undefined) {
        r[s] = o.Any;
        return;
      }
      r[s] = n;
    }), r;
  }
  importAllResolversListenerHandlers(e, r) {
    const s = e.exportAllResolversListenerHandlers(this._sessionKey);
    this._resolverListenerHandlers = r ? {
      ...this._resolverListenerHandlers,
      ...s
    } : {
      ...s,
      ...this._resolverListenerHandlers
    };
  }
  importAllPropsListenerHandlers(e, r) {
    const s = e.exportAllPropsListenerHandlers(this._sessionKey);
    this._propListenerHandlers = r ? {
      ...this._propListenerHandlers,
      ...s
    } : {
      ...s,
      ...this._propListenerHandlers
    };
  }
  importAllListenersHandlers(e, r) {
    const s = e.exportAllListenersHandlers(this._sessionKey), t = [
      ...this._listenerHandlers,
      ...s
    ];
    this._listenerHandlers = r ? [...new Set(t)] : t;
  }
  isPropListened(e) {
    return h(this._propListenerHandlers, e);
  }
  handleOnCallResolver(e, r) {
    for (const s of this._listenerHandlers)
      s(e, r, this.props);
  }
  notifyPropListeners(e) {
    if (this.isPropListened(e.name))
      for (const r of this._propListenerHandlers[e.name])
        r(e.value);
  }
  handleOnSetProp(e) {
    this.notifyPropListeners(e);
    for (const r of this._listenerHandlers)
      r(e.name, e.value, this.props);
  }
  isObjectJsonFriendly(e) {
    try {
      return JSON.stringify(e), !0;
    } catch {
      return !1;
    }
  }
  cloneComplexData(e) {
    return typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e));
  }
  get mergeAgent() {
    return this._mergeAgent;
  }
  get isAlive() {
    return this._alive;
  }
  get name() {
    return this._name;
  }
  get props() {
    var r;
    if (!this._alive)
      return (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore"), {};
    const e = {};
    return Object.entries(this._props).forEach(([s, t]) => {
      e[s] = t.isValueScalar ? t.value : this.cloneComplexData(t.value);
    }), e;
  }
  get incidentsHandler() {
    return this._incidentsHandler;
  }
}
const w = () => Symbol(P()), O = w();
console.log("Tardigrade v1.8.0");
const g = (i, e) => {
  e = e || {};
  const r = new u(O, e);
  return i && Object.entries(i).forEach(([s, t]) => {
    switch (p(t)) {
      case o.Function:
      case o.AsyncFunction:
        r.addResolver(s, t);
        break;
      case o.Number:
      case o.String:
      case o.Boolean:
      case o.Array:
      case o.Object:
        r.addProp(s, t);
        break;
      case o.Null:
      case o.Undefined:
      default:
        console.warn(`Tardigrade: data item "${s}" has incorrect type`);
        break;
    }
  }), r;
};
export {
  u as Tardigrade,
  o as TardigradeTypes,
  g as createTardigrade
};
