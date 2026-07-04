import { useEffect, useRef, useState } from "react";
import { Dictionary, Nullable, Tardigrade } from "tardigrade-store";
import { history, HistoryLink, HistoryOptions } from "tardigrade-store/history";

export const useHistory = <S extends Dictionary = Dictionary>(
    store: Tardigrade<S>,
    options?: HistoryOptions,
): HistoryLink<S> => {
    const storeRef = useRef<Tardigrade<S>>(store);
    storeRef.current = store;

    const optionsRef = useRef<HistoryOptions | undefined>(options);
    optionsRef.current = options;

    const linkRef = useRef<Nullable<HistoryLink<S>>>(null);

    const ensureLink = (): HistoryLink<S> => {
        const isStale = !linkRef.current
            || linkRef.current.isDisposed
            || linkRef.current.store !== storeRef.current;

        if (isStale) {
            linkRef.current?.dispose();
            linkRef.current = history(storeRef.current, optionsRef.current);
        }

        return linkRef.current!;
    };

    ensureLink();

    // canUndo/canRedo are read during render, so their flips must cause a re-render:
    // plain store updates are caught by the listener below, while manual link calls
    // (record/clear/unhold and undo/redo that only remove props) sync through the facade
    const [, setFlags] = useState<[boolean, boolean]>([false, false]);
    const flagsRef = useRef<[boolean, boolean]>([false, false]);

    const syncFlags = (): void => {
        const link = ensureLink();
        const next: [boolean, boolean] = [link.canUndo, link.canRedo];

        if (flagsRef.current[0] === next[0] && flagsRef.current[1] === next[1]) {
            return;
        }

        flagsRef.current = next;
        setFlags(next);
    };

    const facadeRef = useRef<Nullable<HistoryLink<S>>>(null);

    if (!facadeRef.current) {
        facadeRef.current = {
            get store(): Tardigrade<S> {
                return ensureLink().store;
            },
            undo: (): boolean => {
                const done = ensureLink().undo();
                syncFlags();
                return done;
            },
            redo: (): boolean => {
                const done = ensureLink().redo();
                syncFlags();
                return done;
            },
            record: (): void => {
                ensureLink().record();
                syncFlags();
            },
            hold: (): void => ensureLink().hold(),
            unhold: (): void => {
                ensureLink().unhold();
                syncFlags();
            },
            clear: (): void => {
                ensureLink().clear();
                syncFlags();
            },
            peek: (): Dictionary => ensureLink().peek(),
            peekUndo: (): Dictionary | null => ensureLink().peekUndo(),
            peekRedo: (): Dictionary | null => ensureLink().peekRedo(),
            dispose: (): void => linkRef.current?.dispose(),
            get canUndo(): boolean {
                return linkRef.current?.canUndo ?? false;
            },
            get canRedo(): boolean {
                return linkRef.current?.canRedo ?? false;
            },
            get isHeld(): boolean {
                return linkRef.current?.isHeld ?? false;
            },
            get isDisposed(): boolean {
                return linkRef.current?.isDisposed ?? true;
            },
        };
    }

    useEffect(() => {
        // re-attaches auto-record after react strict mode fake unmount
        const activeLink = ensureLink();

        // auto-recorded steps (setProp outside of the facade) flip canUndo too
        const onStoreChange = (): void => syncFlags();

        syncFlags();
        store.addListener(onStoreChange);

        return () => {
            if (store.isAlive) {
                store.removeListener(onStoreChange);
            }

            activeLink.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store]);

    return facadeRef.current;
};
