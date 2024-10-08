import { Dictionary, ITardigrade, Nullable, Prop, TardigradeInitialOptions } from "./lib";
export declare class Tardigrade implements ITardigrade {
    private _resolvers;
    private _props;
    private _resolverListenerHandlers;
    private _propListenerHandlers;
    private _listenerHandlers;
    private _alive;
    private readonly _sessionKey;
    constructor(sessionKey: symbol, initialOptions: TardigradeInitialOptions);
    addResolver(name: string, resolver: (...args: any[]) => any): void;
    setResolver(name: string, resolver: (...args: any[]) => any): void;
    removeResolver(name: string): void;
    callResolver(name: string): Promise<void>;
    addResolverListener(name: string, handler: (value: Nullable<any>) => void): void;
    removeResolverListener(name: string, handler: (value: Nullable<any>) => void): void;
    removeAllResolverListeners(name: string): void;
    addProp<T>(name: string, value: T): void;
    removeProp(name: string): void;
    setProp<T>(name: string, newValue: T): void;
    addPropListener(name: string, handler: (value: Nullable<any>) => void): void;
    removePropListener(name: string, handler: (value: Nullable<any>) => void): void;
    removeAllPropListeners(name: string): void;
    prop(name: string): Nullable<any>;
    hasProp(name: string): boolean;
    addListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void;
    removeListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void;
    removeAllListeners(): void;
    importResolvers(target: Tardigrade, override?: boolean): void;
    importProps(target: Tardigrade, override?: boolean): void;
    merge(target: Tardigrade, override?: boolean): void;
    kill(sessionKey: symbol): void;
    exportAllPropsListenerHandlers(sessionKey: symbol): Nullable<{}>;
    exportAllResolvers(sessionKey: symbol): Nullable<{}>;
    exportAllResolversListenerHandlers(sessionKey: symbol): Nullable<{}>;
    exportAllListenersHandlers(sessionKey: symbol): Nullable<((value: Nullable<any>) => void)[]>;
    private silentImportProps;
    private silentSetProp;
    private silentAddProp;
    private importAllResolversListenerHandlers;
    private importAllPropsListenerHandlers;
    private importAllListenersHandlers;
    private isPropListened;
    private handleOnCallResolver;
    private handleOnSetProp;
    private cloneComplexData;
    get props(): Dictionary;
}
