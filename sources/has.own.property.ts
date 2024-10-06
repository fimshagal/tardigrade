export const hasOwnProperty = (targetObject: any, propertyName: string): boolean => {
    return Object.prototype.hasOwnProperty.call(targetObject, propertyName);
};