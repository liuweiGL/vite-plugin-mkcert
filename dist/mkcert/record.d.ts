import type Config from './config';
import type { RecordHash, RecordMate } from './config';
export type RecordProps = {
    config: Config;
};
declare class Record {
    private config;
    constructor(options: RecordProps);
    getHosts(): string[];
    getHash(): RecordHash;
    contains(hosts: string[]): boolean;
    equal(hash: RecordHash): boolean;
    update(record: RecordMate): Promise<void>;
}
export default Record;
