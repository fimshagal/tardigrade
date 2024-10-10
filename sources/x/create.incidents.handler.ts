import { TardigradeIncidentsHandler } from "../tardigrade.incidents.handler";

export const createIncidentsHandler = (emitErrors?: boolean): TardigradeIncidentsHandler => {
    emitErrors = emitErrors || false;

    const instance: TardigradeIncidentsHandler = new TardigradeIncidentsHandler();

    instance.emitErrors = emitErrors;

    return instance;
};