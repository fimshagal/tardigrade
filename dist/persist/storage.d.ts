export interface PersistStorage {
    read(key: string): string | null;
    write(key: string, value: string): void;
    remove(key: string): void;
}
export declare const createInMemoryStorage: () => PersistStorage;
export declare const createLocalStorageAdapter: () => PersistStorage;
export declare const createDefaultStorage: () => PersistStorage;
