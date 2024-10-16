import { Tardigrade } from "./tardigrade";
export type DictionaryKey = string | number | symbol;
export type Dictionary<T = any> = {
    [key: DictionaryKey]: T;
};
export type Nullable<T> = T | null | undefined;
export interface ITardigrade {
    addProp<T>(name: string, value: T): void;
    hasProp(name: string): boolean;
    removeProp(name: string): void;
    removeAllProps(): void;
    setProp<T>(name: string, newValue: T): void;
    addPropListener(name: string, handler: (value: Nullable<any>) => void): void;
    removePropListener(name: string, handler: (value: Nullable<any>) => void): void;
    removeAllPropListeners(name: string): void;
    prop(name: string): Nullable<any>;
    addListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void;
    removeListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void;
    removeAllListeners(): void;
    importProps(target: Tardigrade, override?: boolean): void;
    importResolvers(target: Tardigrade, override?: boolean): void;
    merge(target: Tardigrade, override?: boolean): void;
    addResolver(name: string, resolver: (...args: any[]) => any): void;
    hasResolver(name: string): boolean;
    setResolver(name: string, resolver: (...args: any[]) => any): void;
    removeResolver(name: string): void;
    removeAllResolvers(): void;
    callResolver(name: string): Promise<void>;
    addResolverListener(name: string, handler: (value: Nullable<any>) => void): void;
    removeResolverListener(name: string, handler: (value: Nullable<any>) => void): void;
    removeAllResolverListeners(name: string): void;
    reset(): void;
    setMergeAgent(sessionKey: symbol, mergeAgent: Tardigrade): void;
    kill(sessionKey: symbol): void;
    exportAllPropsListenerHandlers(sessionKey: symbol): Nullable<{}>;
    exportAllResolvers(sessionKey: symbol): Nullable<{}>;
    exportAllResolversListenerHandlers(sessionKey: symbol): Nullable<{}>;
    exportAllListenersHandlers(sessionKey: symbol): Nullable<((value: Nullable<any>) => void)[]>;
    get name(): DictionaryKey;
    get isAlive(): boolean;
    get mergeAgent(): Nullable<Tardigrade>;
}
export interface ITardigradeIncidentsHandler {
    warn(message?: string): void;
    error(message?: string): void;
}
export interface TardigradeInitialOptions {
    name?: DictionaryKey;
    strictObjectsInterfaces?: boolean;
    emitErrors?: boolean;
}
export declare enum TardigradeTypes {
    Null = "null",
    Undefined = "undefined",
    Function = "function",
    AsyncFunction = "asyncfunction",
    Number = "number",
    String = "string",
    Boolean = "boolean",
    Array = "array",
    Object = "object",
    Any = "any"
}
export interface Prop<T> {
    name: string;
    value: T;
    type: TardigradeTypes;
    isValueScalar: boolean;
    interface?: Dictionary<string>;
}
