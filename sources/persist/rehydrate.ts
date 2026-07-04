import { Dictionary, Tardigrade } from "tardigrade-store";

export const rehydrate = (store: Tardigrade<any>, data: Dictionary): void => {
    Object
        .entries(data)
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
