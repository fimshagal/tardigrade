import { shallowRef } from "vue";
import type { Ref } from "vue";
import { Dictionary, Tardigrade } from "tardigrade-store";
import { areValuesEqual } from "../bridge/value.helpers";
import { useTardigradeStore } from "./context";
import { listenStore } from "./listen.helpers";

export type TardigradeSelector<T> = (props: Dictionary) => T;

export type TardigradeEqualityFn<T> = (a: T, b: T) => boolean;

export const useTardigradeSelector = <T>(
    selector: TardigradeSelector<T>,
    store?: Tardigrade<any>,
    isEqual: TardigradeEqualityFn<T> = areValuesEqual,
): Ref<T> => {
    const targetStore = useTardigradeStore(store);

    const state = shallowRef<T>(selector(targetStore.props)) as Ref<T>;

    listenStore(targetStore, (): void => {
        if (!targetStore.isAlive) {
            return;
        }

        const next = selector(targetStore.props);

        // reactivity triggers only when the selector result really changed
        if (!isEqual(state.value, next)) {
            state.value = next;
        }
    });

    return state;
};
