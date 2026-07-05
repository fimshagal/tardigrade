import { Dictionary, Tardigrade, WardContext } from "tardigrade-store";
import { WardKind, WardPropRuleFn, WardRuleFn } from "./run.rules";
export interface WardOptions {
    /** Called on every denied write, in addition to the store incidents handler */
    onDeny?: (context: WardContext, reason?: string) => void;
}
export interface WardLink<S extends Dictionary = Dictionary> {
    readonly store: Tardigrade<S>;
    /**
     * addRule(fn) — global rule for all write kinds;
     * addRule("setProp" | "addProp" | "setProps", fn) — kind rule;
     * addRule(propName, fn) — prop rule, matches setProp and addProp with that name.
     * Kind names are reserved: a prop can't be named "setProp", "addProp" or "setProps"
     */
    addRule(rule: WardRuleFn): symbol;
    addRule(kind: WardKind, rule: WardRuleFn): symbol;
    addRule(propName: string, rule: WardPropRuleFn): symbol;
    /** Removes rule by id, no-op when id isn't found */
    removeRule(id: symbol): void;
    /** Removes all rules, the runner stays registered */
    clearRules(): void;
    /** Suspends all rules (bulk merge, persist restore etc.) */
    hold(): void;
    /** Resumes rules */
    unhold(): void;
    /** Removes rules and unregisters the runner; store writes pass freely afterwards */
    dispose(): void;
    readonly ruleCount: number;
    readonly isHeld: boolean;
    readonly isDisposed: boolean;
}
export declare const ward: <S extends Dictionary = Dictionary>(store: Tardigrade<S>, options?: WardOptions) => WardLink<S>;
