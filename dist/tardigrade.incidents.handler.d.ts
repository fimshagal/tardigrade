import { ITardigradeIncidentsHandler } from "./lib";
export declare class TardigradeIncidentsHandler implements ITardigradeIncidentsHandler {
    private _header;
    private _emitErrors;
    warn(message?: string): void;
    error(message?: string): void;
    set emitErrors(value: boolean);
}
