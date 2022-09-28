/// <reference types="node" />
import { Logger } from 'vite';
import { BaseSource } from './source';
export declare type SourceType = 'github' | 'coding' | BaseSource;
export declare type MkcertOptions = {
    /**
     * Whether to force generate
     */
    force?: boolean;
    /**
     * Automatically upgrade mkcert
     *
     * @default false
     */
    autoUpgrade?: boolean;
    /**
     * Specify mkcert download source
     *
     * @default github
     */
    source?: SourceType;
    /**
     * If your network is restricted, you can specify a local binary file instead of downloading
     *
     * @description it should be absolute path
     * @default none
     */
    mkcertPath?: string;
};
export declare type MkcertProps = MkcertOptions & {
    logger: Logger;
};
declare class Mkcert {
    private force?;
    private autoUpgrade?;
    private mkcertLocalPath?;
    private source;
    private logger;
    private mkcertSavedPath;
    private sourceType;
    private config;
    static create(options: MkcertProps): Mkcert;
    private constructor();
    private getMkcertBinnary;
    /**
     * Check if mkcert exists
     */
    private checkMkcert;
    private getCertificate;
    private createCertificate;
    private getLatestHash;
    private regenerate;
    init(): Promise<void>;
    private getSourceInfo;
    private initMkcert;
    private upgradeMkcert;
    private downloadMkcert;
    renew(hosts: string[]): Promise<void>;
    /**
     * Get certificates
     *
     * @param hosts host collection
     * @returns cretificates
     */
    install(hosts: string[]): Promise<{
        key: Buffer;
        cert: Buffer;
    }>;
}
export default Mkcert;
