import { Dictionary, Tardigrade } from "tardigrade-store";

/**
 * Applies a snapshot onto the store without reset(): first removes keys that are
 * visible through the current picked view but missing from the target snapshot,
 * then writes target values via setProp/addProp (same merging logic as persist rehydrate).
 *
 * Keys outside of currentPicked are never touched, so unpicked props survive undo/redo.
 */
export const restoreSnapshot = (store: Tardigrade<any>, target: Dictionary, currentPicked: Dictionary): void => {
    Object
        .keys(currentPicked)
        .forEach((name): void => {
            if (!(name in target) && store.hasProp(name)) {
                store.removeProp(name);
            }
        });

    Object
        .entries(target)
        .forEach(([name, value]): void => {
            if (store.hasProp(name)) {
                store.setProp(name, value);
                return;
            }

            // core forbids adding nullable props, so a null for an unknown prop is skipped
            if (value === null || value === undefined) {
                return;
            }

            store.addProp(name, value);
        });
};
