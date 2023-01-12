export type RecordMate = {
    /**
     * The hosts that have generated certificate
     */
    hosts: string[];
    /**
     * file hash
     */
    hash?: RecordHash;
};
export type RecordHash = {
    key?: string;
    cert?: string;
};
export type ConfigOptions = {
    savePath: string;
};
declare class Config {
    /**
     * The mkcert version
     */
    private version;
    private record;
    private configFilePath;
    constructor({ savePath }: ConfigOptions);
    init(): Promise<void>;
    private serialize;
    merge(obj: Record<string, any>): Promise<void>;
    getRecord(): RecordMate;
    getVersion(): string;
}
export default Config;
