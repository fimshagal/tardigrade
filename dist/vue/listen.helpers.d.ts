import { Tardigrade } from "tardigrade-store";
type BridgeListener = (updatedName: string | string[], updatedValue: any) => void;
export declare const listenStore: (store: Tardigrade<any>, handler: BridgeListener) => void;
export {};
