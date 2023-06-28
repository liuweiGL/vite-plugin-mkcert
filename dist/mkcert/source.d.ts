export type SourceInfo = {
    version: string;
    downloadUrl: string;
};
export declare abstract class BaseSource {
    abstract getSourceInfo(): Promise<SourceInfo | undefined>;
    protected getPlatformIdentifier(): string;
}
/**
 * Download mkcert from github.com
 */
export declare class GithubSource extends BaseSource {
    static create(): GithubSource;
    private constructor();
    getSourceInfo(): Promise<SourceInfo | undefined>;
}
/**
 * Download mkcert from coding.net
 *
 * @see https://help.coding.net/openapi
 */
export declare class CodingSource extends BaseSource {
    static CODING_API: string;
    static CODING_AUTHORIZATION: string;
    static CODING_PROJECT_ID: number;
    static REPOSITORY: string;
    static create(): CodingSource;
    private constructor();
    private request;
    /**
     * Get filename of Coding.net artifacts
     *
     * @see https://liuweigl.coding.net/p/github/artifacts/885241/generic/packages
     *
     * @returns name
     */
    private getPackageName;
    getSourceInfo(): Promise<SourceInfo | undefined>;
}
