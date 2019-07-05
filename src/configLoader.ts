import findUp from 'find-up';
import webpack from 'webpack';
import { EnvObj } from './contant';
import { OutputFileType } from 'typescript';

const configFileName = 'fe-builder.config.js';

type Config = {
  port: number;

  // 本地开发域名
  devUri: string;

  // 静态资源域名
  staticBaseUri: string | EnvObj;

  // 网站域名
  baseUri: string | EnvObj;
  useCssModal?: boolean;
  usePostCss?: boolean;
  useDll?: boolean;
  keepCssInJs?: boolean;
  OutputFilename?: string;

  webpackConfig?: (
    arg1: webpack.Configuration,
    arg2: any
  ) => webpack.Configuration;

  // 参考 webpack-dev-server 的 proxy
  proxy: any;
};

const defaultConfig: Config = {
  port: 3000,
  devUri: '127.0.0.1',
  staticBaseUri: '/',
  baseUri: '/',
  useCssModal: false,
  usePostCss: false,
  useDll: false,
  keepCssInJs: false,
  webpackConfig: null,
  OutputFilename: 'bundle.[hash:9]',
  proxy: {}
};

const configLoader: (args, nodeEnv, apiEnv) => Config = (
  args,
  nodeEnv,
  apiEnv
) => {
  const configPath = findUp.sync(configFileName);

  if (configPath) {
    const customConfigOnlyCmd = require(configPath);
    const customConfig = customConfigOnlyCmd.default || customConfigOnlyCmd;

    if (typeof customConfig === 'function') {
      return { ...defaultConfig, ...customConfig(args, nodeEnv, apiEnv) };
    }
    return { ...defaultConfig, ...customConfig };
  }

  return defaultConfig;
};

export default configLoader;
