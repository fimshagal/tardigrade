/* Tardigrade persist v1.9.0 */

/* Created by fSha | fimashagal@gmail.com */
           
/* MIT License | Copyright (c) 2024-2026 fSha | see LICENSE file */
import { Tardigrade as i, createTardigrade as p } from "tardigrade-store";
import { persist as s } from "tardigrade-store/persist";
function f(r, e, d) {
  const o = r instanceof i ? r : p(r, d);
  return s(o, e);
}
export {
  f as persistedTardigrade
};
