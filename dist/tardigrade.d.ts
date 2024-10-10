import { Dictionary, ITardigrade, Nullable, Prop, TardigradeInitialOptions } from "./lib";
import { TardigradeIncidentsHandler } from "./tardigrade.incidents.handler";
export declare class Tardigrade implements ITardigrade {
    protected _resolvers: Dictionary<(...args: any[]) => any>;
    protected _props: Dictionary<Prop<any>>;
    protected _resolverListenerHandlers: Dictionary<((...args: any[]) => void)[]>;
    protected _propListenerHandlers: Dictionary;
    protected _listenerHandlers: ((...args: any[]) => void)[];
    protected _alive: boolean;
    protected _mergeAgent: Nullable<Tardigrade>;
    protected readonly _incidentsHandler: Nullable<TardigradeIncidentsHandler>;
    protected readonly _sessionKey: Nullable<symbol>;
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
    setMergeAgent(sessionKey: symbol, mergeAgent: Tardigrade): void;
    protected silentImportProps(target: Tardigrade, override?: boolean): void;
    protected silentSetProp<T>(name: string, newValue: T): void;
    protected silentAddProp<T>(name: string, value: T): void;
    protected importAllResolversListenerHandlers(target: Tardigrade, override?: boolean): void;
    protected importAllPropsListenerHandlers(target: Tardigrade, override?: boolean): void;
    protected importAllListenersHandlers(target: Tardigrade, override?: boolean): void;
    protected isPropListened(name: string): boolean;
    protected handleOnCallResolver(updatedResolverName: string, value: any): void;
    protected handleOnSetProp(updatedProp: Prop<any>): void;
    protected isObjectJsonFriendly(object: any): boolean;
    protected cloneComplexData<T>(complexData: T): any;
    get mergeAgent(): Nullable<Tardigrade>;
    get isAlive(): boolean;
    get props(): Dictionary;
    protected get incidentsHandler(): Nullable<TardigradeIncidentsHandler>;
}
