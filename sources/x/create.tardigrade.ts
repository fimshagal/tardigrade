import { Tardigrade } from "../tardigrade";
import { genSessionKey } from "./gen.session.key";
import { Dictionary, TardigradeInitialOptions, TardigradeTypes } from "../lib";
import { typeOf } from "../type.of";

const sessionKey: symbol = genSessionKey();

/// processing-version <<
console.log('Tardigrade v1.1.23');
/// processing-version >>

export const createTardigrade = (initialData?: Dictionary, initialOptions?: TardigradeInitialOptions): Tardigrade => {
    initialOptions = initialOptions || {};

    const instance: Tardigrade = new Tardigrade(sessionKey, initialOptions);

    if (!initialData) {
        return instance;
    }

    Object
        .entries(initialData)
        .forEach(([name, value]): void => {
            const type: TardigradeTypes = typeOf(value) as TardigradeTypes;

            switch (type) {
                case TardigradeTypes.Function:
                case TardigradeTypes.AsyncFunction:
                    instance.addResolver(name, value);
                    break;
                case TardigradeTypes.Number:
                case TardigradeTypes.String:
                case TardigradeTypes.Boolean:
                case TardigradeTypes.Array:
                case TardigradeTypes.Object:
                    instance.addProp(name, value);
                    break;
                case TardigradeTypes.Null:
                case TardigradeTypes.Undefined:
                default:
                    console.warn(`Tardigrade: data item "${name}" has incorrect type`);
                    break;
            }
        });

    return instance;
};