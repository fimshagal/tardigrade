/* Tardigrade store v1.1.8 */

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
var u = Object.defineProperty;
var f = (t, r, e) => r in t ? u(t, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[r] = e;
var p = (t, r, e) => (f(t, typeof r != "symbol" ? r + "" : r, e), e);
var i = /* @__PURE__ */ ((t) => (t.Null = "null", t.Undefined = "undefined", t.Function = "function", t.AsyncFunction = "asyncfunction", t.Number = "number", t.String = "string", t.Boolean = "boolean", t.Array = "array", t.Object = "object", t))(i || {});
const a = (t) => Object.prototype.toString.call(t).replace(/^\[object (.+)\]$/, "$1").toLowerCase(), c = (t) => {
  const r = a(t);
  return r !== "null" && r !== "undefined";
}, v = (t) => {
  const r = a(t);
  return r === "string" || r === "number" || r === "symbol";
}, l = (t, r) => Object.prototype.hasOwnProperty.call(t, r);
class _ {
  constructor(r, e) {
    p(this, "_resolvers", {});
    p(this, "_props", {});
    p(this, "_resolverListenerHandlers", {});
    p(this, "_propListenerHandlers", {});
    p(this, "_listenerHandlers", []);
    p(this, "_alive", !0);
    p(this, "_sessionKey", null);
    if (!r)
      throw Error("Tardigrade constructor error");
    this._sessionKey = r;
  }
  addResolver(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (a(e) !== i.Function && a(e) !== i.AsyncFunction) {
      console.error("Tardigrade: resolver have to be a function");
      return;
    }
    if (l(this._resolvers, r)) {
      console.error("Tardigrade: resolver has been planted");
      return;
    }
    this._resolvers[r] = e;
  }
  setResolver(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (a(e) !== i.Function && a(e) !== i.AsyncFunction) {
      console.error("Tardigrade: resolver have to be a function");
      return;
    }
    if (!l(this._resolvers, r)) {
      console.error("Tardigrade: resolver has been planted");
      return;
    }
    this._resolvers[r] = e;
  }
  removeResolver(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    l(this._resolvers, r) && (delete this._resolvers[r], delete this._resolverListenerHandlers[r]);
  }
  async callResolver(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (!l(this._resolvers, r)) {
      console.error("Tardigrade: this resolver hasn't been created yet or been deleted");
      return;
    }
    const e = await this._resolvers[r](this.props);
    this.handleOnCallResolver(r, e), l(this._resolverListenerHandlers, r) && this._resolverListenerHandlers[r].forEach((s) => s(e));
  }
  addResolverListener(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (!l(this._resolvers, r)) {
      console.error(`Tardigrade: there is no resolver with name "${r}"`);
      return;
    }
    l(this._resolverListenerHandlers, r) || (this._resolverListenerHandlers[r] = []), this._resolverListenerHandlers[r].push(e);
  }
  removeResolverListener(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    l(this._resolverListenerHandlers, r) && (this._resolverListenerHandlers[r] = this._resolverListenerHandlers[r].filter((s) => s !== e));
  }
  removeAllResolverListeners(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    l(this._resolverListenerHandlers, r) && delete this._resolverListenerHandlers[r];
  }
  addProp(r, e) {
    this.silentAddProp(r, e), this.handleOnSetProp(this._props[r]);
  }
  removeProp(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (!this.hasProp(r)) {
      console.error("Tardigrade: prop can't be deleted, you have to remove prop first");
      return;
    }
    this.removeAllPropListeners(r), delete this._props[r];
  }
  setProp(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (!this.hasProp(r)) {
      console.error(`Tardigrade: prop "${r}" wasn't registered. You have to add this prop first`);
      return;
    }
    const s = (d, h) => {
      this._props[d].value = h, this.handleOnSetProp(this._props[d]);
    }, o = this._props[r], n = a(e);
    if (!c(e)) {
      s(r, null);
      return;
    }
    if (o.type !== n) {
      console.error(`Tardigrade: new value must have same type as initial value for prop "${r}"`);
      return;
    }
    if (!o.isValueScalar)
      try {
        JSON.stringify(e);
      } catch {
        console.error("Tardigrade: complex data has to be json-friendly");
        return;
      }
    s(r, e);
  }
  addPropListener(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (!this.hasProp(r)) {
      console.error(`Tardigrade: prop "${r}" wasn't registered. You have to add this prop first`);
      return;
    }
    this.isPropListened(r) || (this._propListenerHandlers[r] = []), this._propListenerHandlers[r].push(e);
  }
  removePropListener(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (!this.isPropListened(r)) {
      console.error(`Tardigrade: prop "${r}" doesn't have any listeners`);
      return;
    }
    this._propListenerHandlers[r] = this._propListenerHandlers[r].filter((s) => s !== e);
  }
  removeAllPropListeners(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (!this.isPropListened(r)) {
      console.warn(`Tardigrade: prop "${r}" doesn't have any listeners`);
      return;
    }
    delete this._propListenerHandlers[r];
  }
  prop(r) {
    if (!this._alive)
      return console.error("Tardigrade: this store doesn't support yet"), null;
    if (!this.hasProp(r))
      return console.error(`Tardigrade: prop "${r}" wasn't registered. You have to add this prop first`), null;
    const e = this._props[r];
    return e.isValueScalar ? e.value : this.cloneComplexData(e.value);
  }
  hasProp(r) {
    return this._alive ? l(this._props, r) : (console.error("Tardigrade: this store doesn't support yet"), !1);
  }
  addListener(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    this._listenerHandlers.push(r);
  }
  removeListener(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    this._listenerHandlers = this._listenerHandlers.filter((e) => e !== r);
  }
  removeAllListeners() {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
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
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    const s = r.props;
    Object.entries(s).forEach(([o, n]) => {
      if (this.hasProp(o)) {
        if (!e)
          return;
        this.setProp(o, n);
      } else
        this.addProp(o, n);
    });
  }
  merge(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    const s = Object.keys(r.props);
    this.silentImportProps(r, e), this.importAllPropsListenerHandlers(r, e), this.importAllListenersHandlers(r, e), this.importResolvers(r, e), this.importAllResolversListenerHandlers(r, e), r.kill(this._sessionKey), s.forEach((o) => {
      this.handleOnSetProp(this._props[o]);
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
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    return r !== this._sessionKey ? null : { ...this._propListenerHandlers };
  }
  exportAllResolvers(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    return r !== this._sessionKey ? null : { ...this._resolvers };
  }
  exportAllResolversListenerHandlers(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    return r !== this._sessionKey ? null : { ...this._resolverListenerHandlers };
  }
  exportAllListenersHandlers(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    return r !== this._sessionKey ? null : [...this._listenerHandlers];
  }
  silentImportProps(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    const s = r.props;
    Object.entries(s).forEach(([o, n]) => {
      if (this.hasProp(o)) {
        if (!e)
          return;
        this.silentSetProp(o, n);
      } else
        this.silentAddProp(o, n);
    });
  }
  silentSetProp(r, e) {
    if (!this.hasProp(r)) {
      console.error(`Tardigrade: prop "${r}" wasn't registered. You have to add this prop first`);
      return;
    }
    const s = (d, h) => {
      this._props[d].value = h;
    }, o = this._props[r], n = a(e);
    if (!c(e)) {
      s(r, null);
      return;
    }
    if (o.type !== n) {
      console.error(`Tardigrade: new value must have same type as initial value for prop "${r}"`);
      return;
    }
    if (!o.isValueScalar)
      try {
        JSON.stringify(e);
      } catch {
        console.error("Tardigrade: complex data has to be json-friendly");
        return;
      }
    s(r, e);
  }
  silentAddProp(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (this.hasProp(r)) {
      console.error("Tardigrade: prop can't be override, you have to remove prop first");
      return;
    }
    if (!c(e)) {
      console.error("Tardigrade: value can't be nullable");
      return;
    }
    const s = a(e), o = v(e);
    if (o) {
      this._props[r] = { name: r, value: e, type: s, isValueScalar: o };
      return;
    }
    try {
      JSON.stringify(e);
    } catch {
      console.error("Tardigrade: complex data has to be json-friendly");
      return;
    }
    this._props[r] = { name: r, value: e, type: s, isValueScalar: o };
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
    const s = r.exportAllListenersHandlers(this._sessionKey), o = [
      ...this._listenerHandlers,
      ...s
    ];
    this._listenerHandlers = e ? [...new Set(o)] : o;
  }
  isPropListened(r) {
    return l(this._propListenerHandlers, r);
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
  cloneComplexData(r) {
    return JSON.parse(JSON.stringify(r));
  }
  get props() {
    if (!this._alive)
      return console.error("Tardigrade: this store doesn't support yet"), {};
    const r = {};
    return Object.entries(this._props).forEach(([e, s]) => {
      r[e] = s.isValueScalar ? s.value : this.cloneComplexData(s.value);
    }), r;
  }
}
const y = () => Symbol(crypto.randomUUID()), L = y();
console.log("Tardigrade works!");
const H = (t, r) => {
  r = r || {};
  const e = new _(L, r);
  return t && Object.entries(t).forEach(([s, o]) => {
    switch (a(o)) {
      case i.Function:
      case i.AsyncFunction:
        e.addResolver(s, o);
        break;
      case i.Number:
      case i.String:
      case i.Boolean:
      case i.Array:
      case i.Object:
        e.addProp(s, o);
        break;
      case i.Null:
      case i.Undefined:
      default:
        console.warn(`Tardigrade: data item "${s}" has incorrect type`);
        break;
    }
  }), e;
};
export {
  H as createTardigrade
};
