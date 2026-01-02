import { MFEHost } from "../host/MFEHost";
export type DevRemoteConfig = {
    url: string;
    global: string;
    el: () => HTMLElement;
    isolate?: boolean;
    shadowMode?: ShadowRootMode;
};
export type MFEDefNotifyOptions = {
    name: string;
    version?: string;
    wsUrl?: string;
};
export declare function setupMFEDefNotify({ name, version, wsUrl, }: MFEDefNotifyOptions): void;
export declare function startMFEDevServer(onReload: (name: string) => void, port?: number): void;
export declare function createMFEReloadServer(host: MFEHost, remotes: Record<string, DevRemoteConfig>): () => void;
