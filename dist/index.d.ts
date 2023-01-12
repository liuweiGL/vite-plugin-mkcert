import { type PluginOption } from 'vite';
import { MkcertBaseOptions } from './mkcert';
export { BaseSource, type SourceInfo } from './mkcert/source';
export type MkcertPluginOptions = MkcertBaseOptions & {
    /**
     * The hosts that needs to generate the certificate.
     */
    hosts?: string[];
};
declare const plugin: (options?: MkcertPluginOptions) => PluginOption;
export default plugin;
