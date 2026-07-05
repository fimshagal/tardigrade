import { Dictionary, Tardigrade } from "tardigrade-store";
import { areValuesEqual } from "../bridge/value.helpers";
import { TardigradeReadable, TardigradeSubscriber, TardigradeUnsubscriber } from "./contract";

export const tardigradeProps = (store: Tardigrade<any>): TardigradeReadable<Dictionary> => {
    const read = (): Dictionary => (store.isAlive ? store.props : {});

    const subscribe = (run: TardigradeSubscriber<Dictionary>): TardigradeUnsubscriber => {
        let current = read();

        run(current);

        const handler = (): void => {
            const fresh = read();

            if (!areValuesEqual(current, fresh)) {
                current = fresh;
                run(fresh);
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
