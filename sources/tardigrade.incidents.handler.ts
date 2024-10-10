import { ITardigradeIncidentsHandler } from "./lib";

export class TardigradeIncidentsHandler implements ITardigradeIncidentsHandler {
    private _header: string = 'Tardigrade';
    private _emitErrors: boolean = false;

    public warn(message?: string): void {
        message = message || "Unknown warn";

        console.warn(message);
    }

    public error(message?: string): void {
        message = message || "Unknown error";

        if (this._emitErrors) {
            throw Error(`[${this._header}]: ${message}`);
        }

        console.error(message);
    }

    public set emitErrors(value: boolean) {
        this._emitErrors = value;
    }
}