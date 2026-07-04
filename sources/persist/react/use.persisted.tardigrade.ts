import { useEffect, useRef } from "react";
import { createTardigrade, Dictionary, Nullable, Tardigrade, TardigradeInitialOptions } from "tardigrade-store";
import { persist, PersistLink, PersistOptions } from "tardigrade-store/persist";

export function usePersistedTardigrade<S extends Dictionary = Dictionary>(
    store: Tardigrade<S>,
    persistOptions: PersistOptions,
): PersistLink<S>;

export function usePersistedTardigrade<S extends Dictionary = Dictionary>(
    initialData: S | undefined,
    persistOptions: PersistOptions,
    initialOptions?: TardigradeInitialOptions,
): PersistLink<S>;

export function usePersistedTardigrade<S extends Dictionary = Dictionary>(
    storeOrInitialData: Tardigrade<S> | S | undefined,
    persistOptions: PersistOptions,
    initialOptions?: TardigradeInitialOptions,
): PersistLink<S> {
    const storeRef = useRef<Nullable<Tardigrade<S>>>(null);

    if (!storeRef.current) {
        storeRef.current = storeOrInitialData instanceof Tardigrade
            ? storeOrInitialData
            : createTardigrade<S>(storeOrInitialData, initialOptions);
    }

    const linkRef = useRef<Nullable<PersistLink<S>>>(null);

    const ensureLink = (): PersistLink<S> => {
        if (!linkRef.current || linkRef.current.isDisposed) {
            // restore is deferred to the client-side effect below (SSR safety)
            linkRef.current = persist(storeRef.current!, { ...persistOptions, restoreOnStart: false });
        }

        return linkRef.current;
    };

    const link = ensureLink();

    useEffect(() => {
        // re-attaches auto-save after react strict mode fake unmount
        const activeLink = ensureLink();

        if (persistOptions.restoreOnStart !== false) {
            activeLink.restore();
        }

        return () => activeLink.dispose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return link;
}
