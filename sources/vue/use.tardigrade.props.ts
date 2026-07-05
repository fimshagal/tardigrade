import { shallowRef } from "vue";
import type { Ref } from "vue";
import { Dictionary, Tardigrade } from "tardigrade-store";
import { areValuesEqual } from "../bridge/value.helpers";
import { useTardigradeStore } from "./context";
import { listenStore } from "./listen.helpers";

export const useTardigradeProps = (store?: Tardigrade<any>): Ref<Dictionary> => {
    const targetStore = useTardigradeStore(store);

    const read = (): Dictionary => (targetStore.isAlive ? targetStore.props : {});

    const state = shallowRef<Dictionary>(read());

    listenStore(targetStore, (): void => {
        const fresh = read();

        if (!areValuesEqual(state.value, fresh)) {
            state.value = fresh;
        }
    });

    return state;
};
