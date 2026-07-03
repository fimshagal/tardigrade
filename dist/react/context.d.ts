import { ReactElement, ReactNode } from "react";
import { Nullable, Tardigrade } from "tardigrade-store";
export declare const TardigradeContext: import("react").Context<Nullable<Tardigrade>>;
export interface TardigradeProviderProps {
    store: Tardigrade;
    children?: ReactNode;
}
export declare const TardigradeProvider: ({ store, children }: TardigradeProviderProps) => ReactElement;
export declare const useTardigradeStore: (store?: Tardigrade) => Tardigrade;
