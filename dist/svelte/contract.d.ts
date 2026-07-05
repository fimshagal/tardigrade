export type TardigradeSubscriber<T> = (value: T) => void;
export type TardigradeUnsubscriber = () => void;
export interface TardigradeReadable<T> {
    subscribe(run: TardigradeSubscriber<T>): TardigradeUnsubscriber;
}
export interface TardigradeWritable<T> extends TardigradeReadable<T> {
    set(value: T): void;
    update(updater: (value: T) => T): void;
}
