declare class Downloader {
    static create(): Downloader;
    private constructor();
    download(downloadUrl: string, savedPath: string): Promise<void>;
}
export default Downloader;
