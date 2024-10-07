var c = Object.defineProperty;
var u = (o, r, e) => r in o ? c(o, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : o[r] = e;
var p = (o, r, e) => (u(o, typeof r != "symbol" ? r + "" : r, e), e);
const l = (o) => Object.prototype.toString.call(o).replace(/^\[object (.+)\]$/, "$1").toLowerCase(), d = (o) => {
  const r = l(o);
  return r !== "null" && r !== "undefined";
}, f = (o) => {
  const r = l(o);
  return r === "string" || r === "number" || r === "symbol";
}, h = (o, r) => Object.prototype.hasOwnProperty.call(o, r);
class _ {
  constructor(r) {
    p(this, "_props", {});
    p(this, "_propListenerHandlers", {});
    p(this, "_listenerHandlers", []);
    p(this, "_alive", !0);
    p(this, "_sessionKey", null);
    if (!r)
      throw Error("Tardigrade constructor error");
    this._sessionKey = r;
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
    const s = (n, a) => {
      this._props[n].value = a, this.handleOnSetProp(this._props[n]);
    }, t = this._props[r], i = l(e);
    if (!d(e)) {
      s(r, null);
      return;
    }
    if (t.type !== i) {
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
    return this._alive ? h(this._props, r) : (console.error("Tardigrade: this store doesn't support yet"), !1);
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
    Object.entries(s).forEach(([t, i]) => {
      if (this.hasProp(t)) {
        if (!e)
          return;
        this.setProp(t, i);
      } else
        this.addProp(t, i);
    });
  }
  merge(r, e) {
    if (!this._alive) {
      console.error("Tardigrade: this store doesn't support yet");
      return;
    }
    const s = Object.keys(r.props);
    this.silentImportProps(r, e), this.importAllPropsListenerHandlers(r, e), this.importAllListenersHandlers(r, e), r.kill(this._sessionKey), s.forEach((t) => {
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
    Object.entries(s).forEach(([t, i]) => {
      if (this.hasProp(t)) {
        if (!e)
          return;
        this.silentSetProp(t, i.value);
      } else
        this.silentAddProp(t, i.value);
    });
  }
  silentSetProp(r, e) {
    if (!this.hasProp(r)) {
      console.error(`Tardigrade: prop "${r}" wasn't registered. You have to add this prop first`);
      return;
    }
    const s = (n, a) => {
      this._props[n].value = a;
    }, t = this._props[r], i = l(e);
    if (!d(e)) {
      s(r, null);
      return;
    }
    if (t.type !== i) {
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
    if (!d(e)) {
      console.error("Tardigrade: value can't be nullable");
      return;
    }
    const s = l(e), t = f(e);
    if (!t)
      try {
        JSON.stringify(e);
      } catch {
        console.error("Tardigrade: complex data has to be json-friendly");
        return;
      }
    this._props[r] = { name: r, value: e, type: s, isValueScalar: t };
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
      r[e] = s.isValueScalar ? s : this.cloneComplexData(s.value);
    }), r;
  }
}
const y = () => Symbol(crypto.randomUUID()), v = y(), P = () => new _(v);
export {
  P as createTardigrade
};
