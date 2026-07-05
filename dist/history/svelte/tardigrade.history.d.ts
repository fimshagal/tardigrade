import { Dictionary, Tardigrade } from "tardigrade-store";
import { HistoryLink, HistoryOptions } from "tardigrade-store/history";
import type { TardigradeReadable } from "../../svelte/contract";
export interface TardigradeHistory<S extends Dictionary = Dictionary> extends Omit<HistoryLink<S>, "canUndo" | "canRedo"> {
    /** Svelte-readable: subscribe or use $-syntax in components */
    readonly canUndo: TardigradeReadable<boolean>;
    /** Svelte-readable: subscribe or use $-syntax in components */
    readonly canRedo: TardigradeReadable<boolean>;
}
export declare const tardigradeHistory: <S extends Dictionary = Dictionary>(store: Tardigrade<S>, options?: HistoryOptions) => TardigradeHistory<S>;
