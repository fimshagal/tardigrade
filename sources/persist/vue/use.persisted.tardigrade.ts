import { getCurrentInstance, getCurrentScope, onMounted, onScopeDispose } from "vue";
import { createTardigrade, Dictionary, Tardigrade, TardigradeInitialOptions } from "tardigrade-store";
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
    // setup() runs once per component instance, so plain creation is already component-scoped
    const store = storeOrInitialData instanceof Tardigrade
        ? storeOrInitialData
        : createTardigrade<S>(storeOrInitialData, initialOptions);

    const link = persist(store, { ...persistOptions, restoreOnStart: false });

    const shouldRestore = persistOptions.restoreOnStart !== false;

    if (getCurrentInstance()) {
        // inside a component restore is deferred to mount: it runs on the client only (SSR-safe)
        onMounted(() => {
            if (shouldRestore) {
                link.restore();
            }
        });
    } else if (shouldRestore) {
        // plain effectScope or tests: no mount phase, restore right away
        link.restore();
    }

    if (getCurrentScope()) {
        onScopeDispose(() => link.dispose());
    }

    return link;
}
