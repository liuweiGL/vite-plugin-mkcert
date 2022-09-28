import { ExecOptions } from 'child_process';
/**
 * Check if file exists
 *
 * @param filePath file path
 * @returns does the file exist
 */
export declare const exists: (filePath: string) => Promise<boolean>;
/**
 * Resolve file path with `PLUGIN_DATA_DIR`
 *
 * @param fileName file name
 * @returns absolute path
 */
export declare const resolvePath: (fileName: string) => string;
export declare const mkdir: (dirname: string) => Promise<void>;
export declare const ensureDirExist: (filePath: string) => Promise<void>;
export declare const readFile: (filePath: string) => Promise<string>;
export declare const writeFile: (filePath: string, data: string | Uint8Array) => Promise<void>;
export declare const exec: (cmd: string, options?: ExecOptions) => Promise<{
    stdout: string;
    stderr: string;
}>;
export declare const getLocalV4Ips: () => string[];
export declare const getDefaultHosts: () => string[];
export declare const getHash: (filePath: string) => Promise<string>;
export declare const deepMerge: (target: any, ...source: any[]) => any;
export declare const prettyLog: (obj?: Record<string, any>) => string;
export declare const escape: (path?: string) => string;
