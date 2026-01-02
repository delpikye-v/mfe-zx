export type IntentHandler<T = any> = (payload?: T) => void | Promise<void>;
export type IntentEngine = {
    dispatch(intent: string, payload?: any): Promise<void>;
    on(intent: string, handler: IntentHandler): void;
};
export declare function createIntentEngine(): IntentEngine;
