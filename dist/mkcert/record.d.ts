import Config, { RecordHash, RecordMate } from './config';
export declare type RecordProps = {
    config: Config;
};
declare class Record {
    private config;
    constructor(options: RecordProps);
    getHosts(): string[];
    getHash(): RecordHash;
    contains(hosts: string[]): boolean;
    tamper(hash: RecordHash): boolean;
    update(record: RecordMate): Promise<void>;
}
export default Record;
