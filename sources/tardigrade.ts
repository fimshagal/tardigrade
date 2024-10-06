import { Dictionary, ITardigrade, Nullable, Prop } from "./lib";
import { typeOf, isDef, isScalar } from "./type.of";
import { hasOwnProperty } from "./has.own.property";

export class Tardigrade implements ITardigrade {
    private _props: Dictionary<Prop<any>> = {};
    private _propListenerHandlers: Dictionary = {};
    private _listenerHandlers: ((...args) => void)[] = [];

    public addProp<T>(name: string, value: T): void {
        if (hasOwnProperty(this._props, name)) {
            console.error("Tardigrade: prop can't be override, you have to remove prop first");
            return;
        }

        if (!isDef(value)) {
            console.error("Tardigrade: value can't be nullable");
            return;
        }

        const type: string = typeOf(value);
        const isValueScalar: boolean = isScalar(value);
        const prop: Prop<any> = { name, value, type, isValueScalar };

        this._props[name] = prop;

        this.handleOnSetProp(prop);
    }

    public removeProp(name: string): void {
        if (!hasOwnProperty(this._props, name)) {
            console.error("Tardigrade: prop can't be deleted, you have to remove prop first");
            return;
        }

        this.removeAllPropListeners(name);
        delete this._props[name];
    }

    public setProp<T>(name: string, newValue: T): void {
        if (!hasOwnProperty(this._props, name)) {
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

        handler(name, newValue);
    }

    public addPropListener(name: string, handler: (value: Nullable<any>) => void): void {
        if (!hasOwnProperty(this._props, name)) {
            console.error(`Tardigrade: prop "${name}" wasn't registered. You have to add this prop first`);
            return;
        }

        if (!this.isPropListened(name)) {
            this._propListenerHandlers[name] = [];
        }

        this._propListenerHandlers[name].push(handler);
    }

    public removePropListener(name: string, handler: (value: Nullable<any>) => void): void {
        if (!this.isPropListened(name)) {
            console.error(`Tardigrade: prop "${name}" doesn't have any listeners`);
            return;
        }

        this._propListenerHandlers[name] = this._propListenerHandlers[name]
            .filter((existedHandler) => existedHandler !== handler);
    }

    public removeAllPropListeners(name: string): void {
        if (!this.isPropListened(name)) {
            console.warn(`Tardigrade: prop "${name}" doesn't have any listeners`);
            return;
        }

        delete this._propListenerHandlers[name];
    }

    public prop(name: string): Nullable<any> {
        if (!hasOwnProperty(this._props, name)) {
            console.error(`Tardigrade: prop "${name}" wasn't registered. You have to add this prop first`);
            return null;
        }

        return this._props[name].value;
    }

    public addListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void {
        this._listenerHandlers.push(handler);
    }

    public removeListener(handler: (name: string, value: Nullable<any>, props: Dictionary<Prop<any>>) => void): void {
        this._listenerHandlers = this._listenerHandlers
            .filter((existedHandler): boolean => existedHandler !== handler);
    }

    public removeAllListeners(): void {
        this._listenerHandlers = [];
    }

    private isPropListened(name: string): boolean {
        return hasOwnProperty(this._propListenerHandlers, name);
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

    public get props(): Dictionary {
        const response: Dictionary = {};

        Object
            .entries(this._props)
            .forEach(([propName, prop]): void => {
                response[propName] = JSON.parse(JSON.stringify(prop.value));
            });

        return response;
    }
}