import { Nullable, Tardigrade } from "tardigrade-store";
import { TardigradeReadable, TardigradeSubscriber, TardigradeUnsubscriber } from "./contract";

export interface TardigradeResolverStore<T> extends TardigradeReadable<Nullable<T>> {
    call(): Promise<void>;
}

export const tardigradeResolver = <T>(store: Tardigrade<any>, name: string): TardigradeResolverStore<T> => {
    const subscribe = (run: TardigradeSubscriber<Nullable<T>>): TardigradeUnsubscriber => {
        // resolver value doesn't live in props, so the initial value is always null
        run(null);

        const handler = (updatedName: string | string[], updatedValue: Nullable<T>): void => {
            // batched prop updates arrive with string[] name and are ignored here
            if (updatedName !== name) {
                return;
            }

            run(updatedValue);
        };

        store.addListener(handler);

        return () => {
            if (!store.isAlive) {
                return;
            }

            store.removeListener(handler);
        };
    };

    return {
        subscribe,
        call: (): Promise<void> => store.callResolver(name),
    };
};
