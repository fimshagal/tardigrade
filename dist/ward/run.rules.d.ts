import { WardContext, WardOutcome } from "tardigrade-store";
export type WardRuleResult = {
    allow: true;
    value?: unknown;
} | {
    allow: false;
    reason?: string;
};
/** Global or kind rule: receives the full ward context */
export type WardRuleFn = (context: WardContext) => WardRuleResult | void;
/** Prop-bound shorthand rule: receives the value only */
export type WardPropRuleFn = (value: unknown) => WardRuleResult | void;
export type WardKind = "setProp" | "addProp" | "setProps";
export declare const WARD_KINDS: readonly WardKind[];
export type WardRuleScope = "global" | "kind" | "prop";
export interface WardRuleEntry {
    id: symbol;
    scope: WardRuleScope;
    kind?: WardKind;
    propName?: string;
    rule: WardRuleFn | WardPropRuleFn;
}
export declare const runRules: (entries: WardRuleEntry[], context: WardContext) => WardOutcome;
