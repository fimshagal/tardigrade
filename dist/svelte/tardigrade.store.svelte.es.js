/* Tardigrade store svelte bridge v1.9.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
const d = (r) => typeof r == "object" && r !== null, o = (r, e) => {
  if (Object.is(r, e))
    return !0;
  if (!d(r) || !d(e))
    return !1;
  try {
    return JSON.stringify(r) === JSON.stringify(e);
  } catch {
    return !1;
  }
}, f = (r, e) => {
  const t = () => r.isAlive && r.hasProp(e) ? r.prop(e) : null;
  return {
    subscribe: (i) => {
      let s = t();
      i(s);
      const n = (l) => {
        if (!(Array.isArray(l) ? l.includes(e) : l === e))
          return;
        const u = t();
        o(s, u) || (s = u, i(u));
      };
      return r.addListener(n), () => {
        r.isAlive && r.removeListener(n);
      };
    },
    // writes go through the store, so ward rules and type checks apply
    set: (i) => {
      r.setProp(e, i);
    },
    update: (i) => {
      r.setProp(e, i(t()));
    }
  };
}, b = (r) => {
  const e = () => r.isAlive ? r.props : {};
  return { subscribe: (c) => {
    let i = e();
    c(i);
    const s = () => {
      const n = e();
      o(i, n) || (i = n, c(n));
    };
    return r.addListener(s), () => {
      r.isAlive && r.removeListener(s);
    };
  } };
}, p = (r, e, t = o) => ({ subscribe: (i) => {
  let s = e(r.props);
  i(s);
  const n = () => {
    if (!r.isAlive)
      return;
    const l = e(r.props);
    t(s, l) || (s = l, i(l));
  };
  return r.addListener(n), () => {
    r.isAlive && r.removeListener(n);
  };
} }), v = (r, e) => ({
  subscribe: (c) => {
    c(null);
    const i = (s, n) => {
      s === e && c(n);
    };
    return r.addListener(i), () => {
      r.isAlive && r.removeListener(i);
    };
  },
  call: () => r.callResolver(e)
});
export {
  f as tardigradeProp,
  b as tardigradeProps,
  v as tardigradeResolver,
  p as tardigradeSelector
};
