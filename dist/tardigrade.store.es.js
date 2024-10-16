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
var L = Object.defineProperty;
var x = (n, e, r) => e in n ? L(n, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[e] = r;
var l = (n, e, r) => (x(n, typeof e != "symbol" ? e + "" : e, r), r);
var o = /* @__PURE__ */ ((n) => (n.Null = "null", n.Undefined = "undefined", n.Function = "function", n.AsyncFunction = "asyncfunction", n.Number = "number", n.String = "string", n.Boolean = "boolean", n.Array = "array", n.Object = "object", n.Any = "any", n))(o || {});
const d = (n) => Object.prototype.toString.call(n).replace(/^\[object (.+)\]$/, "$1").toLowerCase(), y = (n) => {
  const e = d(n);
  return e !== "null" && e !== "undefined";
}, P = (n) => {
  const e = d(n);
  return e === "string" || e === "number" || e === "symbol";
}, a = (n, e) => Object.prototype.hasOwnProperty.call(n, e);
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
const O = (n) => {
  n = n || !1;
  const e = new A();
  return e.emitErrors = n, e;
}, m = () => typeof crypto.randomUUID == "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (n) => {
  const e = Math.random() * 16 | 0;
  return (n === "x" ? e : e & 3 | 8).toString(16);
});
class v {
  constructor(e, r) {
    l(this, "_resolvers", {});
    l(this, "_props", {});
    l(this, "_resolverListenerHandlers", {});
    l(this, "_propListenerHandlers", {});
    l(this, "_listenerHandlers", []);
    l(this, "_alive", !0);
    l(this, "_mergeAgent", null);
    l(this, "_incidentsHandler", null);
    l(this, "_sessionKey", null);
    l(this, "_strictObjectsInterfaces", !1);
    l(this, "_name", m());
    if (!e)
      throw Error("Tardigrade constructor error");
    const { emitErrors: s, name: t, strictObjectsInterfaces: i } = r;
    t && (this._name = t), i && (this._strictObjectsInterfaces = i), this._incidentsHandler = O(s), this._sessionKey = e;
  }
  static isFn(e) {
    const r = d(e);
    return r === o.Function || r === o.AsyncFunction;
  }
  hasResolver(e) {
    var r;
    return this._alive ? a(this._resolvers, e) : ((r = this.incidentsHandler) == null || r.error("This store doesn't support anymore"), !1);
  }
  addResolver(e, r) {
    var s, t, i;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!v.isFn(r)) {
      (t = this.incidentsHandler) == null || t.error("Resolver have to be a function");
      return;
    }
    if (a(this._resolvers, e)) {
      (i = this.incidentsHandler) == null || i.error("Resolver has been already planted");
      return;
    }
    this._resolvers[e] = r;
  }
  setResolver(e, r) {
    var s, t, i;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!v.isFn(r)) {
      (t = this.incidentsHandler) == null || t.error("Resolver have to be a function");
      return;
    }
    if (!a(this._resolvers, e)) {
      (i = this.incidentsHandler) == null || i.error("Resolver has been planted");
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
    a(this._resolvers, e) && (delete this._resolvers[e], delete this._resolverListenerHandlers[e]);
  }
  async callResolver(e) {
    var s, t;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!a(this._resolvers, e)) {
      (t = this.incidentsHandler) == null || t.error("This resolver hasn't been created yet or been deleted");
      return;
    }
    const r = await this._resolvers[e](this.props);
    this.handleOnCallResolver(e, r), a(this._resolverListenerHandlers, e) && this._resolverListenerHandlers[e].forEach((i) => i(r));
  }
  addResolverListener(e, r) {
    var s, t;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!a(this._resolvers, e)) {
      (t = this.incidentsHandler) == null || t.error(`There is no resolver with name "${e}"`);
      return;
    }
    a(this._resolverListenerHandlers, e) || (this._resolverListenerHandlers[e] = []), this._resolverListenerHandlers[e].push(r);
  }
  removeResolverListener(e, r) {
    var s;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    a(this._resolverListenerHandlers, e) && (this._resolverListenerHandlers[e] = this._resolverListenerHandlers[e].filter((t) => t !== r));
  }
  removeAllResolverListeners(e) {
    var r;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    a(this._resolverListenerHandlers, e) && delete this._resolverListenerHandlers[e];
  }
  addProp(e, r) {
    var s;
    if (v.isFn(r)) {
      (s = this.incidentsHandler) == null || s.error("Prop can't be a function. Use resolvers for this purpose");
      return;
    }
    this.silentAddProp(e, r), this.handleOnSetProp(this._props[e]);
  }
  hasProp(e) {
    var r;
    return this._alive ? a(this._props, e) : ((r = this.incidentsHandler) == null || r.error("This store doesn't support anymore"), !1);
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
    this.removeAllPropListeners(e), delete this._props[e];
  }
  setProp(e, r) {
    var p, c, u, f, _;
    if (!this._alive) {
      (p = this.incidentsHandler) == null || p.error("This store doesn't support anymore");
      return;
    }
    if (!this.hasProp(e)) {
      (c = this.incidentsHandler) == null || c.error(`Prop "${e}" wasn't registered. You have to add this prop first`);
      return;
    }
    const s = (H, b) => {
      this._props[H].value = b, this.handleOnSetProp(this._props[H]);
    }, t = this._props[e], i = d(r);
    if (!y(r)) {
      s(e, null);
      return;
    }
    if (t.type !== i) {
      (u = this.incidentsHandler) == null || u.error(`New value must have same type as initial value for prop "${e}"`);
      return;
    }
    if (t.isValueScalar) {
      if (r === t.value)
        return;
      s(e, r);
      return;
    }
    if (!this.isObjectJsonFriendly(r)) {
      (f = this.incidentsHandler) == null || f.error("Complex data has to be json-friendly");
      return;
    }
    if (this._strictObjectsInterfaces && t.type === o.Object) {
      if (!this.checkObjectInterface(t.interface, r)) {
        (_ = this.incidentsHandler) == null || _.error("Income object interface isn't correct");
        return;
      }
      s(e, r);
      return;
    }
    s(e, r);
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
    this._propListenerHandlers[e] = this._propListenerHandlers[e].filter((i) => i !== r);
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
    Object.entries(s).forEach(([i, h]) => {
      if (this.hasProp(i)) {
        if (!r)
          return;
        this.setProp(i, h);
      } else
        this.addProp(i, h);
    });
  }
  merge(e, r) {
    var t;
    if (!this._alive) {
      (t = this.incidentsHandler) == null || t.error("This store doesn't support anymore");
      return;
    }
    const s = Object.keys(e.props);
    this.silentImportProps(e, r), this.importAllPropsListenerHandlers(e, r), this.importAllListenersHandlers(e, r), this.importResolvers(e, r), this.importAllResolversListenerHandlers(e, r), e.kill(this._sessionKey), e.setMergeAgent(this._sessionKey, this), s.forEach((i) => {
      this.handleOnSetProp(this._props[i]);
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
  checkObjectInterface(e, r) {
    const s = Object.keys(e), t = Object.keys(e);
    if (s.length !== t.length)
      return !1;
    for (const i of s) {
      const h = e[i];
      if (!a(r, i))
        return !1;
      if (h !== o.Any && d(r[i]) !== h)
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
    Object.entries(s).forEach(([i, h]) => {
      if (this.hasProp(i)) {
        if (!r)
          return;
        this.silentSetProp(i, h);
      } else
        this.silentAddProp(i, h);
    });
  }
  silentSetProp(e, r) {
    var p, c, u, f;
    if (!this.hasProp(e)) {
      (p = this.incidentsHandler) == null || p.error(`Prop "${e}" wasn't registered. You have to add this prop first`);
      return;
    }
    const s = (_, H) => {
      this._props[_].value = H;
    }, t = this._props[e], i = d(r);
    if (!y(r)) {
      s(e, null);
      return;
    }
    if (t.type !== i) {
      (c = this.incidentsHandler) == null || c.error(`New value must have same type as initial value for prop "${e}"`);
      return;
    }
    if (t.isValueScalar) {
      if (r === t.value)
        return;
      s(e, r);
      return;
    }
    if (!this.isObjectJsonFriendly(r)) {
      (u = this.incidentsHandler) == null || u.error("Complex data has to be json-friendly");
      return;
    }
    if (this._strictObjectsInterfaces && t.type === o.Object) {
      if (!this.checkObjectInterface(t.interface, r)) {
        (f = this.incidentsHandler) == null || f.error("Income object interface isn't correct");
        return;
      }
      s(e, r);
      return;
    }
    s(e, r);
  }
  silentAddProp(e, r) {
    var h, p, c, u, f;
    if (!this._alive) {
      (h = this.incidentsHandler) == null || h.error("This store doesn't support anymore");
      return;
    }
    if (v.isFn(r)) {
      (p = this.incidentsHandler) == null || p.error("Prop can't be a function. Use resolvers for this purpose");
      return;
    }
    if (this.hasProp(e)) {
      (c = this.incidentsHandler) == null || c.error("Prop can't be override, you have to remove prop first");
      return;
    }
    if (!y(r)) {
      (u = this.incidentsHandler) == null || u.error("Value can't be nullable");
      return;
    }
    const s = d(r), t = P(r);
    if (t) {
      this._props[e] = { name: e, value: r, type: s, isValueScalar: t };
      return;
    }
    if (!this.isObjectJsonFriendly(r)) {
      (f = this.incidentsHandler) == null || f.error("Complex data has to be json-friendly");
      return;
    }
    this._props[e] = this._strictObjectsInterfaces && s === o.Object ? { name: e, value: r, type: s, isValueScalar: t, interface: this.extractInterface(r) } : { name: e, value: r, type: s, isValueScalar: t };
  }
  extractInterface(e) {
    const r = {};
    return Object.entries(e).forEach(([s, t]) => {
      const i = d(t);
      if (i === o.Null || i === o.Undefined) {
        r[s] = o.Any;
        return;
      }
      r[s] = i;
    }), r;
  }
  importAllResolversListenerHandlers(e, r) {
    const s = e.exportAllResolversListenerHandlers(this._sessionKey);
    this._propListenerHandlers = r ? {
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
    return a(this._propListenerHandlers, e);
  }
  handleOnCallResolver(e, r) {
    for (const s of this._listenerHandlers)
      s(e, r, this.props);
  }
  handleOnSetProp(e) {
    if (this.isPropListened(e.name))
      for (const r of this._propListenerHandlers[e.name])
        r(e.value);
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
    return JSON.parse(JSON.stringify(e));
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
const j = () => Symbol(m()), R = j();
console.log("Tardigrade v1.1.24");
const S = (n, e) => {
  e = e || {};
  const r = new v(R, e);
  return n && Object.entries(n).forEach(([s, t]) => {
    switch (d(t)) {
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
  S as createTardigrade
};
