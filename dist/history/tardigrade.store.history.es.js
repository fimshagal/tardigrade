/* Tardigrade history v1.8.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
const z = (e, r) => r(e.props), O = (e) => typeof structuredClone == "function" ? structuredClone(e) : JSON.parse(JSON.stringify(e)), J = (e, r) => JSON.stringify(e) === JSON.stringify(r), A = (e = 1 / 0) => {
  const r = [];
  return {
    push: (p) => {
      for (r.push(p); r.length > e; )
        r.shift();
    },
    pop: () => r.pop() ?? null,
    peek: () => r.length ? r[r.length - 1] : null,
    clear: () => {
      r.length = 0;
    },
    get size() {
      return r.length;
    }
  };
}, L = (e, r, p) => {
  Object.keys(p).forEach((n) => {
    !(n in r) && e.hasProp(n) && e.removeProp(n);
  }), Object.entries(r).forEach(([n, u]) => {
    if (e.hasProp(n)) {
      e.setProp(n, u);
      return;
    }
    u != null && e.addProp(n, u);
  });
}, N = (e, r) => {
  const {
    limit: p = 50,
    recordOnStart: n = !0,
    pick: u = (t) => t,
    onUndo: g,
    onRedo: k
  } = r ?? {}, s = A(p), i = A();
  let o = {}, y = !1, a = !1, c = !1, S = !1;
  const f = () => e.isAlive ? z(e, u) : {}, h = () => {
    if (c || !e.isAlive)
      return;
    const t = f();
    if (!y) {
      o = t, y = !0;
      return;
    }
    J(t, o) || (s.push(o), o = t, i.clear());
  }, v = (t, l) => {
    S = !0;
    try {
      L(e, t, l);
    } finally {
      S = !1;
    }
    o = t;
  }, d = (t) => {
    a || S || c || typeof t == "string" && !e.hasProp(t) || h();
  }, P = {
    store: e,
    undo: () => {
      if (!e.isAlive || !s.size)
        return !1;
      const t = f(), l = s.pop();
      return i.push(t), v(l, t), g == null || g(l), !0;
    },
    redo: () => {
      if (!e.isAlive || !i.size)
        return !1;
      const t = f(), l = i.pop();
      return s.push(t), v(l, t), k == null || k(l), !0;
    },
    record: h,
    hold: () => {
      a = !0;
    },
    unhold: () => {
      a = !1, h();
    },
    clear: () => {
      s.clear(), i.clear(), o = f(), y = !0, !c && e.isAlive && (e.removeListener(d), e.addListener(d));
    },
    peek: f,
    peekUndo: () => {
      const t = s.peek();
      return t ? O(t) : null;
    },
    peekRedo: () => {
      const t = i.peek();
      return t ? O(t) : null;
    },
    dispose: () => {
      c || (c = !0, e.isAlive && e.removeListener(d), s.clear(), i.clear());
    },
    get canUndo() {
      return s.size > 0;
    },
    get canRedo() {
      return i.size > 0;
    },
    get isHeld() {
      return a;
    },
    get isDisposed() {
      return c;
    }
  };
  return n && h(), e.addListener(d), P;
};
export {
  N as history
};
