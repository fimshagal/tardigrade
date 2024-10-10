import {Dictionary, ITardigrade, Nullable, Prop, TardigradeInitialOptions, TardigradeTypes} from "./lib";
import { typeOf, isDef, isScalar } from "./type.of";
import { hasOwnProperty } from "./has.own.property";
import { TardigradeIncidentsHandler } from "./tardigrade.incidents.handler";
import {createIncidentsHandler} from "./x/create.incidents.handler";

export class Tardigrade implements ITardigrade {
    protected _resolvers: Dictionary<(...args: any[]) => any> = {};
    protected _props: Dictionary<Prop<any>> = {};
    protected _resolverListenerHandlers: Dictionary<((...args: any[]) => void)[]> = {};
    protected _propListenerHandlers: Dictionary = {};
    protected _listenerHandlers: ((...args: any[]) => void)[] = [];
    protected _alive: boolean = true;
    protected _mergeAgent: Nullable<Tardigrade> = null;

    protected readonly _incidentsHandler: Nullable<TardigradeIncidentsHandler> = null;
    protected readonly _sessionKey: Nullable<symbol> = null;

    constructor(sessionKey: symbol, initialOptions: TardigradeInitialOptions) {
        if (!sessionKey) {
            throw Error("Tardigrade constructor error");
        }

        const { emitErrors } = initialOptions;

        this._incidentsHandler = createIncidentsHandler(emitErrors);

        this._sessionKey = sessionKey;
    }

    public addResolver(name: string, resolver: (...args: any[]) => any): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (typeOf(resolver) !== TardigradeTypes.Function && typeOf(resolver) !== TardigradeTypes.AsyncFunction) {
            this.incidentsHandler?.error('Resolver have to be a function');
            return;
        }

        if (hasOwnProperty(this._resolvers, name)) {
            this.incidentsHandler?.error('Resolver has been planted');
            return;
        }

        this._resolvers[name] = resolver;
    }

    public setResolver(name: string, resolver: (...args: any[]) => any): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (typeOf(resolver) !== TardigradeTypes.Function && typeOf(resolver) !== TardigradeTypes.AsyncFunction) {
            this.incidentsHandler?.error('Resolver have to be a function');
            return;
        }

        if (!hasOwnProperty(this._resolvers, name)) {
            this.incidentsHandler?.error('Resolver has been planted');
            return;
        }

        this._resolvers[name] = resolver;
    }

    public removeResolver(name: string): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
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
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (!hasOwnProperty(this._resolvers, name)) {
            this.incidentsHandler?.error("This resolver hasn't been created yet or been deleted");
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
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (!hasOwnProperty(this._resolvers, name)) {
            this.incidentsHandler?.error(`There is no resolver with name "${name}"`);
            return;
        }

        if (!hasOwnProperty(this._resolverListenerHandlers, name)) {
            this._resolverListenerHandlers[name] = [];
        }

        this._resolverListenerHandlers[name].push(handler);
    }

    public removeResolverListener(name: string, handler: (value: Nullable<any>) => void): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
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
            this.incidentsHandler?.error("This store doesn't support anymore");
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
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (!this.hasProp(name)) {
            this.incidentsHandler?.error("Prop can't be deleted, you have to remove prop first");
            return;
        }

        this.removeAllPropListeners(name);
        delete this._props[name];
    }

    public setProp<T>(name: string, newValue: T): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (!this.hasProp(name)) {
            this.incidentsHandler?.error(`Prop "${name}" wasn't registered. You have to add this prop first`);
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
            this.incidentsHandler?.error(`New value must have same type as initial value for prop "${name}"`);
            return;
        }

        if (!prop.isValueScalar) {
            try {
                JSON.stringify(newValue);
            } catch (error) {
                this.incidentsHandler?.error("Complex data has to be json-friendly");
                return;
            }
        }

        if (prop.isValueScalar) {
            handler(name, newValue);
            return;
        }

        const isComplexDataJsonFriendly: boolean = this.isObjectJsonFriendly(newValue);

        if (!isComplexDataJsonFriendly) {
            this.incidentsHandler?.error("Complex data has to be json-friendly");
            return;
        }

        handler(name, newValue);
    }

    public addPropListener(name: string, handler: (value: Nullable<any>) => void): void {
        if (!this._alive) {
            this.incidentsHandler?.error("store doesn't support anymore");
            return;
        }

        if (!this.hasProp(name)) {
            this.incidentsHandler?.error(`Prop "${name}" wasn't registered. You have to add this prop first`);
            return;
        }

        if (!this.isPropListened(name)) {
            this._propListenerHandlers[name] = [];
        }

        this._propListenerHandlers[name].push(handler);
    }

    public removePropListener(name: string, handler: (value: Nullable<any>) => void): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (!this.isPropListened(name)) {
            this.incidentsHandler?.error(`Prop "${name}" doesn't have any listeners`);
            return;
        }

        this._propListenerHandlers[name] = this._propListenerHandlers[name]
            .filter((existedHandler: any) => existedHandler !== handler);
    }

    public removeAllPropListeners(name: string): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (!this.isPropListened(name)) {
            this.incidentsHandler?.warn(`Prop "${name}" doesn't have any listeners`);
            return;
        }

        delete this._propListenerHandlers[name];
    }

    public prop(name: string): Nullable<any> {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return null;
        }

        if (!this.hasProp(name)) {
            this.incidentsHandler?.error(`Prop "${name}" wasn't registered. You have to add this prop first`);
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
            this.incidentsHandler?.error("This store doesn't support anymore");
            return false;
        }

        return hasOwnProperty(this._props, name);
    }

    public addListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        this._listenerHandlers.push(handler);
    }

    public removeListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        this._listenerHandlers = this._listenerHandlers
            .filter((existedHandler): boolean => existedHandler !== handler);
    }

    public removeAllListeners(): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
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
            this.incidentsHandler?.error("This store doesn't support anymore");
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
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        const targetPropsNames = Object.keys(target.props);

        this.silentImportProps(target, override);
        this.importAllPropsListenerHandlers(target, override);
        this.importAllListenersHandlers(target, override);
        this.importResolvers(target, override);
        this.importAllResolversListenerHandlers(target, override);
        target.kill(this._sessionKey!);
        target.setMergeAgent(this._sessionKey!, this);

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
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (sessionKey !== this._sessionKey) {
            return null;
        }

        return { ...this._propListenerHandlers };
    }

    public exportAllResolvers(sessionKey: symbol): Nullable<{}> {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (sessionKey !== this._sessionKey) {
            return null;
        }

        return { ...this._resolvers };
    }

    public exportAllResolversListenerHandlers(sessionKey: symbol): Nullable<{}> {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (sessionKey !== this._sessionKey) {
            return null;
        }

        return { ...this._resolverListenerHandlers };
    }

    public exportAllListenersHandlers(sessionKey: symbol): Nullable<((value: Nullable<any>) => void)[]> {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (sessionKey !== this._sessionKey) {
            return null;
        }

        return [ ...this._listenerHandlers ];
    }

    public setMergeAgent(sessionKey: symbol, mergeAgent: Tardigrade): void {
        this._mergeAgent = mergeAgent;
    }

    protected silentImportProps(target: Tardigrade, override?: boolean): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
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

    protected silentSetProp<T>(name: string, newValue: T): void {
        if (!this.hasProp(name)) {
            this.incidentsHandler?.error(`Prop "${name}" wasn't registered. You have to add this prop first`);
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
            this.incidentsHandler?.error(`New value must have same type as initial value for prop "${name}"`);
            return;
        }

        if (prop.isValueScalar) {
            handler(name, newValue);
            return;
        }

        const isComplexDataJsonFriendly = this.isObjectJsonFriendly(newValue);

        if (!isComplexDataJsonFriendly) {
            this.incidentsHandler?.error("Complex data has to be json-friendly");
            return;
        }

        handler(name, newValue);
    }

    protected silentAddProp<T>(name: string, value: T): void {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
            return;
        }

        if (this.hasProp(name)) {
            this.incidentsHandler?.error("Prop can't be override, you have to remove prop first");
            return;
        }

        if (!isDef(value)) {
            this.incidentsHandler?.error("Value can't be nullable");
            return;
        }

        const type: string = typeOf(value) as TardigradeTypes;
        const isValueScalar: boolean = isScalar(value);

        if (isValueScalar) {
            this._props[name] = { name, value, type, isValueScalar } as Prop<T>;
            return;
        }

        const isComplexDataJsonFriendly = this.isObjectJsonFriendly(value);

        if (!isComplexDataJsonFriendly) {
            this.incidentsHandler?.error("Complex data has to be json-friendly");
            return;
        }

        this._props[name] = { name, value, type, isValueScalar } as Prop<T>;
    }

    protected importAllResolversListenerHandlers(target: Tardigrade, override?: boolean): void {
        const importedResolversHandlers = target.exportAllResolversListenerHandlers(this._sessionKey!);

        this._propListenerHandlers = override ? {
            ...this._resolverListenerHandlers,
            ...importedResolversHandlers,
        } : {
            ...importedResolversHandlers,
            ...this._resolverListenerHandlers,
        };
    }

    protected importAllPropsListenerHandlers(target: Tardigrade, override?: boolean): void {
        const importedHandlers = target.exportAllPropsListenerHandlers(this._sessionKey!);

        this._propListenerHandlers = override ? {
            ...this._propListenerHandlers,
            ...importedHandlers,
        } : {
            ...importedHandlers,
            ...this._propListenerHandlers,
        };
    }

    protected importAllListenersHandlers(target: Tardigrade, override?: boolean): void {
        const importedHandlers = target.exportAllListenersHandlers(this._sessionKey!) as Nullable<((value: Nullable<any>) => void)[]>;
        const merged = [
            ...this._listenerHandlers,
            ...importedHandlers!,
        ];

        this._listenerHandlers = override
            ? [...new Set(merged)]
            : merged;
    }

    protected isPropListened(name: string): boolean {
        return hasOwnProperty(this._propListenerHandlers, name);
    }

    protected handleOnCallResolver(updatedResolverName: string, value: any): void {
        for (const handler of this._listenerHandlers) {
            handler(updatedResolverName, value, this.props);
        }
    }

    protected handleOnSetProp(updatedProp: Prop<any>): void {
        if (this.isPropListened(updatedProp.name)) {
            for (const handler of this._propListenerHandlers[updatedProp.name]) {
                handler(updatedProp.value);
            }
        }

        for (const handler of this._listenerHandlers) {
            handler(updatedProp.name, updatedProp.value, this.props);
        }
    }

    protected isObjectJsonFriendly(object: any): boolean {
        try {
            JSON.stringify(object);
            return true;
        } catch (error) {
            return false;
        }
    }

    protected cloneComplexData<T>(complexData: T): any {
        return JSON.parse(JSON.stringify(complexData));
    }

    public get mergeAgent(): Nullable<Tardigrade> {
        return this._mergeAgent;
    }

    public get isAlive(): boolean {
        return this._alive;
    }

    public get props(): Dictionary {
        if (!this._alive) {
            this.incidentsHandler?.error("This store doesn't support anymore");
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

    protected get incidentsHandler(): Nullable<TardigradeIncidentsHandler> {
        return this._incidentsHandler;
    }
}