export const randomUUID = (): string => {
    if (typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char: string): string => {
        const random: number = Math.random() * 16 | 0;
        const value: number = char === "x" ? random : (random & 0x3 | 0x8);
        return value.toString(16);
    });
};