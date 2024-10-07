import { Tardigrade } from "../tardigrade";
import { genSessionKey } from "./gen.session.key";

const sessionKey = genSessionKey();

export const createTardigrade = (): Tardigrade => {
    return new Tardigrade(sessionKey);
};