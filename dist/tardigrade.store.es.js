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
var L = Object.defineProperty;
var P = (i, r, e) => r in i ? L(i, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[r] = e;
var l = (i, r, e) => (P(i, typeof r != "symbol" ? r + "" : r, e), e);
var o = /* @__PURE__ */ ((i) => (i.Null = "null", i.Undefined = "undefined", i.Function = "function", i.AsyncFunction = "asyncfunction", i.Number = "number", i.String = "string", i.Boolean = "boolean", i.Array = "array", i.Object = "object", i))(o || {});
const d = (i) => Object.prototype.toString.call(i).replace(/^\[object (.+)\]$/, "$1").toLowerCase(), H = (i) => {
  const r = d(i);
  return r !== "null" && r !== "undefined";
}, m = (i) => {
  const r = d(i);
  return r === "string" || r === "number" || r === "symbol";
}, h = (i, r) => Object.prototype.hasOwnProperty.call(i, r);
class b {
  constructor() {
    l(this, "_header", "Tardigrade");
    l(this, "_emitErrors", !1);
  }
  warn(r) {
    r = r || "Unknown warn", console.warn(r);
  }
  error(r) {
    if (r = r || "Unknown error", this._emitErrors)
      throw Error(`[${this._header}]: ${r}`);
    console.error(r);
  }
  set emitErrors(r) {
    this._emitErrors = r;
  }
}
const A = (i) => {
  i = i || !1;
  const r = new b();
  return r.emitErrors = i, r;
};
class O {
  constructor(r, e) {
    l(this, "_resolvers", {});
    l(this, "_props", {});
    l(this, "_resolverListenerHandlers", {});
    l(this, "_propListenerHandlers", {});
    l(this, "_listenerHandlers", []);
    l(this, "_alive", !0);
    l(this, "_mergeAgent", null);
    l(this, "_incidentsHandler", null);
    l(this, "_sessionKey", null);
    if (!r)
      throw Error("Tardigrade constructor error");
    const { emitErrors: s } = e;
    this._incidentsHandler = A(s), this._sessionKey = r;
  }
  addResolver(r, e) {
    var s, t, n;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (d(e) !== o.Function && d(e) !== o.AsyncFunction) {
      (t = this.incidentsHandler) == null || t.error("Resolver have to be a function");
      return;
    }
    if (h(this._resolvers, r)) {
      (n = this.incidentsHandler) == null || n.error("Resolver has been planted");
      return;
    }
    this._resolvers[r] = e;
  }
  setResolver(r, e) {
    var s, t, n;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (d(e) !== o.Function && d(e) !== o.AsyncFunction) {
      (t = this.incidentsHandler) == null || t.error("Resolver have to be a function");
      return;
    }
    if (!h(this._resolvers, r)) {
      (n = this.incidentsHandler) == null || n.error("Resolver has been planted");
      return;
    }
    this._resolvers[r] = e;
  }
  removeResolver(r) {
    var e;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    h(this._resolvers, r) && (delete this._resolvers[r], delete this._resolverListenerHandlers[r]);
  }
  async callResolver(r) {
    var s, t;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!h(this._resolvers, r)) {
      (t = this.incidentsHandler) == null || t.error("This resolver hasn't been created yet or been deleted");
      return;
    }
    const e = await this._resolvers[r](this.props);
    this.handleOnCallResolver(r, e), h(this._resolverListenerHandlers, r) && this._resolverListenerHandlers[r].forEach((n) => n(e));
  }
  addResolverListener(r, e) {
    var s, t;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!h(this._resolvers, r)) {
      (t = this.incidentsHandler) == null || t.error(`There is no resolver with name "${r}"`);
      return;
    }
    h(this._resolverListenerHandlers, r) || (this._resolverListenerHandlers[r] = []), this._resolverListenerHandlers[r].push(e);
  }
  removeResolverListener(r, e) {
    var s;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    h(this._resolverListenerHandlers, r) && (this._resolverListenerHandlers[r] = this._resolverListenerHandlers[r].filter((t) => t !== e));
  }
  removeAllResolverListeners(r) {
    var e;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    h(this._resolverListenerHandlers, r) && delete this._resolverListenerHandlers[r];
  }
  addProp(r, e) {
    this.silentAddProp(r, e), this.handleOnSetProp(this._props[r]);
  }
  removeProp(r) {
    var e, s;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    if (!this.hasProp(r)) {
      (s = this.incidentsHandler) == null || s.error("Prop can't be deleted, you have to remove prop first");
      return;
    }
    this.removeAllPropListeners(r), delete this._props[r];
  }
  setProp(r, e) {
    var p, c, u, _, f;
    if (!this._alive) {
      (p = this.incidentsHandler) == null || p.error("This store doesn't support anymore");
      return;
    }
    if (!this.hasProp(r)) {
      (c = this.incidentsHandler) == null || c.error(`Prop "${r}" wasn't registered. You have to add this prop first`);
      return;
    }
    const s = (v, y) => {
      this._props[v].value = y, this.handleOnSetProp(this._props[v]);
    }, t = this._props[r], n = d(e);
    if (!H(e)) {
      s(r, null);
      return;
    }
    if (t.type !== n) {
      (u = this.incidentsHandler) == null || u.error(`New value must have same type as initial value for prop "${r}"`);
      return;
    }
    if (!t.isValueScalar)
      try {
        JSON.stringify(e);
      } catch {
        (_ = this.incidentsHandler) == null || _.error("Complex data has to be json-friendly");
        return;
      }
    if (t.isValueScalar) {
      s(r, e);
      return;
    }
    if (!this.isObjectJsonFriendly(e)) {
      (f = this.incidentsHandler) == null || f.error("Complex data has to be json-friendly");
      return;
    }
    s(r, e);
  }
  addPropListener(r, e) {
    var s, t;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("store doesn't support anymore");
      return;
    }
    if (!this.hasProp(r)) {
      (t = this.incidentsHandler) == null || t.error(`Prop "${r}" wasn't registered. You have to add this prop first`);
      return;
    }
    this.isPropListened(r) || (this._propListenerHandlers[r] = []), this._propListenerHandlers[r].push(e);
  }
  removePropListener(r, e) {
    var s, t;
    if (!this._alive) {
      (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore");
      return;
    }
    if (!this.isPropListened(r)) {
      (t = this.incidentsHandler) == null || t.error(`Prop "${r}" doesn't have any listeners`);
      return;
    }
    this._propListenerHandlers[r] = this._propListenerHandlers[r].filter((n) => n !== e);
  }
  removeAllPropListeners(r) {
    var e, s;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    if (!this.isPropListened(r)) {
      (s = this.incidentsHandler) == null || s.warn(`Prop "${r}" doesn't have any listeners`);
      return;
    }
    delete this._propListenerHandlers[r];
  }
  prop(r) {
    var s, t;
    if (!this._alive)
      return (s = this.incidentsHandler) == null || s.error("This store doesn't support anymore"), null;
    if (!this.hasProp(r))
      return (t = this.incidentsHandler) == null || t.error(`Prop "${r}" wasn't registered. You have to add this prop first`), null;
    const e = this._props[r];
    return e.isValueScalar ? e.value : this.cloneComplexData(e.value);
  }
  hasProp(r) {
    var e;
    return this._alive ? h(this._props, r) : ((e = this.incidentsHandler) == null || e.error("This store doesn't support anymore"), !1);
  }
  addListener(r) {
    var e;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    this._listenerHandlers.push(r);
  }
  removeListener(r) {
    var e;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    this._listenerHandlers = this._listenerHandlers.filter((s) => s !== r);
  }
  removeAllListeners() {
    var r;
    if (!this._alive) {
      (r = this.incidentsHandler) == null || r.error("This store doesn't support anymore");
      return;
    }
    this._listenerHandlers = [];
  }
  importResolvers(r, e) {
    const s = r.exportAllResolvers(this._sessionKey);
    this._resolvers = e ? {
      ...this._resolvers,
      ...s
    } : {
      ...s,
      ...this._resolvers
    };
  }
  importProps(r, e) {
    var t;
    if (!this._alive) {
      (t = this.incidentsHandler) == null || t.error("This store doesn't support anymore");
      return;
    }
    const s = r.props;
    Object.entries(s).forEach(([n, a]) => {
      if (this.hasProp(n)) {
        if (!e)
          return;
        this.setProp(n, a);
      } else
        this.addProp(n, a);
    });
  }
  merge(r, e) {
    var t;
    if (!this._alive) {
      (t = this.incidentsHandler) == null || t.error("This store doesn't support anymore");
      return;
    }
    const s = Object.keys(r.props);
    this.silentImportProps(r, e), this.importAllPropsListenerHandlers(r, e), this.importAllListenersHandlers(r, e), this.importResolvers(r, e), this.importAllResolversListenerHandlers(r, e), r.kill(this._sessionKey), r.setMergeAgent(this._sessionKey, this), s.forEach((n) => {
      this.handleOnSetProp(this._props[n]);
    });
  }
  kill(r) {
    if (r !== this._sessionKey || !this._alive)
      return;
    const e = Object.keys(this._props);
    this.removeAllListeners(), e.forEach((s) => {
      this.removeAllPropListeners(s), this.removeProp(s);
    }), this._alive = !1;
  }
  exportAllPropsListenerHandlers(r) {
    var e;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    return r !== this._sessionKey ? null : { ...this._propListenerHandlers };
  }
  exportAllResolvers(r) {
    var e;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    return r !== this._sessionKey ? null : { ...this._resolvers };
  }
  exportAllResolversListenerHandlers(r) {
    var e;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    return r !== this._sessionKey ? null : { ...this._resolverListenerHandlers };
  }
  exportAllListenersHandlers(r) {
    var e;
    if (!this._alive) {
      (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore");
      return;
    }
    return r !== this._sessionKey ? null : [...this._listenerHandlers];
  }
  setMergeAgent(r, e) {
    this._mergeAgent = e;
  }
  silentImportProps(r, e) {
    var t;
    if (!this._alive) {
      (t = this.incidentsHandler) == null || t.error("This store doesn't support anymore");
      return;
    }
    const s = r.props;
    Object.entries(s).forEach(([n, a]) => {
      if (this.hasProp(n)) {
        if (!e)
          return;
        this.silentSetProp(n, a);
      } else
        this.silentAddProp(n, a);
    });
  }
  silentSetProp(r, e) {
    var p, c, u;
    if (!this.hasProp(r)) {
      (p = this.incidentsHandler) == null || p.error(`Prop "${r}" wasn't registered. You have to add this prop first`);
      return;
    }
    const s = (_, f) => {
      this._props[_].value = f;
    }, t = this._props[r], n = d(e);
    if (!H(e)) {
      s(r, null);
      return;
    }
    if (t.type !== n) {
      (c = this.incidentsHandler) == null || c.error(`New value must have same type as initial value for prop "${r}"`);
      return;
    }
    if (t.isValueScalar) {
      s(r, e);
      return;
    }
    if (!this.isObjectJsonFriendly(e)) {
      (u = this.incidentsHandler) == null || u.error("Complex data has to be json-friendly");
      return;
    }
    s(r, e);
  }
  silentAddProp(r, e) {
    var a, p, c, u;
    if (!this._alive) {
      (a = this.incidentsHandler) == null || a.error("This store doesn't support anymore");
      return;
    }
    if (this.hasProp(r)) {
      (p = this.incidentsHandler) == null || p.error("Prop can't be override, you have to remove prop first");
      return;
    }
    if (!H(e)) {
      (c = this.incidentsHandler) == null || c.error("Value can't be nullable");
      return;
    }
    const s = d(e), t = m(e);
    if (t) {
      this._props[r] = { name: r, value: e, type: s, isValueScalar: t };
      return;
    }
    if (!this.isObjectJsonFriendly(e)) {
      (u = this.incidentsHandler) == null || u.error("Complex data has to be json-friendly");
      return;
    }
    this._props[r] = { name: r, value: e, type: s, isValueScalar: t };
  }
  importAllResolversListenerHandlers(r, e) {
    const s = r.exportAllResolversListenerHandlers(this._sessionKey);
    this._propListenerHandlers = e ? {
      ...this._resolverListenerHandlers,
      ...s
    } : {
      ...s,
      ...this._resolverListenerHandlers
    };
  }
  importAllPropsListenerHandlers(r, e) {
    const s = r.exportAllPropsListenerHandlers(this._sessionKey);
    this._propListenerHandlers = e ? {
      ...this._propListenerHandlers,
      ...s
    } : {
      ...s,
      ...this._propListenerHandlers
    };
  }
  importAllListenersHandlers(r, e) {
    const s = r.exportAllListenersHandlers(this._sessionKey), t = [
      ...this._listenerHandlers,
      ...s
    ];
    this._listenerHandlers = e ? [...new Set(t)] : t;
  }
  isPropListened(r) {
    return h(this._propListenerHandlers, r);
  }
  handleOnCallResolver(r, e) {
    for (const s of this._listenerHandlers)
      s(r, e, this.props);
  }
  handleOnSetProp(r) {
    if (this.isPropListened(r.name))
      for (const e of this._propListenerHandlers[r.name])
        e(r.value);
    for (const e of this._listenerHandlers)
      e(r.name, r.value, this.props);
  }
  isObjectJsonFriendly(r) {
    try {
      return JSON.stringify(r), !0;
    } catch {
      return !1;
    }
  }
  cloneComplexData(r) {
    return JSON.parse(JSON.stringify(r));
  }
  get mergeAgent() {
    return this._mergeAgent;
  }
  get isAlive() {
    return this._alive;
  }
  get props() {
    var e;
    if (!this._alive)
      return (e = this.incidentsHandler) == null || e.error("This store doesn't support anymore"), {};
    const r = {};
    return Object.entries(this._props).forEach(([s, t]) => {
      r[s] = t.isValueScalar ? t.value : this.cloneComplexData(t.value);
    }), r;
  }
  get incidentsHandler() {
    return this._incidentsHandler;
  }
}
const R = () => Symbol(crypto.randomUUID()), S = R();
console.log("Tardigrade works!");
const g = (i, r) => {
  r = r || {};
  const e = new O(S, r);
  return i && Object.entries(i).forEach(([s, t]) => {
    switch (d(t)) {
      case o.Function:
      case o.AsyncFunction:
        e.addResolver(s, t);
        break;
      case o.Number:
      case o.String:
      case o.Boolean:
      case o.Array:
      case o.Object:
        e.addProp(s, t);
        break;
      case o.Null:
      case o.Undefined:
      default:
        console.warn(`Tardigrade: data item "${s}" has incorrect type`);
        break;
    }
  }), e;
};
export {
  g as createTardigrade
};
