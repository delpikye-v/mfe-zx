export type IntentResolution = {
    mfe: string;
    url: string;
    global: string;
    target: () => HTMLElement;
    isolate?: boolean;
    forceReload?: boolean;
};
export type IntentHandler<P = any, R = any> = (payload: P) => R | Promise<R>;
/**
 * IntentMap:
 * - key   : intent name
 * - value : handler signature
 */
export type IntentMap = Record<string, IntentHandler<any, any>>;
/**
 * Helper type: infer payload of an intent
 */
export type IntentPayload<M extends IntentMap, K extends keyof M> = Parameters<M[K]>[0];
/**
 * Helper type: infer result of an intent
 */
export type IntentResult<M extends IntentMap, K extends keyof M> = ReturnType<M[K]>;
