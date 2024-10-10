import { randomUUID } from "../utils";

export const genSessionKey = (): symbol => {
    return Symbol(randomUUID());
};