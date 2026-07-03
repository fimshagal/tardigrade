/* Tardigrade store react bridge v1.2.0 */

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
import { createContext as h, createElement as y, useContext as R, useRef as p, useState as f, useEffect as g, useCallback as P } from "react";
import { createTardigrade as x } from "tardigrade-store";
const S = h(null), O = ({ store: r, children: t }) => y(S.Provider, { value: r }, t), v = (r) => {
  const t = R(S), e = r ?? t;
  if (!e)
    throw new Error("Tardigrade react bridge: store wasn't provided. Pass it into the hook directly or wrap your components with <TardigradeProvider store={...}>");
  return e;
}, V = (r, t) => {
  const e = p(null);
  return e.current || (e.current = x(r, t)), e.current;
}, d = (r) => typeof r == "object" && r !== null, L = (r) => d(r) ? JSON.parse(JSON.stringify(r)) : r, T = (r, t) => {
  if (Object.is(r, t))
    return !0;
  if (!d(r) || !d(t))
    return !1;
  try {
    return JSON.stringify(r) === JSON.stringify(t);
  } catch {
    return !1;
  }
}, E = (r, t) => {
  const e = v(t), [n, c] = f(() => e.hasProp(r) ? e.prop(r) : null), s = p(n);
  g(() => {
    const i = (a) => {
      if (T(s.current, a))
        return;
      const l = L(a);
      s.current = l, c(l);
    };
    i(e.hasProp(r) ? e.prop(r) : null);
    const u = (a, l) => {
      a === r && i(l);
    };
    return e.addListener(u), () => {
      e.isAlive && e.removeListener(u);
    };
  }, [e, r]);
  const o = P((i) => {
    e.setProp(r, i);
  }, [e, r]);
  return [n, o];
}, J = (r) => {
  const t = v(r), [e, n] = f(() => t.props), c = p(e);
  return g(() => {
    const s = () => {
      const o = t.props;
      T(c.current, o) || (c.current = o, n(o));
    };
    return s(), t.addListener(s), () => {
      t.isAlive && t.removeListener(s);
    };
  }, [t]), e;
}, N = (r, t) => {
  const e = v(t), [n, c] = f(null);
  return g(() => {
    const o = (i, u) => {
      i === r && c(u);
    };
    return e.addListener(o), () => {
      e.isAlive && e.removeListener(o);
    };
  }, [e, r]), [P(() => e.callResolver(r), [e, r]), n];
};
export {
  S as TardigradeContext,
  O as TardigradeProvider,
  V as useTardigrade,
  E as useTardigradeProp,
  J as useTardigradeProps,
  N as useTardigradeResolver,
  v as useTardigradeStore
};
