import { computed, shallowRef } from "vue";
import type { WritableComputedRef } from "vue";
import { Nullable, Tardigrade } from "tardigrade-store";
import { areValuesEqual } from "../bridge/value.helpers";
import { useTardigradeStore } from "./context";
import { listenStore } from "./listen.helpers";

export const useTardigradeProp = <T>(name: string, store?: Tardigrade<any>): WritableComputedRef<Nullable<T>> => {
    const targetStore = useTardigradeStore(store);

    // prop() clones complex values, so vue never holds store's internal reference
    const read = (): Nullable<T> =>
        targetStore.isAlive && targetStore.hasProp(name) ? (targetStore.prop(name) as Nullable<T>) : null;

    const state = shallowRef<Nullable<T>>(read());

    listenStore(targetStore, (updatedName): void => {
        // global listener catches updates even for props added after mount;
        // batched setProps updates arrive as (names[], values dictionary)
        const isRelevant = Array.isArray(updatedName)
            ? updatedName.includes(name)
            : updatedName === name;

        if (!isRelevant) {
            return;
        }

        const fresh = read();

        // content-equal objects keep the previous reference: no extra reactivity triggers
        if (!areValuesEqual(state.value, fresh)) {
            state.value = fresh;
        }
    });

    // writable ref: v-model friendly, set goes through the store (and its ward rules)
    return computed({
        get: () => state.value,
        set: (nextValue: Nullable<T>) => {
            targetStore.setProp(name, nextValue);
        },
    });
};
