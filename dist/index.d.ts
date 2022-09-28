import { type PluginOption } from 'vite';
import { MkcertOptions } from './mkcert';
export { BaseSource, type SourceInfo } from './mkcert/source';
export declare type ViteCertificateOptions = MkcertOptions & {
    /**
     * The hosts that needs to generate the certificate.
     */
    hosts?: string[];
};
declare const plugin: (options?: ViteCertificateOptions) => PluginOption;
export default plugin;
