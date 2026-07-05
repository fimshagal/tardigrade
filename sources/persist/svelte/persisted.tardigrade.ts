import { createTardigrade, Dictionary, Tardigrade, TardigradeInitialOptions } from "tardigrade-store";
import { persist, PersistLink, PersistOptions } from "tardigrade-store/persist";

export function persistedTardigrade<S extends Dictionary = Dictionary>(
    store: Tardigrade<S>,
    persistOptions: PersistOptions,
): PersistLink<S>;

export function persistedTardigrade<S extends Dictionary = Dictionary>(
    initialData: S | undefined,
    persistOptions: PersistOptions,
    initialOptions?: TardigradeInitialOptions,
): PersistLink<S>;

/**
 * Creates (or accepts) a store and wires persist in one call.
 * Restore happens synchronously: the component script runs before the first render,
 * and on the server the default storage is an empty in-memory map, so it's a no-op there
 */
export function persistedTardigrade<S extends Dictionary = Dictionary>(
    storeOrInitialData: Tardigrade<S> | S | undefined,
    persistOptions: PersistOptions,
    initialOptions?: TardigradeInitialOptions,
): PersistLink<S> {
    const store = storeOrInitialData instanceof Tardigrade
        ? storeOrInitialData
        : createTardigrade<S>(storeOrInitialData, initialOptions);

    return persist(store, persistOptions);
}
