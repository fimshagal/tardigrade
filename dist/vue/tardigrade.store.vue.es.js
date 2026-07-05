/* Tardigrade store vue bridge v1.8.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
import { provide as g, getCurrentInstance as f, inject as S, getCurrentScope as T, onScopeDispose as R, shallowRef as i, computed as y } from "vue";
import { createTardigrade as A } from "tardigrade-store";
const v = Symbol("tardigrade-store"), P = (e) => {
  g(v, e);
}, a = (e) => {
  const r = f() ? S(v, null) : null, t = e ?? r;
  if (!t)
    throw new Error("Tardigrade vue bridge: store wasn't provided. Pass it into the composable directly or call provideTardigradeStore(store) in a parent component");
  return t;
}, j = (e, r) => A(e, r), p = (e) => typeof e == "object" && e !== null, l = (e, r) => {
  if (Object.is(e, r))
    return !0;
  if (!p(e) || !p(r))
    return !1;
  try {
    return JSON.stringify(e) === JSON.stringify(r);
  } catch {
    return !1;
  }
}, c = (e, r) => {
  e.addListener(r), T() && R(() => {
    e.isAlive && e.removeListener(r);
  });
}, w = (e, r) => {
  const t = a(r), o = () => t.isAlive && t.hasProp(e) ? t.prop(e) : null, s = i(o());
  return c(t, (n) => {
    if (!(Array.isArray(n) ? n.includes(e) : n === e))
      return;
    const d = o();
    l(s.value, d) || (s.value = d);
  }), y({
    get: () => s.value,
    set: (n) => {
      t.setProp(e, n);
    }
  });
}, C = (e) => {
  const r = a(e), t = () => r.isAlive ? r.props : {}, o = i(t());
  return c(r, () => {
    const s = t();
    l(o.value, s) || (o.value = s);
  }), o;
}, I = (e, r) => {
  const t = a(r), o = i(null);
  return c(t, (n, u) => {
    n === e && (o.value = u);
  }), [() => t.callResolver(e), o];
}, O = (e, r, t = l) => {
  const o = a(r), s = i(e(o.props));
  return c(o, () => {
    if (!o.isAlive)
      return;
    const n = e(o.props);
    t(s.value, n) || (s.value = n);
  }), s;
};
export {
  v as TARDIGRADE_INJECTION_KEY,
  P as provideTardigradeStore,
  j as useTardigrade,
  w as useTardigradeProp,
  C as useTardigradeProps,
  I as useTardigradeResolver,
  O as useTardigradeSelector,
  a as useTardigradeStore
};
