import { WardContext, WardOutcome } from "tardigrade-store";

export type WardRuleResult =
    | { allow: true; value?: unknown }
    | { allow: false; reason?: string };

/** Global or kind rule: receives the full ward context */
export type WardRuleFn = (context: WardContext) => WardRuleResult | void;

/** Prop-bound shorthand rule: receives the value only */
export type WardPropRuleFn = (value: unknown) => WardRuleResult | void;

export type WardKind = "setProp" | "addProp" | "setProps";

export const WARD_KINDS: readonly WardKind[] = ["setProp", "addProp", "setProps"];

export type WardRuleScope = "global" | "kind" | "prop";

export interface WardRuleEntry {
    id: symbol;
    scope: WardRuleScope;
    kind?: WardKind;
    propName?: string;
    rule: WardRuleFn | WardPropRuleFn;
}

const matches = (entry: WardRuleEntry, context: WardContext): boolean => {
    if (entry.scope === "global") {
        return true;
    }

    if (entry.scope === "kind") {
        return entry.kind === context.kind;
    }

    // prop rules guard the value regardless of how it enters the store: setProp or addProp
    return (context.kind === "setProp" || context.kind === "addProp") && context.name === entry.propName;
};

export const runRules = (entries: WardRuleEntry[], context: WardContext): WardOutcome => {
    // execution order: global rules, then kind rules, then prop rules; insertion order within a group
    const ordered: WardRuleEntry[] = [
        ...entries.filter((entry) => entry.scope === "global"),
        ...entries.filter((entry) => entry.scope === "kind"),
        ...entries.filter((entry) => entry.scope === "prop"),
    ].filter((entry) => matches(entry, context));

    let currentContext: WardContext = context;
    let currentValue: unknown = context.kind === "setProps" ? undefined : context.value;
    let transformed = false;

    for (const entry of ordered) {
        let result: WardRuleResult | void;

        try {
            result = entry.scope === "prop"
                ? (entry.rule as WardPropRuleFn)(currentValue)
                : (entry.rule as WardRuleFn)(currentContext);
        } catch (error) {
            // fail closed: a throwing rule denies the write instead of silently passing it
            return { allow: false, reason: error instanceof Error ? error.message : String(error) };
        }

        if (!result) {
            continue;
        }

        if (!result.allow) {
            return { allow: false, reason: result.reason };
        }

        // transforms apply to single-value writes only; batch-level transform isn't supported
        if (result.value !== undefined && context.kind !== "setProps") {
            currentValue = result.value;
            transformed = true;
            currentContext = { ...currentContext, value: currentValue } as WardContext;
        }
    }

    return transformed ? { allow: true, value: currentValue } : { allow: true };
};
