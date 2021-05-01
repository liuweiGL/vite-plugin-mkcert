# [中文文档](README-zh_CN.md)

# vite-plugin-certificate

Provide certificate support for vite https development services.

## Quick start

1. Installation dependencies

```sh
yarn add vite-plugin-certificate -D
```

2. Configure vite

```ts
import {defineConfig} from'vite'
import VitePluginCertificate from'vite-plugin-certificate'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true
  },
  plugins: [VitePluginCertificate()]
})
```

## Parameters

### autoUpgrade

Whether to automatically upgrade `mkcert`.

### source

Specify the download source of `mkcert`, domestic users can set it to `coding` to download from the coding.net mirror, or provide a custom [BaseSource](packages/plugin/src/mkcert/Source.ts).

### mkcertPath

If the network is restricted, you can specify a local `mkcert` file instead of downloading from the network.

## Display the debugging information of the plug-in

Set the environment variable `DEBUG`=`vite:plugin:certificate`

## Principle

Use [mkcert](https://github.com/FiloSottile/mkcert) to install the local `CA` certificate and generate it for [server.https](https://vitejs.bootcss.com/config/#server-https) Server certificate.

## Other

1. `mkcert` save directory: [PLUGIN_DATA_DIR](packages/plugin/src/lib/constant.ts)
2. Uninstall the `CA` certificate: `mkcert uninstall`