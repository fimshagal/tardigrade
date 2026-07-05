/* Tardigrade persist v1.7.1 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
const M = () => {
  const e = /* @__PURE__ */ new Map();
  return {
    read: (r) => e.has(r) ? e.get(r) : null,
    write: (r, n) => {
      e.set(r, n);
    },
    remove: (r) => {
      e.delete(r);
    }
  };
}, O = () => ({
  read: (e) => localStorage.getItem(e),
  write: (e, r) => localStorage.setItem(e, r),
  remove: (e) => localStorage.removeItem(e)
}), j = () => typeof localStorage < "u" ? O() : M(), z = (e, r, n) => {
  const o = r(e);
  if (!n.size)
    return o;
  const s = {};
  for (const i of n)
    i in o && (s[i] = o[i]);
  return s;
}, L = (e, r) => JSON.stringify({ version: r, data: e }), D = (e) => {
  const r = JSON.parse(e);
  if (!r || typeof r != "object" || typeof r.version != "number" || !r.data || typeof r.data != "object")
    throw new Error("Tardigrade persist: malformed envelope in storage");
  return r;
}, J = (e, r) => {
  Object.entries(r).forEach(([n, o]) => {
    if (e.hasProp(n)) {
      e.setProp(n, o);
      return;
    }
    o != null && e.addProp(n, o);
  });
}, N = (e, r) => {
  const {
    key: n,
    storage: o = j(),
    saveAfter: s = 300,
    restoreOnStart: i = !0,
    version: S = 1,
    migrate: y,
    onRestore: v,
    onSave: m,
    onError: a = (t) => console.warn("Tardigrade persist:", t)
  } = r;
  let w = r.pick ?? ((t) => t);
  const h = /* @__PURE__ */ new Set();
  let l = !1, c = !1, d = !1, f = null;
  const p = () => {
    f !== null && (clearTimeout(f), f = null);
  }, k = () => e.isAlive ? z(e.props, w, h) : {}, u = () => {
    if (p(), !e.isAlive) {
      a(new Error(`Tardigrade persist: can't save, store "${String(e.name)}" isn't alive`));
      return;
    }
    try {
      const t = k();
      o.write(n, L(t, S)), m == null || m(t);
    } catch (t) {
      a(t);
    }
  }, E = () => {
    if (!e.isAlive) {
      a(new Error(`Tardigrade persist: can't restore, store "${String(e.name)}" isn't alive`));
      return;
    }
    try {
      const t = o.read(n);
      if (t === null)
        return;
      const A = D(t);
      let g = A.data;
      const b = A.version ?? 1;
      b < S && y && (g = y(g, b)), d = !0;
      try {
        J(e, g);
      } finally {
        d = !1;
      }
      v == null || v(g);
    } catch (t) {
      d = !1, a(t);
    }
  }, P = () => {
    if (!(l || c || d)) {
      if (s === 0) {
        u();
        return;
      }
      p(), f = setTimeout(u, s);
    }
  }, T = (t) => {
    typeof t == "string" && !e.hasProp(t) || P();
  }, I = {
    store: e,
    save: u,
    restore: E,
    forget: () => {
      try {
        o.remove(n);
      } catch (t) {
        a(t);
      }
    },
    hold: () => {
      l = !0, p();
    },
    unhold: () => {
      l = !1, u();
    },
    retain: (t) => {
      h.add(t);
    },
    drop: (t) => {
      h.delete(t);
    },
    pick: (t) => {
      w = t;
    },
    peek: k,
    dispose: () => {
      c || (c = !0, p(), e.isAlive && e.removeListener(T));
    },
    get isHeld() {
      return l;
    },
    get isDisposed() {
      return c;
    }
  };
  return i && E(), e.addListener(T), I;
};
export {
  j as createDefaultStorage,
  M as createInMemoryStorage,
  O as createLocalStorageAdapter,
  N as persist
};
