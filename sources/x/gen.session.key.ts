export const genSessionKey = (): symbol => {
    return Symbol(crypto.randomUUID());
};