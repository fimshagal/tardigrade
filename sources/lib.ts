import { Tardigrade } from "./tardigrade";

export type DictionaryKey = string | number | symbol;

export type Dictionary<T = any> = {
    [key: DictionaryKey]: T;
};

export type Nullable<T> = T | null | undefined;

export type AnyFunction = (...args: any[]) => any;

// splits store shape S into props (non-functions) and resolvers (functions)
export type PropsOf<S extends Dictionary> = {
    [K in keyof S as S[K] extends AnyFunction ? never : K]: S[K];
};

export type ResolversOf<S extends Dictionary> = {
    [K in keyof S as S[K] extends AnyFunction ? K : never]: S[K];
};

// "string & {}" keeps autocomplete for known keys while still allowing dynamic ones
export type StorePropName<S extends Dictionary> = (keyof PropsOf<S> & string) | (string & {});

export type StorePropValue<S extends Dictionary, K> = K extends keyof PropsOf<S> ? PropsOf<S>[K] : any;

export type StoreResolverName<S extends Dictionary> = (keyof ResolversOf<S> & string) | (string & {});

export type StoreResolverValue<S extends Dictionary, K> = K extends keyof ResolversOf<S>
    ? (ResolversOf<S>[K] extends AnyFunction ? Awaited<ReturnType<ResolversOf<S>[K]>> : any)
    : any;

// batched updates via setProps deliver string[] as name and a dictionary of changed values
export type StoreListener<S extends Dictionary> = (name: string | string[], value: Nullable<any>, props: PropsOf<S> & Dictionary) => void;

// validates patch object against store shape: known keys are strictly typed, unknown stay any
export type StorePropsPatch<S extends Dictionary, P> = {
    [K in keyof P]: K extends keyof PropsOf<S> ? Nullable<PropsOf<S>[K]> : any;
};

// ward extension point: the rules layer (tardigrade-store/ward) plugs into core through these types
export type WardContext =
    | { kind: "setProp"; name: string; value: unknown }
    | { kind: "addProp"; name: string; value: unknown }
    | { kind: "setProps"; patch: Dictionary };

export type WardOutcome =
    | { allow: true; value?: unknown }
    | { allow: false; reason?: string };

export type WardRunner = (context: WardContext) => WardOutcome | void;

export interface ITardigrade<S extends Dictionary = Dictionary> {
    addProp<K extends StorePropName<S>>(name: K, value: StorePropValue<S, K>): void;
    hasProp(name: string): boolean;
    removeProp(name: string): void;
    removeAllProps(): void;
    setProp<K extends StorePropName<S>>(name: K, newValue: Nullable<StorePropValue<S, K>>): void;
    setProps<P extends Dictionary>(patch: P & StorePropsPatch<S, P>): void;
    addPropListener<K extends StorePropName<S>>(name: K, handler: (value: Nullable<StorePropValue<S, K>>) => void): void;
    removePropListener<K extends StorePropName<S>>(name: K, handler: (value: Nullable<StorePropValue<S, K>>) => void): void;
    removeAllPropListeners(name: string): void;
    prop<K extends StorePropName<S>>(name: K): Nullable<StorePropValue<S, K>>;
    addListener(handler: StoreListener<S>): void;
    removeListener(handler: StoreListener<S>): void;
    removeAllListeners(): void;
    importProps(target: Tardigrade<any>, override?: boolean): void;
    importResolvers(target: Tardigrade<any>, override?: boolean): void;
    merge(target: Tardigrade<any>, override?: boolean): void;
    addResolver(name: StoreResolverName<S>, resolver: AnyFunction): void;
    hasResolver(name: string): boolean;
    setResolver(name: StoreResolverName<S>, resolver: AnyFunction): void;
    removeResolver(name: string): void;
    removeAllResolvers(): void;
    callResolver(name: StoreResolverName<S>): Promise<void>;
    addResolverListener<K extends StoreResolverName<S>>(name: K, handler: (value: Nullable<StoreResolverValue<S, K>>) => void): void;
    removeResolverListener<K extends StoreResolverName<S>>(name: K, handler: (value: Nullable<StoreResolverValue<S, K>>) => void): void;
    removeAllResolverListeners(name: string): void;
    reset(): void;

    setMergeAgent(sessionKey: symbol, mergeAgent: Tardigrade<any>): void;
    kill(sessionKey: symbol): void;
    exportAllPropsListenerHandlers(sessionKey: symbol): Nullable<{}>;
    exportAllResolvers(sessionKey: symbol): Nullable<{}>;
    exportAllResolversListenerHandlers(sessionKey: symbol): Nullable<{}>;
    exportAllListenersHandlers(sessionKey: symbol): Nullable<((value: Nullable<any>) => void)[]>;

    get name(): DictionaryKey;
    get isAlive(): boolean;
    get mergeAgent(): Nullable<Tardigrade<any>>;
    get props(): PropsOf<S> & Dictionary;
}

export interface ITardigradeIncidentsHandler {
    warn(message?: string): void;
    error(message?: string): void;
}

export interface TardigradeInitialOptions {
    name?: DictionaryKey;
    strictObjectsInterfaces?: boolean; // not implemented
    emitErrors?: boolean;
}

export enum TardigradeTypes {
    Null = "null",
    Undefined = "undefined",
    Function = "function",
    AsyncFunction = "asyncfunction",
    Number = "number",
    String = "string",
    Boolean = "boolean",
    Array = "array",
    Object = "object",
    Any = "any",
}

export interface Prop<T> {
    name: string;
    value: T;
    type: TardigradeTypes;
    isValueScalar: boolean;
    interface?: Dictionary<string>;
}