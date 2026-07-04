/* Tardigrade store react bridge v1.5.0 */

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
import * as T from "react";
import { createContext as A, createElement as P, useContext as b, useRef as a, useState as R, useEffect as x, useCallback as f } from "react";
import { createTardigrade as E } from "tardigrade-store";
const y = A(null), O = ({ store: e, children: t }) => P(y.Provider, { value: e }, t), v = (e) => {
  const t = b(y), r = e ?? t;
  if (!r)
    throw new Error("Tardigrade react bridge: store wasn't provided. Pass it into the hook directly or wrap your components with <TardigradeProvider store={...}>");
  return r;
}, j = (e, t) => {
  const r = a(null);
  return r.current || (r.current = E(e, t)), r.current;
}, h = (e) => typeof e == "object" && e !== null, g = (e, t) => {
  if (Object.is(e, t))
    return !0;
  if (!h(e) || !h(t))
    return !1;
  try {
    return JSON.stringify(e) === JSON.stringify(t);
  } catch {
    return !1;
  }
}, L = (e, t) => {
  const r = t(), [, n] = R(0), o = a({ value: r, getSnapshot: t });
  return o.current.value = r, o.current.getSnapshot = t, x(() => {
    const c = () => {
      const s = o.current, l = s.getSnapshot();
      Object.is(s.value, l) || n((i) => i + 1);
    };
    return c(), e(c);
  }, [e]), r;
}, C = T.useSyncExternalStore, S = C ?? L, U = (e, t) => {
  const r = v(t), n = a(null), o = a(!1), c = f((u) => {
    const d = (p) => {
      (Array.isArray(p) ? p.includes(e) : p === e) && u();
    };
    return r.addListener(d), () => {
      r.isAlive && r.removeListener(d);
    };
  }, [r, e]), s = () => {
    if (!r.isAlive)
      return n.current;
    const u = r.hasProp(e) ? r.prop(e) : null;
    return o.current && g(n.current, u) || (n.current = u, o.current = !0), n.current;
  }, l = S(c, s, s), i = f((u) => {
    r.setProp(e, u);
  }, [r, e]);
  return [l, i];
}, F = (e) => {
  const t = v(e), r = a(null), n = f((c) => {
    const s = () => c();
    return t.addListener(s), () => {
      t.isAlive && t.removeListener(s);
    };
  }, [t]), o = () => {
    if (!t.isAlive)
      return r.current ?? {};
    const c = t.props;
    return r.current && g(r.current, c) ? r.current : (r.current = c, c);
  };
  return S(n, o, o);
}, J = (e, t) => {
  const r = v(t), [n, o] = R(null);
  return x(() => {
    const s = (l, i) => {
      l === e && o(i);
    };
    return r.addListener(s), () => {
      r.isAlive && r.removeListener(s);
    };
  }, [r, e]), [f(() => r.callResolver(e), [r, e]), n];
}, V = (e, t, r = g) => {
  const n = v(t), o = a(e);
  o.current = e;
  const c = a(r);
  c.current = r;
  const s = a(null), l = f((u) => {
    const d = () => u();
    return n.addListener(d), () => {
      n.isAlive && n.removeListener(d);
    };
  }, [n]), i = () => {
    if (!n.isAlive && s.current)
      return s.current.value;
    const u = o.current(n.props);
    return s.current && c.current(s.current.value, u) ? s.current.value : (s.current = { value: u }, u);
  };
  return S(l, i, i);
};
export {
  y as TardigradeContext,
  O as TardigradeProvider,
  j as useTardigrade,
  U as useTardigradeProp,
  F as useTardigradeProps,
  J as useTardigradeResolver,
  V as useTardigradeSelector,
  v as useTardigradeStore
};
