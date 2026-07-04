import { Dictionary, Tardigrade } from "tardigrade-store";
/**
 * Applies a snapshot onto the store without reset(): first removes keys that are
 * visible through the current picked view but missing from the target snapshot,
 * then writes target values via setProp/addProp (same merging logic as persist rehydrate).
 *
 * Keys outside of currentPicked are never touched, so unpicked props survive undo/redo.
 */
export declare const restoreSnapshot: (store: Tardigrade<any>, target: Dictionary, currentPicked: Dictionary) => void;
