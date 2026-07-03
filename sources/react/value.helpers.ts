const isComplex = (value: unknown): boolean => typeof value === "object" && value !== null;

// props are guaranteed json-friendly by the core, so json clone/compare is safe here
export const cloneValue = <T>(value: T): T => (isComplex(value) ? JSON.parse(JSON.stringify(value)) : value);

export const areValuesEqual = (a: unknown, b: unknown): boolean => {
    if (Object.is(a, b)) {
        return true;
    }

    if (!isComplex(a) || !isComplex(b)) {
        return false;
    }

    try {
        return JSON.stringify(a) === JSON.stringify(b);
    } catch (error) {
        return false;
    }
};
