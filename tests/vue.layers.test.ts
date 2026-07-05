import { describe, it, expect, vi } from "vitest";
import { computed, createApp, defineComponent, effectScope, h, nextTick } from "vue";
import { createTardigrade } from "../sources";
import { createInMemoryStorage } from "../sources/persist";
import { usePersistedTardigrade } from "../sources/persist/vue";
import { useHistory } from "../sources/history/vue";

const seed = (storage: ReturnType<typeof createInMemoryStorage>, key: string, data: object): void => {
    storage.write(key, JSON.stringify({ version: 1, data }));
};

describe("Tardigrade vue persist", () => {
    it("restores immediately outside of components and auto-saves", () => {
        vi.useFakeTimers();

        const storage = createInMemoryStorage();
        seed(storage, "app", { counter: 42 });

        const scope = effectScope();
        const link = scope.run(() => usePersistedTardigrade({ counter: 0 }, { key: "app", storage, saveAfter: 0 }))!;

        (expect as any)(link.store.prop("counter")).toBe(42);

        link.store.setProp("counter", 7);
        (expect as any)(JSON.parse(storage.read("app")!)).toEqual({ version: 1, data: { counter: 7 } });

        scope.stop();
        (expect as any)(link.isDisposed).toBe(true);

        vi.useRealTimers();
    });

    it("accepts an existing store", () => {
        const storage = createInMemoryStorage();
        seed(storage, "app", { counter: 9 });

        const store = createTardigrade({ counter: 0 });

        const scope = effectScope();
        const link = scope.run(() => usePersistedTardigrade(store, { key: "app", storage }))!;

        (expect as any)(link.store).toBe(store);
        (expect as any)(store.prop("counter")).toBe(9);

        scope.stop();
    });

    it("inside a component restore is deferred to mount", async () => {
        const storage = createInMemoryStorage();
        seed(storage, "app", { counter: 100 });

        let counterBeforeMount: unknown = null;
        let link: ReturnType<typeof usePersistedTardigrade> | null = null;

        const Comp = defineComponent({
            setup() {
                link = usePersistedTardigrade({ counter: 0 }, { key: "app", storage });
                counterBeforeMount = link.store.prop("counter");
                return () => h("span");
            },
        });

        const app = createApp(Comp);
        app.mount(document.createElement("div"));
        await nextTick();

        (expect as any)(counterBeforeMount).toBe(0); // setup: not restored yet (SSR-safe)
        (expect as any)(link!.store.prop("counter")).toBe(100); // after mount

        app.unmount();
        (expect as any)(link!.isDisposed).toBe(true);
    });
});

describe("Tardigrade vue history", () => {
    it("canUndo/canRedo are reactive", () => {
        const store = createTardigrade({ counter: 0 });

        const scope = effectScope();

        scope.run(() => {
            const timeline = useHistory(store);
            const undoable = computed(() => timeline.canUndo);
            const redoable = computed(() => timeline.canRedo);

            (expect as any)(undoable.value).toBe(false);

            store.setProp("counter", 1);
            (expect as any)(undoable.value).toBe(true);
            (expect as any)(redoable.value).toBe(false);

            timeline.undo();
            (expect as any)(store.prop("counter")).toBe(0);
            (expect as any)(undoable.value).toBe(false);
            (expect as any)(redoable.value).toBe(true);

            timeline.redo();
            (expect as any)(store.prop("counter")).toBe(1);
            (expect as any)(redoable.value).toBe(false);
        });

        scope.stop();
    });

    it("scope dispose detaches history", () => {
        const store = createTardigrade({ counter: 0 });

        const scope = effectScope();
        const timeline = scope.run(() => useHistory(store))!;

        scope.stop();
        (expect as any)(timeline.isDisposed).toBe(true);

        store.setProp("counter", 5);
        (expect as any)(timeline.canUndo).toBe(false); // nothing recorded after dispose
    });
});
