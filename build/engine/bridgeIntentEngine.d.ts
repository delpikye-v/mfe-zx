type IntentEngine = {
    dispatch: (intent: string, payload?: any) => any;
};
export declare function bridgeIntentEngine(intentEngine: IntentEngine, eventBus: any): void;
export {};
