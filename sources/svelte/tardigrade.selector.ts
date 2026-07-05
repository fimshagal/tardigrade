import { Dictionary, Tardigrade } from "tardigrade-store";
import { areValuesEqual } from "../bridge/value.helpers";
import { TardigradeReadable, TardigradeSubscriber, TardigradeUnsubscriber } from "./contract";

export type TardigradeSelector<T> = (props: Dictionary) => T;

export type TardigradeEqualityFn<T> = (a: T, b: T) => boolean;

export const tardigradeSelector = <T>(
    store: Tardigrade<any>,
    selector: TardigradeSelector<T>,
    isEqual: TardigradeEqualityFn<T> = areValuesEqual,
): TardigradeReadable<T> => {
    const subscribe = (run: TardigradeSubscriber<T>): TardigradeUnsubscriber => {
        let current = selector(store.props);

        run(current);

        const handler = (): void => {
            if (!store.isAlive) {
                return;
            }

            const next = selector(store.props);

            // invalidate only when the selector result really changed
            if (!isEqual(current, next)) {
                current = next;
                run(next);
            }
        };

        store.addListener(handler);

        return () => {
            if (!store.isAlive) {
                return;
            }

            store.removeListener(handler);
        };
    };

    return { subscribe };
};
