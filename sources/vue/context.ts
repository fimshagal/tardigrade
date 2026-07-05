import { getCurrentInstance, inject, provide } from "vue";
import type { InjectionKey } from "vue";
import { Nullable, Tardigrade } from "tardigrade-store";

export const TARDIGRADE_INJECTION_KEY: InjectionKey<Tardigrade<any>> = Symbol("tardigrade-store");

/** Makes the store available to all descendant components (vue analog of TardigradeProvider) */
export const provideTardigradeStore = (store: Tardigrade<any>): void => {
    provide(TARDIGRADE_INJECTION_KEY, store);
};

export const useTardigradeStore = (store?: Tardigrade<any>): Tardigrade<any> => {
    // inject is only legal inside setup; outside of it the explicit argument is the only source
    const injected: Nullable<Tardigrade<any>> = getCurrentInstance()
        ? inject(TARDIGRADE_INJECTION_KEY, null)
        : null;

    const targetStore = store ?? injected;

    if (!targetStore) {
        throw new Error("Tardigrade vue bridge: store wasn't provided. Pass it into the composable directly or call provideTardigradeStore(store) in a parent component");
    }

    return targetStore;
};
