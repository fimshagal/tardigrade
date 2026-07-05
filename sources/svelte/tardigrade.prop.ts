import { Nullable, Tardigrade } from "tardigrade-store";
import { areValuesEqual } from "../bridge/value.helpers";
import { TardigradeSubscriber, TardigradeUnsubscriber, TardigradeWritable } from "./contract";

export const tardigradeProp = <T>(store: Tardigrade<any>, name: string): TardigradeWritable<Nullable<T>> => {
    // prop() clones complex values, so svelte never holds store's internal reference
    const read = (): Nullable<T> =>
        store.isAlive && store.hasProp(name) ? (store.prop(name) as Nullable<T>) : null;

    const subscribe = (run: TardigradeSubscriber<Nullable<T>>): TardigradeUnsubscriber => {
        let current = read();

        // store contract: the subscriber receives the current value synchronously
        run(current);

        const handler = (updatedName: string | string[]): void => {
            // global listener catches updates even for props added after subscription;
            // batched setProps updates arrive as (names[], values dictionary)
            const isRelevant = Array.isArray(updatedName)
                ? updatedName.includes(name)
                : updatedName === name;

            if (!isRelevant) {
                return;
            }

            const fresh = read();

            // content-equal objects keep the previous reference: no extra invalidations
            if (!areValuesEqual(current, fresh)) {
                current = fresh;
                run(fresh);
            }
        };

        store.addListener(handler);

        return () => {
            if (!store.isAlive) {
                return;
            }

            store.removeListener(handler);
        };
    };

    return {
        subscribe,
        // writes go through the store, so ward rules and type checks apply
        set: (value: Nullable<T>): void => {
            store.setProp(name, value);
        },
        update: (updater: (value: Nullable<T>) => Nullable<T>): void => {
            store.setProp(name, updater(read()));
        },
    };
};
