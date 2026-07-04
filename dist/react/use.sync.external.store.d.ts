export type StoreSubscribe = (onStoreChange: () => void) => () => void;
export declare const useSyncExternalStoreCompat: <T>(subscribe: StoreSubscribe, getSnapshot: () => T, getServerSnapshot?: () => T) => T;
