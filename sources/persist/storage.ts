export interface PersistStorage {
    read(key: string): string | null;
    write(key: string, value: string): void;
    remove(key: string): void;
}

export const createInMemoryStorage = (): PersistStorage => {
    const map = new Map<string, string>();

    return {
        read: (key: string): string | null => (map.has(key) ? map.get(key)! : null),
        write: (key: string, value: string): void => {
            map.set(key, value);
        },
        remove: (key: string): void => {
            map.delete(key);
        },
    };
};

export const createLocalStorageAdapter = (): PersistStorage => ({
    read: (key: string): string | null => localStorage.getItem(key),
    write: (key: string, value: string): void => localStorage.setItem(key, value),
    remove: (key: string): void => localStorage.removeItem(key),
});

export const createDefaultStorage = (): PersistStorage =>
    typeof localStorage !== "undefined" ? createLocalStorageAdapter() : createInMemoryStorage();
