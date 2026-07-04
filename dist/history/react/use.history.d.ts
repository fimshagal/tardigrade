import { Dictionary, Tardigrade } from "tardigrade-store";
import { HistoryLink, HistoryOptions } from "tardigrade-store/history";
export declare const useHistory: <S extends Dictionary = Dictionary>(store: Tardigrade<S>, options?: HistoryOptions) => HistoryLink<S>;
