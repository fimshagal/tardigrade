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
import { createContext as T, createElement as h, useContext as R, useRef as p, useState as f, useEffect as g, useCallback as P } from "react";
import { createTardigrade as C } from "tardigrade-store";
const y = T(null), A = ({ store: r, children: t }) => h(y.Provider, { value: r }, t), v = (r) => {
  const t = R(y), e = r ?? t;
  if (!e)
    throw new Error("Tardigrade react bridge: store wasn't provided. Pass it into the hook directly or wrap your components with <TardigradeProvider store={...}>");
  return e;
}, O = (r, t) => {
  const e = p(null);
  return e.current || (e.current = C(r, t)), e.current;
}, d = (r) => typeof r == "object" && r !== null, x = (r) => d(r) ? typeof structuredClone == "function" ? structuredClone(r) : JSON.parse(JSON.stringify(r)) : r, S = (r, t) => {
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
  const e = v(t), [c, i] = f(() => e.hasProp(r) ? e.prop(r) : null), s = p(c);
  g(() => {
    const n = (u) => {
      if (S(s.current, u))
        return;
      const l = x(u);
      s.current = l, i(l);
    };
    n(e.hasProp(r) ? e.prop(r) : null);
    const a = (u, l) => {
      if (Array.isArray(u)) {
        if (!u.includes(r))
          return;
        n(l[r]);
        return;
      }
      u === r && n(l);
    };
    return e.addListener(a), () => {
      e.isAlive && e.removeListener(a);
    };
  }, [e, r]);
  const o = P((n) => {
    e.setProp(r, n);
  }, [e, r]);
  return [c, o];
}, J = (r) => {
  const t = v(r), [e, c] = f(() => t.props), i = p(e);
  return g(() => {
    const s = () => {
      const o = t.props;
      S(i.current, o) || (i.current = o, c(o));
    };
    return s(), t.addListener(s), () => {
      t.isAlive && t.removeListener(s);
    };
  }, [t]), e;
}, V = (r, t) => {
  const e = v(t), [c, i] = f(null);
  return g(() => {
    const o = (n, a) => {
      n === r && i(a);
    };
    return e.addListener(o), () => {
      e.isAlive && e.removeListener(o);
    };
  }, [e, r]), [P(() => e.callResolver(r), [e, r]), c];
};
export {
  y as TardigradeContext,
  A as TardigradeProvider,
  O as useTardigrade,
  E as useTardigradeProp,
  J as useTardigradeProps,
  V as useTardigradeResolver,
  v as useTardigradeStore
};
