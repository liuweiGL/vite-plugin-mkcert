# vite-plugin-certificate

为 vite https 开发服务提供证书支持。

## 快速开始

1. 安装依赖

```sh
yarn add vite-plugin-certificate -D
```

2. 配置 vite

```ts
import { defineConfig } from 'vite'
import VitePluginCertificate from 'vite-plugin-certificate'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true
  },
  plugins: [VitePluginCertificate()]
})
```

## 参数

### autoUpgrade

是否自动升级 `mkcert`。

### source

指定 `mkcert` 的下载源，国内用户可以设置成 `coding` 从 coding.net 镜像下载，也可以提供一个自定义的 [BaseSource](packages/plugin/src/mkcert/Source.ts)。

### mkcertPath

如果网络受限的话，可以指定一个本地的 `mkcert` 文件来代替网络下载。

## 显示插件的调试信息

设置环境变量 `DEBUG`=`vite:plugin:certificate`

## 原理

使用 [mkcert](https://github.com/FiloSottile/mkcert) 安装本地 `CA` 证书，并为 [server.https](https://vitejs.bootcss.com/config/#server-https) 生成服务端证书。

## 其他

1. `mkcert` 保存目录：[PLUGIN_DATA_DIR](packages/plugin/src/lib/constant.ts)
2. 卸载 `CA` 证书：`mkcert uninstall`
