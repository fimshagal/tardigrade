/* Tardigrade persist v1.6.0 */

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
