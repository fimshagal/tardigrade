import { shallowRef } from "vue";
import type { Ref } from "vue";
import { Nullable, Tardigrade } from "tardigrade-store";
import { useTardigradeStore } from "./context";
import { listenStore } from "./listen.helpers";

export const useTardigradeResolver = <T>(name: string, store?: Tardigrade<any>): [() => Promise<void>, Ref<Nullable<T>>] => {
    const targetStore = useTardigradeStore(store);

    const value = shallowRef<Nullable<T>>(null);

    listenStore(targetStore, (updatedName, updatedValue): void => {
        // batched prop updates arrive with string[] name and are ignored here
        if (updatedName !== name) {
            return;
        }

        value.value = updatedValue as Nullable<T>;
    });

    const callResolver = (): Promise<void> => targetStore.callResolver(name);

    return [callResolver, value];
};
