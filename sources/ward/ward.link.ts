import { Dictionary, Tardigrade, WardContext, WardOutcome } from "tardigrade-store";
import { runRules, WARD_KINDS, WardKind, WardPropRuleFn, WardRuleEntry, WardRuleFn } from "./run.rules";

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

export const ward = <S extends Dictionary = Dictionary>(store: Tardigrade<S>, options?: WardOptions): WardLink<S> => {
    const { onDeny } = options ?? {};

    const rules: WardRuleEntry[] = [];

    let held = false;
    let disposed = false;

    const runner = (context: WardContext): WardOutcome | void => {
        if (held || !rules.length) {
            return;
        }

        const outcome = runRules(rules, context);

        if (!outcome.allow) {
            onDeny?.(context, outcome.reason);
        }

        return outcome;
    };

    // core allows a single runner per store: second ward() throws until the previous link is disposed
    const unregister = store.registerWardRunner(runner);

    const addRule = (target: WardRuleFn | WardKind | string, maybeRule?: WardRuleFn | WardPropRuleFn): symbol => {
        if (disposed) {
            throw Error("Tardigrade ward: link is disposed, create a new one with ward(store)");
        }

        const id = Symbol("tardigrade-ward-rule");

        if (typeof target === "function") {
            rules.push({ id, scope: "global", rule: target });
            return id;
        }

        if ((WARD_KINDS as readonly string[]).includes(target)) {
            rules.push({ id, scope: "kind", kind: target as WardKind, rule: maybeRule! });
            return id;
        }

        rules.push({ id, scope: "prop", propName: target, rule: maybeRule! });
        return id;
    };

    return {
        store,
        addRule,
        removeRule: (id: symbol): void => {
            const index = rules.findIndex((entry) => entry.id === id);

            if (index !== -1) {
                rules.splice(index, 1);
            }
        },
        clearRules: (): void => {
            rules.length = 0;
        },
        hold: (): void => {
            held = true;
        },
        unhold: (): void => {
            held = false;
        },
        dispose: (): void => {
            if (disposed) {
                return;
            }

            disposed = true;
            rules.length = 0;
            unregister();
        },
        get ruleCount(): number {
            return rules.length;
        },
        get isHeld(): boolean {
            return held;
        },
        get isDisposed(): boolean {
            return disposed;
        },
    };
};
