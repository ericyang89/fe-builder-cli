# fe-builder

前端构建命令行工具。将构建部分单独抽取成一个项目，简化新项目的配置。支持 0 配置；100% 可扩展。减小维护成本。
集成ci

## 特点

+ 简化新项目配置
+ 支持 0 配置
+ 100% 可扩展webpack的配置
+ 默认支持 typescript
+ 默认支持 dllPlugin 打包性能优化
+ 支持 happypack，并行 loader
+ webpack 升级后，只需要升级 fe-builder

## 约定||规范

+ 默认入口路径 `/src/index.(j|s)x？`
+ 默认生成目录 `/build`
+ html 模板路径 `/src/index.html`
+ dll 默认配置:
  + dll 入口路径`/src/vendors.js`
  + dll 生成文件 `resource/dll.vendor.js` 
  + dll 生成配置文件 `resource/vendor-manifest.json` 
  + 需要手动在 html 模板中加入 dll 生成文件的 引入

## 安装

``` shell
 yarn add fe-builder-cli
```

## 使用

### 环境变量

```typescript

export enum NODE_ENV{
  'development'='development',
  'production'='production',
}
export enum API_ENV{
  'develop'='develop',
  'staging'='staging',
  'testing'='testing',
  'production'='production',
}

```

### 命令

``` shell

 # 初始化 会给出3个默认的配置文件
 # fe-builder.config.js -- fe-builder 构建配置文件
 # babel.config.js      -- 默认 babel 配置文件
 # tsconfig.json        -- 默认 ts 配置文件
 # 如果文件已存在则不会覆盖；只会给予提示
 fe-builder init

 fe-builder dev # 开发
 fe-builder pro # 打包部署
 fe-builder dll # dll 打包
 fe-builder formatAll # 通过 prettier 格式化话 /src 目录的文件

 fe-builder --help # 帮助

```

### 推荐 package.json 的 scripts 配置

```json
  "scripts": {
    "init": "fe-builder init",
    "start": " cross-env NODE_ENV=development API_ENV=develop fe-builder dev",
    "build:develop": " cross-env NODE_ENV=production API_ENV=develop fe-builder pro",
    "build:testing": " cross-env NODE_ENV=production API_ENV=testing fe-builder pro",
    "build:staging": " cross-env NODE_ENV=production API_ENV=staging fe-builder pro",
    "build:master": " cross-env NODE_ENV=production API_ENV=production fe-builder pro",
    "build:production": "npm run build:master",
    "build": "npm run build:production"
  }
```


### API & 默认值

```typescript
type Config={
  port:number,

  // 本地开发域名
  devUri:string,

  // 静态资源域名
  staticBaseUri:string|EnvObj ,

  // 网站域名
  baseUri:string|EnvObj ,
  useCssModal?:boolean,
  usePostCss?:boolean,
  useDll?:boolean,
  keepCssInJs?: boolean;
  OutputFilename?: string;
  webpackConfig?:(arg1:webpack.Configuration,arg2:any)=>webpack.Configuration,

  // 参考 webpack-dev-server 的 proxy
  proxy:any,
}

const defaultConfig:Config={
  port:3000,
  devUri:'127.0.0.1',
  staticBaseUri:'/',
  baseUri:'/',
  useCssModal:false,
  usePostCss:false,
  useDll:false,
  webpackConfig:null,
  proxy:{},
};

```
