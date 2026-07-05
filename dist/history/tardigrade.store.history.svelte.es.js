/* Tardigrade history v1.9.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
import { history as i } from "tardigrade-store/history";
const a = (n) => {
  let d = n;
  const e = /* @__PURE__ */ new Set();
  return {
    set: (o) => {
      o !== d && (d = o, e.forEach((s) => s(d)));
    },
    readable: {
      subscribe: (o) => (o(d), e.add(o), () => e.delete(o))
    }
  };
}, u = (n, d) => {
  const e = i(n, d), o = a(e.canUndo), s = a(e.canRedo), r = () => {
    o.set(e.canUndo), s.set(e.canRedo);
  }, c = () => r();
  return n.addListener(c), {
    store: n,
    undo: () => {
      const t = e.undo();
      return r(), t;
    },
    redo: () => {
      const t = e.redo();
      return r(), t;
    },
    record: () => {
      e.record(), r();
    },
    hold: () => e.hold(),
    unhold: () => {
      e.unhold(), r();
    },
    clear: () => {
      e.clear(), r();
    },
    peek: () => e.peek(),
    peekUndo: () => e.peekUndo(),
    peekRedo: () => e.peekRedo(),
    dispose: () => {
      n.isAlive && n.removeListener(c), e.dispose();
    },
    canUndo: o.readable,
    canRedo: s.readable,
    get isHeld() {
      return e.isHeld;
    },
    get isDisposed() {
      return e.isDisposed;
    }
  };
};
export {
  u as tardigradeHistory
};
