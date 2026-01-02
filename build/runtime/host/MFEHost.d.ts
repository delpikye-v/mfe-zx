import { EventBus } from "../event-bus/EventBus";
import type { RemoteApp } from "../types/RemoteApp";
interface MountOptions {
    name: string;
    url: string;
    global: string;
    el: HTMLElement;
    isolate?: boolean;
    shadowMode?: ShadowRootMode;
    traceId?: string;
    timeout?: number;
    retries?: number;
}
interface LoadMountOptions extends MountOptions {
    forceReload?: boolean;
}
export declare class MFEHost<S extends Record<string, any> = any> {
    private eventBus;
    private stores;
    private navigate?;
    private fallback?;
    private isolate;
    private defaultTimeout;
    private defaultRetries;
    private cache;
    private mountMap;
    constructor(options?: {
        stores?: S;
        navigate?: (path: string) => void;
        fallback?: MFEHost<S>["fallback"];
        eventBus?: EventBus;
        isolate?: boolean;
        defaultTimeout?: number;
        defaultRetries?: number;
    });
    load(url: string, global: string, timeout?: number, retries?: number): Promise<RemoteApp>;
    private mountInternal;
    /** Mount remote with optional Shadow DOM isolation */
    mount(remote: RemoteApp, el: HTMLElement, name: string, options?: {
        isolate?: boolean;
        shadowMode?: ShadowRootMode;
        traceId?: string;
    }): Promise<RemoteApp<any>>;
    reload(options: MountOptions): Promise<RemoteApp<any>>;
    unmount(remote: RemoteApp, el: HTMLElement, name?: string): void;
    loadAndMount(options: LoadMountOptions): Promise<RemoteApp<any>>;
    private renderFallback;
    getEventBus(): EventBus<any>;
}
export {};
