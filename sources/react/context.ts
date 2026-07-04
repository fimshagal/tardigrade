import { createContext, createElement, ReactElement, ReactNode, useContext } from "react";
import { Nullable, Tardigrade } from "tardigrade-store";

export const TardigradeContext = createContext<Nullable<Tardigrade<any>>>(null);

export interface TardigradeProviderProps {
    store: Tardigrade<any>;
    children?: ReactNode;
}

export const TardigradeProvider = ({ store, children }: TardigradeProviderProps): ReactElement =>
    createElement(TardigradeContext.Provider, { value: store }, children);

export const useTardigradeStore = (store?: Tardigrade<any>): Tardigrade<any> => {
    const contextStore = useContext(TardigradeContext);
    const targetStore = store ?? contextStore;

    if (!targetStore) {
        throw new Error("Tardigrade react bridge: store wasn't provided. Pass it into the hook directly or wrap your components with <TardigradeProvider store={...}>");
    }

    return targetStore;
};
