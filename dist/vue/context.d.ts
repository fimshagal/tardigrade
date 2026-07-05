import type { InjectionKey } from "vue";
import { Tardigrade } from "tardigrade-store";
export declare const TARDIGRADE_INJECTION_KEY: InjectionKey<Tardigrade<any>>;
/** Makes the store available to all descendant components (vue analog of TardigradeProvider) */
export declare const provideTardigradeStore: (store: Tardigrade<any>) => void;
export declare const useTardigradeStore: (store?: Tardigrade<any>) => Tardigrade<any>;
