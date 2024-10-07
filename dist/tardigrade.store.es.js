var u = Object.defineProperty;
var c = (o, r, e) => r in o ? u(o, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[r] = e;
var l = (o, r, e) => (c(o, typeof r != "symbol" ? r + "" : r, e), e);
const a = (o) => Object.prototype.toString.call(o).replace(/^\[object (.+)\]$/, "$1").toLowerCase(), h = (o) => {
  const r = a(o);
  return r !== "null" && r !== "undefined";
}, v = (o) => {
  const r = a(o);
  return r === "string" || r === "number" || r === "symbol";
}, i = (o, r) => Object.prototype.hasOwnProperty.call(o, r);
class _ {
  constructor(r) {
    l(this, "_resolvers", {});
    l(this, "_props", {});
    l(this, "_resolverListenerHandlers", {});
    l(this, "_propListenerHandlers", {});
    l(this, "_listenerHandlers", []);
    l(this, "_alive", !0);
    l(this, "_sessionKey", null);
    if (!r)
      throw Error("Tardigrade constructor error");
    this._sessionKey = r;
  }
  addResolver(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (a(e) !== "function") {
      console.error("Tardigrade: resolver have to be a function");
      return;
    }
    if (i(this._resolvers, r)) {
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
    if (a(e) !== "function") {
      console.error("Tardigrade: resolver have to be a function");
      return;
    }
    if (!i(this._resolvers, r)) {
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
    i(this._resolvers, r) && (delete this._resolvers[r], delete this._resolverListenerHandlers[r]);
  }
  callResolver(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (!i(this._resolvers, r)) {
      console.error("Tardigrade: this resolver hasn't been created yet or been deleted");
      return;
    }
    const e = this._resolvers[r](this.props);
    this.handleOnCallResolver(r, e), i(this._resolverListenerHandlers, r) && this._resolverListenerHandlers[r].forEach((s) => s(e));
  }
  addResolverListener(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    if (!i(this._resolvers, r)) {
      console.error(`Tardigrade: there is no resolver with name "${r}"`);
      return;
    }
    i(this._resolverListenerHandlers, r) || (this._resolverListenerHandlers[r] = []), this._resolverListenerHandlers[r].push(e);
  }
  removeResolverListener(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    i(this._resolverListenerHandlers, r) && (this._resolverListenerHandlers[r] = this._resolverListenerHandlers[r].filter((s) => s !== e));
  }
  removeAllResolverListeners(r) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    i(this._resolverListenerHandlers, r) && delete this._resolverListenerHandlers[r];
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
    const s = (p, d) => {
      this._props[p].value = d, this.handleOnSetProp(this._props[p]);
    }, t = this._props[r], n = a(e);
    if (!h(e)) {
      s(r, null);
      return;
    }
    if (t.type !== n) {
      console.error(`Tardigrade: new value must have same type as initial value for prop "${r}"`);
      return;
    }
    if (!t.isValueScalar)
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
    return this._alive ? i(this._props, r) : (console.error("Tardigrade: this store doesn't support yet"), !1);
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
  importProps(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    const s = r.props;
    Object.entries(s).forEach(([t, n]) => {
      if (this.hasProp(t)) {
        if (!e)
          return;
        this.setProp(t, n);
      } else
        this.addProp(t, n);
    });
  }
  merge(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    const s = Object.keys(r.props);
    this.silentImportProps(r, e), this.importAllPropsListenerHandlers(r, e), this.importAllListenersHandlers(r, e), this.importResolvers(r, e), this.importAllResolversListenerHandlers(r, e), r.kill(this._sessionKey), s.forEach((t) => {
      console.log(t, this._props[t]), this.handleOnSetProp(this._props[t]);
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
    Object.entries(s).forEach(([t, n]) => {
      if (this.hasProp(t)) {
        if (!e)
          return;
        this.silentSetProp(t, n);
      } else
        this.silentAddProp(t, n);
    });
  }
  silentSetProp(r, e) {
    if (!this.hasProp(r)) {
      console.error(`Tardigrade: prop "${r}" wasn't registered. You have to add this prop first`);
      return;
    }
    const s = (p, d) => {
      this._props[p].value = d;
    }, t = this._props[r], n = a(e);
    if (!h(e)) {
      s(r, null);
      return;
    }
    if (t.type !== n) {
      console.error(`Tardigrade: new value must have same type as initial value for prop "${r}"`);
      return;
    }
    if (!t.isValueScalar)
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
    if (!h(e)) {
      console.error("Tardigrade: value can't be nullable");
      return;
    }
    const s = a(e), t = v(e);
    if (t) {
      this._props[r] = { name: r, value: e, type: s, isValueScalar: t };
      return;
    }
    try {
      JSON.stringify(e);
    } catch {
      console.error("Tardigrade: complex data has to be json-friendly");
      return;
    }
    this._props[r] = { name: r, value: e, type: s, isValueScalar: t };
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
    return i(this._propListenerHandlers, r);
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
const f = () => Symbol(crypto.randomUUID()), y = f(), L = () => new _(y);
export {
  L as createTardigrade
};
