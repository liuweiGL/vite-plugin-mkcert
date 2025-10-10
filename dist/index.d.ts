import { type PluginOption } from "vite";
import { type MkcertBaseOptions } from "./mkcert/index";
export { BaseSource, type SourceInfo } from "./mkcert/source";
export type MkcertPluginOptions = MkcertBaseOptions & {
    /**
     * The hosts that needs to generate the certificate.
     */
    hosts?: string[];
    /**
     * The apply condition for the plugin.
     */
    apply?: "serve" | "build";
};
declare const plugin: (options?: MkcertPluginOptions) => PluginOption;
export default plugin;
