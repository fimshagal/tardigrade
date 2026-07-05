/* Tardigrade history v1.9.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
import { shallowRef as c, getCurrentScope as a, onScopeDispose as l } from "vue";
import { history as p } from "tardigrade-store/history";
const h = (n, i) => {
  const e = p(n, i), r = c(e.canUndo), s = c(e.canRedo), o = () => {
    r.value = e.canUndo, s.value = e.canRedo;
  }, t = () => o();
  return n.addListener(t), a() && l(() => {
    n.isAlive && n.removeListener(t), e.dispose();
  }), {
    store: n,
    undo: () => {
      const d = e.undo();
      return o(), d;
    },
    redo: () => {
      const d = e.redo();
      return o(), d;
    },
    record: () => {
      e.record(), o();
    },
    hold: () => e.hold(),
    unhold: () => {
      e.unhold(), o();
    },
    clear: () => {
      e.clear(), o();
    },
    peek: () => e.peek(),
    peekUndo: () => e.peekUndo(),
    peekRedo: () => e.peekRedo(),
    dispose: () => e.dispose(),
    get canUndo() {
      return r.value;
    },
    get canRedo() {
      return s.value;
    },
    get isHeld() {
      return e.isHeld;
    },
    get isDisposed() {
      return e.isDisposed;
    }
  };
};
export {
  h as useHistory
};
