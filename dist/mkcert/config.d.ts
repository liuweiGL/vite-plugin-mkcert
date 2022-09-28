export declare type RecordMate = {
    /**
     * The hosts that have generated certificate
     */
    hosts: string[];
    /**
     * file hash
     */
    hash?: RecordHash;
};
export declare type RecordHash = {
    key?: string;
    cert?: string;
};
declare class Config {
    /**
     * The mkcert version
     */
    private version;
    private record;
    init(): Promise<void>;
    private serialize;
    merge(obj: Record<string, any>): Promise<void>;
    getRecord(): RecordMate;
    getVersion(): string;
}
export default Config;
