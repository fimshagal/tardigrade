import {Dictionary, ITardigrade, Nullable, Prop, TardigradeInitialOptions, TardigradeTypes} from "./lib";
import { typeOf, isDef, isScalar } from "./type.of";
import { hasOwnProperty } from "./has.own.property";

export class Tardigrade implements ITardigrade {
    private _resolvers: Dictionary<(...args: any[]) => any> = {};
    private _props: Dictionary<Prop<any>> = {};
    private _resolverListenerHandlers: Dictionary<((...args: any[]) => void)[]> = {};
    private _propListenerHandlers: Dictionary = {};
    private _listenerHandlers: ((...args: any[]) => void)[] = [];
    private _alive: boolean = true;

    private readonly _sessionKey: Nullable<symbol> = null;

    constructor(sessionKey: symbol, initialOptions: TardigradeInitialOptions) {
        if (!sessionKey) {
            throw Error("Tardigrade constructor error");
        }

        this._sessionKey = sessionKey;
    }

    public addResolver(name: string, resolver: (...args: any[]) => any): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (typeOf(resolver) !== TardigradeTypes.Function && typeOf(resolver) !== TardigradeTypes.AsyncFunction) {
            console.error('Tardigrade: resolver have to be a function');
            return;
        }

        if (hasOwnProperty(this._resolvers, name)) {
            console.error('Tardigrade: resolver has been planted');
            return;
        }

        this._resolvers[name] = resolver;
    }

    public setResolver(name: string, resolver: (...args: any[]) => any): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (typeOf(resolver) !== TardigradeTypes.Function && typeOf(resolver) !== TardigradeTypes.AsyncFunction) {
            console.error('Tardigrade: resolver have to be a function');
            return;
        }

        if (!hasOwnProperty(this._resolvers, name)) {
            console.error('Tardigrade: resolver has been planted');
            return;
        }

        this._resolvers[name] = resolver;
    }

    public removeResolver(name: string): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (!hasOwnProperty(this._resolvers, name)) {
            return;
        }

        delete this._resolvers[name];
        delete this._resolverListenerHandlers[name];
    }

    public async callResolver(name: string): Promise<void> {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (!hasOwnProperty(this._resolvers, name)) {
            console.error("Tardigrade: this resolver hasn't been created yet or been deleted");
            return;
        }

        const value = await this._resolvers[name](this.props);

        this.handleOnCallResolver(name, value);

        if (!hasOwnProperty(this._resolverListenerHandlers, name)) {
            return;
        }

        this._resolverListenerHandlers[name]
            .forEach((handler) => handler(value));
    }

    public addResolverListener(name: string, handler: (value: Nullable<any>) => void): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (!hasOwnProperty(this._resolvers, name)) {
            console.error(`Tardigrade: there is no resolver with name "${name}"`);
            return;
        }

        if (!hasOwnProperty(this._resolverListenerHandlers, name)) {
            this._resolverListenerHandlers[name] = [];
        }

        this._resolverListenerHandlers[name].push(handler);
    }

    public removeResolverListener(name: string, handler: (value: Nullable<any>) => void): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (!hasOwnProperty(this._resolverListenerHandlers, name)) {
            return;
        }

        this._resolverListenerHandlers[name] = this._resolverListenerHandlers[name]
            .filter((listenerHandler) => listenerHandler !== handler);
    }

    public removeAllResolverListeners(name: string): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (!hasOwnProperty(this._resolverListenerHandlers, name)) {
            return;
        }

        delete this._resolverListenerHandlers[name];
    }

    public addProp<T>(name: string, value: T): void {
        this.silentAddProp(name, value);
        this.handleOnSetProp(this._props[name]);
    }

    public removeProp(name: string): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (!this.hasProp(name)) {
            console.error("Tardigrade: prop can't be deleted, you have to remove prop first");
            return;
        }

        this.removeAllPropListeners(name);
        delete this._props[name];
    }

    public setProp<T>(name: string, newValue: T): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (!this.hasProp(name)) {
            console.error(`Tardigrade: prop "${name}" wasn't registered. You have to add this prop first`);
            return;
        }

        const handler = (name: string, newValue: any): void => {
            this._props[name].value = newValue;
            this.handleOnSetProp(this._props[name]);
        };

        const prop: Prop<any> = this._props[name];
        const newType: string = typeOf(newValue);

        if (!isDef(newValue)) {
            handler(name, null);
            return;
        }

        if (prop.type !== newType) {
            console.error(`Tardigrade: new value must have same type as initial value for prop "${name}"`);
            return;
        }

        if (!prop.isValueScalar) {
            try {
                JSON.stringify(newValue);
            } catch (error) {
                console.error("Tardigrade: complex data has to be json-friendly");
                return;
            }
        }

        handler(name, newValue);
    }

    public addPropListener(name: string, handler: (value: Nullable<any>) => void): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (!this.hasProp(name)) {
            console.error(`Tardigrade: prop "${name}" wasn't registered. You have to add this prop first`);
            return;
        }

        if (!this.isPropListened(name)) {
            this._propListenerHandlers[name] = [];
        }

        this._propListenerHandlers[name].push(handler);
    }

    public removePropListener(name: string, handler: (value: Nullable<any>) => void): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (!this.isPropListened(name)) {
            console.error(`Tardigrade: prop "${name}" doesn't have any listeners`);
            return;
        }

        this._propListenerHandlers[name] = this._propListenerHandlers[name]
            .filter((existedHandler: any) => existedHandler !== handler);
    }

    public removeAllPropListeners(name: string): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (!this.isPropListened(name)) {
            console.warn(`Tardigrade: prop "${name}" doesn't have any listeners`);
            return;
        }

        delete this._propListenerHandlers[name];
    }

    public prop(name: string): Nullable<any> {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return null;
        }

        if (!this.hasProp(name)) {
            console.error(`Tardigrade: prop "${name}" wasn't registered. You have to add this prop first`);
            return null;
        }

        const prop: Prop<any> = this._props[name];

        if (prop.isValueScalar) {
            return prop.value;
        }

        return this.cloneComplexData(prop.value);
    }

    public hasProp(name: string): boolean {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return false;
        }

        return hasOwnProperty(this._props, name);
    }

    public addListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        this._listenerHandlers.push(handler);
    }

    public removeListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        this._listenerHandlers = this._listenerHandlers
            .filter((existedHandler): boolean => existedHandler !== handler);
    }

    public removeAllListeners(): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        this._listenerHandlers = [];
    }

    public importResolvers(target: Tardigrade, override?: boolean): void {
        const importedResolvers = target.exportAllResolvers(this._sessionKey!);

        this._resolvers = override ? {
                ...this._resolvers,
                ...importedResolvers,
            }
            : {
                ...importedResolvers,
                ...this._resolvers,
            };
    }

    public importProps(target: Tardigrade, override?: boolean): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        const importedProps = target.props;

        Object
            .entries(importedProps)
            .forEach(([key, value]) => {
                if (this.hasProp(key)) {
                    if (!override) return;
                    this.setProp(key, value);
                } else {
                    this.addProp(key, value);
                }
            });
    }

    public merge(target: Tardigrade, override?: boolean): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        const targetPropsNames = Object.keys(target.props);

        this.silentImportProps(target, override);
        this.importAllPropsListenerHandlers(target, override);
        this.importAllListenersHandlers(target, override);
        this.importResolvers(target, override);
        this.importAllResolversListenerHandlers(target, override);
        target.kill(this._sessionKey!);

        targetPropsNames
            .forEach((name) => {
                this.handleOnSetProp(this._props[name]);
            });
    }

    public kill(sessionKey: symbol): void {
        if (sessionKey !== this._sessionKey || !this._alive) {
            return;
        }

        const propNames = Object
            .keys(this._props);

        this.removeAllListeners();

        propNames.forEach((propName: string) => {
            this.removeAllPropListeners(propName);
            this.removeProp(propName);
        });

        this._alive = false;
    }

    public exportAllPropsListenerHandlers(sessionKey: symbol): Nullable<{}> {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (sessionKey !== this._sessionKey) {
            return null;
        }

        return { ...this._propListenerHandlers };
    }

    public exportAllResolvers(sessionKey: symbol): Nullable<{}> {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (sessionKey !== this._sessionKey) {
            return null;
        }

        return { ...this._resolvers };
    }

    public exportAllResolversListenerHandlers(sessionKey: symbol): Nullable<{}> {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (sessionKey !== this._sessionKey) {
            return null;
        }

        return { ...this._resolverListenerHandlers };
    }

    public exportAllListenersHandlers(sessionKey: symbol): Nullable<((value: Nullable<any>) => void)[]> {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (sessionKey !== this._sessionKey) {
            return null;
        }

        return [ ...this._listenerHandlers ];
    }

    private silentImportProps(target: Tardigrade, override?: boolean): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        const importedProps = target.props;

        Object
            .entries(importedProps)
            .forEach(([key, value]) => {
                if (this.hasProp(key)) {
                    if (!override) return;
                    this.silentSetProp(key, value);
                } else {
                    this.silentAddProp(key, value);
                }
            });
    }

    private silentSetProp<T>(name: string, newValue: T): void {
        if (!this.hasProp(name)) {
            console.error(`Tardigrade: prop "${name}" wasn't registered. You have to add this prop first`);
            return;
        }

        const handler = (name: string, newValue: any): void => {
            this._props[name].value = newValue;
        };

        const prop: Prop<any> = this._props[name];
        const newType: string = typeOf(newValue);

        if (!isDef(newValue)) {
            handler(name, null);
            return;
        }

        if (prop.type !== newType) {
            console.error(`Tardigrade: new value must have same type as initial value for prop "${name}"`);
            return;
        }

        if (!prop.isValueScalar) {
            try {
                JSON.stringify(newValue);
            } catch (error) {
                console.error("Tardigrade: complex data has to be json-friendly");
                return;
            }
        }

        handler(name, newValue);
    }

    private silentAddProp<T>(name: string, value: T): void {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return;
        }

        if (this.hasProp(name)) {
            console.error("Tardigrade: prop can't be override, you have to remove prop first");
            return;
        }

        if (!isDef(value)) {
            console.error("Tardigrade: value can't be nullable");
            return;
        }

        const type: string = typeOf(value) as TardigradeTypes;
        const isValueScalar: boolean = isScalar(value);

        if (isValueScalar) {
            this._props[name] = { name, value, type, isValueScalar } as Prop<T>;
            return;
        }

        try {
            JSON.stringify(value);
        } catch (error) {
            console.error("Tardigrade: complex data has to be json-friendly");
            return;
        }

        this._props[name] = { name, value, type, isValueScalar } as Prop<T>;
    }

    private importAllResolversListenerHandlers(target: Tardigrade, override?: boolean): void {
        const importedResolversHandlers = target.exportAllResolversListenerHandlers(this._sessionKey!);

        this._propListenerHandlers = override ? {
            ...this._resolverListenerHandlers,
            ...importedResolversHandlers,
        } : {
            ...importedResolversHandlers,
            ...this._resolverListenerHandlers,
        };
    }

    private importAllPropsListenerHandlers(target: Tardigrade, override?: boolean): void {
        const importedHandlers = target.exportAllPropsListenerHandlers(this._sessionKey!);

        this._propListenerHandlers = override ? {
            ...this._propListenerHandlers,
            ...importedHandlers,
        } : {
            ...importedHandlers,
            ...this._propListenerHandlers,
        };
    }

    private importAllListenersHandlers(target: Tardigrade, override?: boolean): void {
        const importedHandlers = target.exportAllListenersHandlers(this._sessionKey!) as Nullable<((value: Nullable<any>) => void)[]>;
        const merged = [
            ...this._listenerHandlers,
            ...importedHandlers!,
        ];

        this._listenerHandlers = override
            ? [...new Set(merged)]
            : merged;
    }

    private isPropListened(name: string): boolean {
        return hasOwnProperty(this._propListenerHandlers, name);
    }

    private handleOnCallResolver(updatedResolverName: string, value: any): void {
        for (const handler of this._listenerHandlers) {
            handler(updatedResolverName, value, this.props);
        }
    }

    private handleOnSetProp(updatedProp: Prop<any>): void {
        if (this.isPropListened(updatedProp.name)) {
            for (const handler of this._propListenerHandlers[updatedProp.name]) {
                handler(updatedProp.value);
            }
        }

        for (const handler of this._listenerHandlers) {
            handler(updatedProp.name, updatedProp.value, this.props);
        }
    }

    private cloneComplexData<T>(complexData: T): any {
        return JSON.parse(JSON.stringify(complexData));
    }

    public get props(): Dictionary {
        if (!this._alive) {
            console.error("Tardigrade: this store doesn't support yet");
            return {};
        }

        const response: Dictionary = {};

        Object
            .entries(this._props)
            .forEach(([propName, prop]): void => {
                response[propName] = prop.isValueScalar ? prop.value : this.cloneComplexData(prop.value);
            });

        return response;
    }
}