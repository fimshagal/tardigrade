import { Tardigrade } from "./tardigrade";
export type DictionaryKey = string | number | symbol;
export type Dictionary<T = any> = {
    [key: DictionaryKey]: T;
};
export type Nullable<T> = T | null | undefined;
export interface ITardigrade {
    addProp<T>(name: string, value: T): void;
    removeProp(name: string): void;
    setProp<T>(name: string, newValue: T): void;
    addPropListener(name: string, handler: (value: Nullable<any>) => void): void;
    removePropListener(name: string, handler: (value: Nullable<any>) => void): void;
    removeAllPropListeners(name: string): void;
    prop(name: string): Nullable<any>;
    addListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void;
    removeListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void;
    removeAllListeners(): void;
    importProps(target: Tardigrade): void;
    merge(target: Tardigrade): void;
}
export interface Prop<T> {
    name: string;
    value: T;
    type: string;
    isValueScalar: boolean;
}
