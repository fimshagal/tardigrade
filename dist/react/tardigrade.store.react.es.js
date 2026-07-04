/* Tardigrade store react bridge v1.3.0 */

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
import { createContext as R, createElement as T, useContext as h, useRef as d, useState as p, useEffect as f, useCallback as y } from "react";
import { createTardigrade as L } from "tardigrade-store";
const P = R(null), w = ({ store: r, children: t }) => T(P.Provider, { value: r }, t), g = (r) => {
  const t = h(P), e = r ?? t;
  if (!e)
    throw new Error("Tardigrade react bridge: store wasn't provided. Pass it into the hook directly or wrap your components with <TardigradeProvider store={...}>");
  return e;
}, O = (r, t) => {
  const e = d(null);
  return e.current || (e.current = L(r, t)), e.current;
}, v = (r) => typeof r == "object" && r !== null, x = (r) => v(r) ? typeof structuredClone == "function" ? structuredClone(r) : JSON.parse(JSON.stringify(r)) : r, S = (r, t) => {
  if (Object.is(r, t))
    return !0;
  if (!v(r) || !v(t))
    return !1;
  try {
    return JSON.stringify(r) === JSON.stringify(t);
  } catch {
    return !1;
  }
}, E = (r, t) => {
  const e = g(t), [o, u] = p(() => e.hasProp(r) ? e.prop(r) : null), n = d(o);
  f(() => {
    const i = (c) => {
      if (S(n.current, c))
        return;
      const l = x(c);
      n.current = l, u(l);
    };
    i(e.hasProp(r) ? e.prop(r) : null);
    const a = (c, l) => {
      if (Array.isArray(c)) {
        if (!c.includes(r))
          return;
        i(l[r]);
        return;
      }
      c === r && i(l);
    };
    return e.addListener(a), () => {
      e.isAlive && e.removeListener(a);
    };
  }, [e, r]);
  const s = y((i) => {
    e.setProp(r, i);
  }, [e, r]);
  return [o, s];
}, J = (r) => {
  const t = g(r), [e, o] = p(() => t.props), u = d(e);
  return f(() => {
    const n = () => {
      const s = t.props;
      S(u.current, s) || (u.current = s, o(s));
    };
    return n(), t.addListener(n), () => {
      t.isAlive && t.removeListener(n);
    };
  }, [t]), e;
}, V = (r, t) => {
  const e = g(t), [o, u] = p(null);
  return f(() => {
    const s = (i, a) => {
      i === r && u(a);
    };
    return e.addListener(s), () => {
      e.isAlive && e.removeListener(s);
    };
  }, [e, r]), [y(() => e.callResolver(r), [e, r]), o];
}, b = (r, t, e = S) => {
  const o = g(t), u = d(r);
  u.current = r;
  const n = d(e);
  n.current = e;
  const [s, i] = p(() => r(o.props)), a = d(s);
  return f(() => {
    const c = () => {
      const l = u.current(o.props);
      n.current(a.current, l) || (a.current = l, i(l));
    };
    return c(), o.addListener(c), () => {
      o.isAlive && o.removeListener(c);
    };
  }, [o]), s;
};
export {
  P as TardigradeContext,
  w as TardigradeProvider,
  O as useTardigrade,
  E as useTardigradeProp,
  J as useTardigradeProps,
  V as useTardigradeResolver,
  b as useTardigradeSelector,
  g as useTardigradeStore
};
