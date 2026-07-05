// svelte store contract implemented by hand: works with $-auto-subscription
// in svelte 3/4/5 without importing anything from the svelte package

export type TardigradeSubscriber<T> = (value: T) => void;

export type TardigradeUnsubscriber = () => void;

export interface TardigradeReadable<T> {
    subscribe(run: TardigradeSubscriber<T>): TardigradeUnsubscriber;
}

export interface TardigradeWritable<T> extends TardigradeReadable<T> {
    set(value: T): void;
    update(updater: (value: T) => T): void;
}
