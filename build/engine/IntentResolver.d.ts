import { MFEHost } from "../runtime/host/MFEHost";
import type { IntentResolution } from "./intentTypes";
type IntentEngine = {
    on: (intent: string, handler: (payload?: any) => void | Promise<void>) => void;
};
export declare class IntentResolver {
    private intentEngine;
    private host;
    private map;
    constructor(intentEngine: IntentEngine, host: MFEHost, map: Record<string, IntentResolution | IntentResolution[]>);
    bind(): void;
}
export declare function createIntentResolver(intentEngine: IntentEngine, host: MFEHost, intentMap: Record<string, IntentResolution | IntentResolution[]>): IntentResolver;
export {};
