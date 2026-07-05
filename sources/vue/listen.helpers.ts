import { getCurrentScope, onScopeDispose } from "vue";
import { Tardigrade } from "tardigrade-store";

type BridgeListener = (updatedName: string | string[], updatedValue: any) => void;

// subscribes to the store and detaches when the component/effect scope is destroyed
export const listenStore = (store: Tardigrade<any>, handler: BridgeListener): void => {
    store.addListener(handler);

    if (!getCurrentScope()) {
        return;
    }

    onScopeDispose(() => {
        if (!store.isAlive) {
            return;
        }

        store.removeListener(handler);
    });
};
