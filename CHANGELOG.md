## [1.17.9](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.17.8...v1.17.9) (2025-10-07)


### Bug Fixes

* another missing whitespace in README.md ([#109](https://github.com/liuweiGL/vite-plugin-mkcert/issues/109)) ([792d6c6](https://github.com/liuweiGL/vite-plugin-mkcert/commit/792d6c6c1f72799b86556040e50ec547b053ad5a))
* typo in README.md missing whitespace ([#108](https://github.com/liuweiGL/vite-plugin-mkcert/issues/108)) ([1ee1ef4](https://github.com/liuweiGL/vite-plugin-mkcert/commit/1ee1ef487f1a7a149901883a66237df52beae6ce))


### Performance Improvements

* upgrade dependencies version ([c727312](https://github.com/liuweiGL/vite-plugin-mkcert/commit/c727312af87af851b7b7ae6312d2fb985c5937da))

## [1.17.8](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.17.7...v1.17.8) (2025-03-14)


### Bug Fixes

* upgrade axios to fix security issue ([935a13a](https://github.com/liuweiGL/vite-plugin-mkcert/commit/935a13a6edb81375bd8b3151e919faff34171f3e)), closes [#106](https://github.com/liuweiGL/vite-plugin-mkcert/issues/106)

## [1.17.7](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.17.6...v1.17.7) (2025-02-28)


### Bug Fixes

*  Remove @octokit/rest to fix security vulnerability ([c1b4468](https://github.com/liuweiGL/vite-plugin-mkcert/commit/c1b446836a1489d14089a6b8ecb207e17a3d31f1)), closes [#105](https://github.com/liuweiGL/vite-plugin-mkcert/issues/105)

## [1.17.6](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.17.5...v1.17.6) (2024-08-15)


### Bug Fixes

* SSRF in axios ([696513f](https://github.com/liuweiGL/vite-plugin-mkcert/commit/696513ffd986b6b22c1dea6ba386b879879eb95b)), closes [#93](https://github.com/liuweiGL/vite-plugin-mkcert/issues/93)


### Performance Improvements

* update code style ([2ccce41](https://github.com/liuweiGL/vite-plugin-mkcert/commit/2ccce4174c781beb14aacbfbb1942e25691cd716))
* upgrade dependencies ([baa7dfd](https://github.com/liuweiGL/vite-plugin-mkcert/commit/baa7dfd7f63c38fa99888d50bcbde029ebe696f9))

## [1.17.5](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.17.4...v1.17.5) (2024-03-20)


### Bug Fixes

* axios library (1.6.5) has a vulnerability via the follow-redirects dependency ([45a7950](https://github.com/liuweiGL/vite-plugin-mkcert/commit/45a79502fa8b1c219f9636c285ee33ba0e26f429)), closes [#86](https://github.com/liuweiGL/vite-plugin-mkcert/issues/86)

## [1.17.4](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.17.3...v1.17.4) (2024-02-27)


### Bug Fixes

* the plugin reports mkcert not recognized as an internal or external command when  parentheses in the folder name ([02278c8](https://github.com/liuweiGL/vite-plugin-mkcert/commit/02278c870d5a15be41a540457d1e65c927e9f8a2)), closes [#83](https://github.com/liuweiGL/vite-plugin-mkcert/issues/83)

## [1.17.3](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.17.2...v1.17.3) (2024-01-18)


### Bug Fixes

* rollback required node version ([782ab10](https://github.com/liuweiGL/vite-plugin-mkcert/commit/782ab1036ced5c18808fbdb168ff1866c87dc6dc))

## [1.17.2](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.17.1...v1.17.2) (2024-01-09)


### Bug Fixes

* additional path escaping issue [#80](https://github.com/liuweiGL/vite-plugin-mkcert/issues/80) ([#81](https://github.com/liuweiGL/vite-plugin-mkcert/issues/81)) ([a3bbe6c](https://github.com/liuweiGL/vite-plugin-mkcert/commit/a3bbe6c5d210fd95259f947d88a0f8b6e3936d64))

## [1.17.1](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.17.0...v1.17.1) (2023-11-20)


### Bug Fixes

* typescript can't correct resolve .d.ts file ([363d66a](https://github.com/liuweiGL/vite-plugin-mkcert/commit/363d66a4d3c5723dff72cead1a331639a40d478e))

# [1.17.0](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.16.0...v1.17.0) (2023-11-20)


### Bug Fixes

* upgrade dependencies, fix vulnerability ([8c2c0b1](https://github.com/liuweiGL/vite-plugin-mkcert/commit/8c2c0b14e33d5aa65f53d1d437f8b835a5528c46)), closes [#76](https://github.com/liuweiGL/vite-plugin-mkcert/issues/76)


### Features

* Upgrade vite to 5.0 ([ac39d72](https://github.com/liuweiGL/vite-plugin-mkcert/commit/ac39d7286470ed01e9d6f912a67e0aa412bc2933))

# [1.16.0](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.15.0...v1.16.0) (2023-06-28)


### Features

* Support more platforms and architectures ([0cb9571](https://github.com/liuweiGL/vite-plugin-mkcert/commit/0cb9571734db5daafe281a8da81f9c427ff51935)), closes [#68](https://github.com/liuweiGL/vite-plugin-mkcert/issues/68)

# [1.15.0](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.14.1...v1.15.0) (2023-05-04)


### Features

* support MacOS with M2 chip ([#67](https://github.com/liuweiGL/vite-plugin-mkcert/issues/67)) ([aebfd07](https://github.com/liuweiGL/vite-plugin-mkcert/commit/aebfd07e34ee80821d342776785308f08eede3ab))

## [1.14.1](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.14.0...v1.14.1) (2023-04-26)


### Bug Fixes

* 修复node14不支持replaceAll导致报错的问题 ([#66](https://github.com/liuweiGL/vite-plugin-mkcert/issues/66)) ([6936de3](https://github.com/liuweiGL/vite-plugin-mkcert/commit/6936de3d2c7bbc5df8ae425d80a75187ea04ab06))

# [1.14.0](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.13.4...v1.14.0) (2023-03-30)


### Features

* 适配 v4.3.0 ([a117ed8](https://github.com/liuweiGL/vite-plugin-mkcert/commit/a117ed87e7e60d223ac0d9fb408c0b5e34134ba0))

## [1.13.4](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.13.3...v1.13.4) (2023-03-23)


### Bug Fixes

* typescript 5.0.2 can not resolve typings ([d070319](https://github.com/liuweiGL/vite-plugin-mkcert/commit/d070319b10991e1ab8d77c47016837a87d5c6972)), closes [#65](https://github.com/liuweiGL/vite-plugin-mkcert/issues/65)

## [1.13.3](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.13.2...v1.13.3) (2023-02-27)


### Bug Fixes

* Illegal operation in linux ([d299720](https://github.com/liuweiGL/vite-plugin-mkcert/commit/d299720b9245338770c70fa74428b1fc991d1a3c)), closes [#63](https://github.com/liuweiGL/vite-plugin-mkcert/issues/63)

## [1.13.2](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.13.1...v1.13.2) (2023-02-20)


### Bug Fixes

* mkcert initialization error ([b8e6e96](https://github.com/liuweiGL/vite-plugin-mkcert/commit/b8e6e965bb2de01eee482c52d013452171f4e9c7)), closes [#62](https://github.com/liuweiGL/vite-plugin-mkcert/issues/62)

## [1.13.1](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.13.0...v1.13.1) (2023-02-16)


### Bug Fixes

* not working if the mkcert in directory with special charaters ([e3a5b63](https://github.com/liuweiGL/vite-plugin-mkcert/commit/e3a5b63c57b9571445954b1d90cf5ed46cfd13ac)), closes [#61](https://github.com/liuweiGL/vite-plugin-mkcert/issues/61)

# [1.13.0](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.12.0...v1.13.0) (2023-02-04)


### Features

* retain the existing ca ([ee85a33](https://github.com/liuweiGL/vite-plugin-mkcert/commit/ee85a3367ee0dd55219c5c6f87865a3ec6a69a3d)), closes [#59](https://github.com/liuweiGL/vite-plugin-mkcert/issues/59)


### Performance Improvements

* pretty log formatter ([f75dfd1](https://github.com/liuweiGL/vite-plugin-mkcert/commit/f75dfd18e761ae521ba1d7537ed7ad3c7ef3a72d))

# [1.12.0](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.11.0...v1.12.0) (2023-01-31)


### Features

* save CA file to savePath ([6b29fe4](https://github.com/liuweiGL/vite-plugin-mkcert/commit/6b29fe476bca5630566d372ea712f76402f106e8)), closes [#58](https://github.com/liuweiGL/vite-plugin-mkcert/issues/58)

# [1.11.0](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.10.1...v1.11.0) (2023-01-12)


### Features

* add `savePath` `keyFileName`  `certFileName` parameters ([b12de07](https://github.com/liuweiGL/vite-plugin-mkcert/commit/b12de0786d88cab05836135f889add45d6e6b87f)), closes [#56](https://github.com/liuweiGL/vite-plugin-mkcert/issues/56)


### Performance Improvements

* upgrade all dependencies ([fd5a8c0](https://github.com/liuweiGL/vite-plugin-mkcert/commit/fd5a8c0fb6c65c6f2b3be1e804d5116fb7677444))

## [1.10.1](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.10.0...v1.10.1) (2022-09-28)


### Bug Fixes

* generated code include vite code ([e5adc6b](https://github.com/liuweiGL/vite-plugin-mkcert/commit/e5adc6b04c7397e94e2601dc0efb0d654a7cb035)), closes [#47](https://github.com/liuweiGL/vite-plugin-mkcert/issues/47)
* vite version range incorrect ([1486c44](https://github.com/liuweiGL/vite-plugin-mkcert/commit/1486c44b5882d20974facd2b362c286b44d57053))

# [1.10.0](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.9.0...v1.10.0) (2022-09-26)


### Bug Fixes

* Plugin‘s type definition is not generic ([1d031d1](https://github.com/liuweiGL/vite-plugin-mkcert/commit/1d031d11d560f1f96c3c347ca7dc1572e1882db1)), closes [#44](https://github.com/liuweiGL/vite-plugin-mkcert/issues/44)


### Features

* use peerDependence instead of dependence to control vite version ([542f15e](https://github.com/liuweiGL/vite-plugin-mkcert/commit/542f15eaf28d8ab474aa0f6093382ff209245420))

# [1.9.0](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.8.1...v1.9.0) (2022-07-19)


### Features

* export BasetSource-class ([#37](https://github.com/liuweiGL/vite-plugin-mkcert/issues/37)) ([3f25861](https://github.com/liuweiGL/vite-plugin-mkcert/commit/3f25861cd21806850990afdfe2fd142102865da2))

## [1.8.1](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.8.0...v1.8.1) (2022-07-14)


### Bug Fixes

* get warning from esbuild build ([7e4d968](https://github.com/liuweiGL/vite-plugin-mkcert/commit/7e4d96880dbb7a52ba28b0db26357379a441e904))

# [1.8.0](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.7.2...v1.8.0) (2022-07-14)


### Features

* 适配 vite3.0 ([960ff59](https://github.com/liuweiGL/vite-plugin-mkcert/commit/960ff59b7bf5fbf842b7ecda40f20cf9123556b9))

## [1.7.2](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.7.1...v1.7.2) (2022-06-12)


### Bug Fixes

* local path warning only if path isn't found ([#32](https://github.com/liuweiGL/vite-plugin-mkcert/issues/32)) ([ac7f533](https://github.com/liuweiGL/vite-plugin-mkcert/commit/ac7f533729e8eff70b65d914563111a5cf3c462a))

## [1.7.1](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.7.0...v1.7.1) (2022-06-07)


### Bug Fixes

* local hosts not include ips in node18 ([b710399](https://github.com/liuweiGL/vite-plugin-mkcert/commit/b710399ab8a9381b98dd6f89250ce31be856644e))

# [1.7.0](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.6.4...v1.7.0) (2022-06-07)


### Features

* always include local hosts ([6bab2ec](https://github.com/liuweiGL/vite-plugin-mkcert/commit/6bab2ec20c93344d00000784a8fdf74eab55bc2c))

## [1.6.4](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.6.3...v1.6.4) (2022-05-21)


### Bug Fixes

* fix built assets error ([12a2de4](https://github.com/liuweiGL/vite-plugin-mkcert/commit/12a2de4b29b45c1c0ef18568631d3483485c1d15))

## [1.6.3](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.6.2...v1.6.3) (2022-05-21)


### Bug Fixes

* fix npm package not includes built files ([da701ee](https://github.com/liuweiGL/vite-plugin-mkcert/commit/da701eeb3f53c062f56213b5e91709f7085c4235)), closes [#31](https://github.com/liuweiGL/vite-plugin-mkcert/issues/31)


### Reverts

* Revert "fix: fix npm package not includes built files" ([a5f04df](https://github.com/liuweiGL/vite-plugin-mkcert/commit/a5f04dfe3c428a9303446fefc7fa0af6d3e25baf))

## [1.6.2](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.6.1...v1.6.2) (2022-05-21)


### Bug Fixes

* fix npm package not includes built files ([379624b](https://github.com/liuweiGL/vite-plugin-mkcert/commit/379624b39035df91c7531291f24133b8608b62a7)), closes [#31](https://github.com/liuweiGL/vite-plugin-mkcert/issues/31)

## [1.6.1](https://github.com/liuweiGL/vite-plugin-mkcert/compare/v1.6.0...v1.6.1) (2022-05-20)


### Bug Fixes

* preview mode can use https ([#28](https://github.com/liuweiGL/vite-plugin-mkcert/issues/28)) ([048a8d1](https://github.com/liuweiGL/vite-plugin-mkcert/commit/048a8d109631da59cba7e38e3a350b41d7600201))

# Changelog

## v1.6.0(2022-02-25)


### :tada: Enhancements

1. [feat: https is enabled by default](https://github.com/liuweiGL/vite-plugin-mkcert/commit/d1b8197) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [feat:  allow force to generate certificate](https://github.com/liuweiGL/vite-plugin-mkcert/commit/ce4c4e0) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :beetle: Bug Fixes

1. [fix: fix access denied error caused by JAVA_HOME close #15](https://github.com/liuweiGL/vite-plugin-mkcert/commit/f4f7c18) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :rose: Improve code quality

1. [refactor: replace chalk with picocolors](https://github.com/liuweiGL/vite-plugin-mkcert/commit/25df350) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :rocket: Improve Performance

1. [perf: upgrade dependencies version](https://github.com/liuweiGL/vite-plugin-mkcert/commit/306f844) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :blush: Other Changes

1. [chore: remove git merge conflict](https://github.com/liuweiGL/vite-plugin-mkcert/commit/81229fa) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [chore: update playground vite config](https://github.com/liuweiGL/vite-plugin-mkcert/commit/1345a20) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  


## v1.5.2(2021-10-08)


### :beetle: Bug Fixes

1. [fix: fix the error caused by the path containing spaces close #17](https://github.com/liuweiGL/vite-plugin-mkcert/commit/655bfa4) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :blush: Other Changes

1. [chore: fix changelog author shows incorrect when name containing spaces](https://github.com/liuweiGL/vite-plugin-mkcert/commit/8b4b4b9) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [chore: upgrade dependencies](https://github.com/liuweiGL/vite-plugin-mkcert/commit/1ea70c1) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  


## v1.5.1(2021-08-06)


### :beetle: Bug Fixes

1. [fix: fix wrong debug log](https://github.com/liuweiGL/vite-plugin-mkcert/commit/510d381) :point_right: ( [Jeremy Cook](<https://github.com/Jeremy Cook>) )    
  


## v1.5.0(2021-08-02)


### :tada: Enhancements

1. [feat: support read host from server config](https://github.com/liuweiGL/vite-plugin-mkcert/commit/305639b) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :beetle: Bug Fixes

1. [fix: fix tsc report an type error](https://github.com/liuweiGL/vite-plugin-mkcert/commit/3695e8c) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  


## v1.4.2(2021-08-06)

### No Change Log

## v1.4.1(2021-07-29)


### :tada: Enhancements

1. [feat: pretty write config.json file](https://github.com/liuweiGL/vite-plugin-mkcert/commit/0a556ab) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :beetle: Bug Fixes

1. [fix(plugin): mkcert binary lost (#13)](https://github.com/liuweiGL/vite-plugin-mkcert/commit/d4a881b) :point_right: ( [iulo](<https://github.com/iulo>) )    
  

### :memo: Documents Changes

1. [docs: add hosts parameter description](https://github.com/liuweiGL/vite-plugin-mkcert/commit/3e22e65) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :rose: Improve code quality

1. [refactor(plugin): make code clean](https://github.com/liuweiGL/vite-plugin-mkcert/commit/eb7bc69) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  


## v1.4.0(2021-07-22)


### :tada: Enhancements

1. [feat(plugin): add certificate cache](https://github.com/liuweiGL/vite-plugin-mkcert/commit/e07be64) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [feat(plugin): 支持自定义域名 (#11)](https://github.com/liuweiGL/vite-plugin-mkcert/commit/fd6f58e) :point_right: ( [blacksunset](<https://github.com/blacksunset>) )    
  

### :beetle: Bug Fixes

1. [fix(script): fix release workflow wrong](https://github.com/liuweiGL/vite-plugin-mkcert/commit/d0cf9a3) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :rose: Improve code quality

1. [refactor(plugin): Adjust the hosts parameter](https://github.com/liuweiGL/vite-plugin-mkcert/commit/f5d6724) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [refactor(script): 把 version 跟 changelog 操作拆分开来](https://github.com/liuweiGL/vite-plugin-mkcert/commit/c1480a7) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :blush: Other Changes

1. [chore: adjust filename case](https://github.com/liuweiGL/vite-plugin-mkcert/commit/e207499) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [chore: update tsc outdir structure](https://github.com/liuweiGL/vite-plugin-mkcert/commit/a0b0783) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [chore: remove jest to keep simple](https://github.com/liuweiGL/vite-plugin-mkcert/commit/a545fef) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [chore: update github template](https://github.com/liuweiGL/vite-plugin-mkcert/commit/ac779d8) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  


## v1.3.2(2021-07-03)


### :beetle: Bug Fixes

1. [fix(script): 修复发包之前没有构建资源](https://github.com/liuweiGL/vite-plugin-mkcert/commit/dbd4b76) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  


## v1.3.1(2021-07-03)


### :blush: Other Changes

1. [chore: rm needless file](https://github.com/liuweiGL/vite-plugin-mkcert/commit/c568da9) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [chore: update CHANGELOG](https://github.com/liuweiGL/vite-plugin-mkcert/commit/6f1e598) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  


## v1.3.0(2021-07-03)


### :beetle: Bug Fixes

1. [fix(script): fix read config.json error](https://github.com/liuweiGL/vite-plugin-mkcert/commit/bb227c7) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [fix(plugin): fix linux system permission denied resolve #7](https://github.com/liuweiGL/vite-plugin-mkcert/commit/bc9c93e) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :blush: Other Changes

1. [chore: remove unused file](https://github.com/liuweiGL/vite-plugin-mkcert/commit/e799550) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  


## v1.2.1-beta.1(2021-07-03)


### :beetle: Bug Fixes

1. [fix(plugin): fix linux system permission denied resolve #7](https://github.com/liuweiGL/vite-plugin-mkcert/commit/e7aa23b) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  


## v1.2.0(2021-07-03)


### :beetle: Bug Fixes

1. [fix(script): 修复获取最新版本号错误](https://github.com/liuweiGL/vite-plugin-mkcert/commit/d4ce4c7) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  


## v1.1.2-beta.1(2021-07-03)

### No Change Log

## v1.1.2-beta.0(2021-07-03)

### No Change Log

## v1.1.1(2021-07-03)

### No Change Log

## v1.1.0(2021-07-03)


### :tada: Enhancements

1. [feat(script): 添加 npm 发布环节](https://github.com/liuweiGL/vite-plugin-mkcert/commit/c0f9405) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [feat(script): add version command](https://github.com/liuweiGL/vite-plugin-mkcert/commit/eb50103) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [feat(plugin): plugin only works in serve mode](https://github.com/liuweiGL/vite-plugin-mkcert/commit/d471652) :point_right: ( [liuwei](<https://github.com/liuwei>) )    

1. [feat: add logger prefix](https://github.com/liuweiGL/vite-plugin-mkcert/commit/bee34ee) :point_right: ( [liuwei](<https://github.com/liuwei>) )    
  

### :beetle: Bug Fixes

1. [fix(script): 修复 git commit 类型判断错误](https://github.com/liuweiGL/vite-plugin-mkcert/commit/9ebe727) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :memo: Documents Changes

1. [docs: add changelog link](https://github.com/liuweiGL/vite-plugin-mkcert/commit/bbef77f) :point_right: ( [liuwei](<https://github.com/liuwei>) )    

1. [docs: update plugin readme](https://github.com/liuweiGL/vite-plugin-mkcert/commit/71c6ca4) :point_right: ( [liuwei](<https://github.com/liuwei>) )    
  

### :rose: Improve code quality

1. [refactor(script): 调整 git tag 时机](https://github.com/liuweiGL/vite-plugin-mkcert/commit/429b21c) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :hammer_and_wrench: Update Workflow Scripts

1. [build: fix changelog location incorrect](https://github.com/liuweiGL/vite-plugin-mkcert/commit/6a1ca1c) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [build: update release script](https://github.com/liuweiGL/vite-plugin-mkcert/commit/bb9eada) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [build: 添加发布脚本模块](https://github.com/liuweiGL/vite-plugin-mkcert/commit/afffd57) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    
  

### :blush: Other Changes

1. [chore: fix script package version incorrect](https://github.com/liuweiGL/vite-plugin-mkcert/commit/092be19) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [chore: 更新 playground 的依赖](https://github.com/liuweiGL/vite-plugin-mkcert/commit/3ba48a8) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [chore: 使用 pnpm 包管理器](https://github.com/liuweiGL/vite-plugin-mkcert/commit/2f1f7c2) :point_right: ( [liuweigl](<https://github.com/liuweigl>) )    

1. [chore: conform with the vite plugin conventions](https://github.com/liuweiGL/vite-plugin-mkcert/commit/4097e30) :point_right: ( [liuwei](<https://github.com/liuwei>) )
