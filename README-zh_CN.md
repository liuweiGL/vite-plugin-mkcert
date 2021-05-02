# vite-plugin-mkcert

使用 mkcert 为 vite https 开发服务提供证书支持。

## 什么时候应该使用该插件

1. 当你希望使用 `http/2` 解决 vite http dev server 请求的并发限制时，却发现浏览器缓存无效的情况 [#2725](https://github.com/vitejs/vite/issues/2725)。
2. 有强迫症，希望浏览器不要出现烦人的 https 证书错误。

## 效果

<details>
  <summary>查看</summary>
  
  ![localhost](assets/screenshot/localhost.png)

  ![127.0.0.1](assets/screenshot/127.0.0.1.png)

  ![localhost](assets/screenshot/localip.png)
</details>

## 快速开始

1. 安装依赖

```sh
yarn add vite-plugin-mkcert -D
```

2. 配置 vite

```ts
import { defineConfig } from 'vite'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true
  },
  plugins: [mkcert()]
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

设置环境变量 `DEBUG`=`vite:plugin:mkcert`

## 更新日志
[CHANGELOG](CHANGELOG.md)

## 原理

使用 [mkcert](https://github.com/FiloSottile/mkcert) 安装本地 `CA` 证书，并为 [server.https](https://vitejs.bootcss.com/config/#server-https) 生成服务端证书。

## 友情提示

1. `mkcert` 保存目录：[PLUGIN_DATA_DIR](packages/plugin/src/lib/constant.ts)
2. 卸载 `CA` 证书：`mkcert uninstall`

## 感谢

- [mkcert](https://github.com/FiloSottile/mkcert)
- [daquinoaldo/https-localhost](https://github.com/daquinoaldo/https-localhost)
