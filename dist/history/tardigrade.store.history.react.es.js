/* Tardigrade history v1.8.1 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
import { useRef as c, useState as p, useEffect as R } from "react";
import { history as k } from "tardigrade-store/history";
const m = (o, l) => {
  const u = c(o);
  u.current = o;
  const a = c(l);
  a.current = l;
  const n = c(null), r = () => {
    var t;
    return (!n.current || n.current.isDisposed || n.current.store !== u.current) && ((t = n.current) == null || t.dispose(), n.current = k(u.current, a.current)), n.current;
  };
  r();
  const [, f] = p([!1, !1]), d = c([!1, !1]), s = () => {
    const e = r(), t = [e.canUndo, e.canRedo];
    d.current[0] === t[0] && d.current[1] === t[1] || (d.current = t, f(t));
  }, i = c(null);
  return i.current || (i.current = {
    get store() {
      return r().store;
    },
    undo: () => {
      const e = r().undo();
      return s(), e;
    },
    redo: () => {
      const e = r().redo();
      return s(), e;
    },
    record: () => {
      r().record(), s();
    },
    hold: () => r().hold(),
    unhold: () => {
      r().unhold(), s();
    },
    clear: () => {
      r().clear(), s();
    },
    peek: () => r().peek(),
    peekUndo: () => r().peekUndo(),
    peekRedo: () => r().peekRedo(),
    dispose: () => {
      var e;
      return (e = n.current) == null ? void 0 : e.dispose();
    },
    get canUndo() {
      var e;
      return ((e = n.current) == null ? void 0 : e.canUndo) ?? !1;
    },
    get canRedo() {
      var e;
      return ((e = n.current) == null ? void 0 : e.canRedo) ?? !1;
    },
    get isHeld() {
      var e;
      return ((e = n.current) == null ? void 0 : e.isHeld) ?? !1;
    },
    get isDisposed() {
      var e;
      return ((e = n.current) == null ? void 0 : e.isDisposed) ?? !0;
    }
  }), R(() => {
    const e = r(), t = () => s();
    return s(), o.addListener(t), () => {
      o.isAlive && o.removeListener(t), e.dispose();
    };
  }, [o]), i.current;
};
export {
  m as useHistory
};
