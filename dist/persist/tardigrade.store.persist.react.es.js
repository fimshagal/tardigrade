/* Tardigrade persist v1.8.1 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
import { useRef as o, useEffect as i } from "react";
import { Tardigrade as d, createTardigrade as a } from "tardigrade-store";
import { persist as l } from "tardigrade-store/persist";
function g(e, n, u) {
  const t = o(null);
  t.current || (t.current = e instanceof d ? e : a(e, u));
  const r = o(null), s = () => ((!r.current || r.current.isDisposed) && (r.current = l(t.current, { ...n, restoreOnStart: !1 })), r.current), f = s();
  return i(() => {
    const c = s();
    return n.restoreOnStart !== !1 && c.restore(), () => c.dispose();
  }, []), f;
}
export {
  g as usePersistedTardigrade
};
