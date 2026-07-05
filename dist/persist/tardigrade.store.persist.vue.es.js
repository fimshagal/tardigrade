/* Tardigrade persist v1.9.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
import { getCurrentInstance as f, onMounted as i, getCurrentScope as d, onScopeDispose as c } from "vue";
import { Tardigrade as a, createTardigrade as p } from "tardigrade-store";
import { persist as u } from "tardigrade-store/persist";
function l(r, o, s) {
  const n = r instanceof a ? r : p(r, s), e = u(n, { ...o, restoreOnStart: !1 }), t = o.restoreOnStart !== !1;
  return f() ? i(() => {
    t && e.restore();
  }) : t && e.restore(), d() && c(() => e.dispose()), e;
}
export {
  l as usePersistedTardigrade
};
