#!/usr/bin/env node

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import yargs from 'yargs';
import dllConfig from './webpack.dll';
import getWebpackConfig from './webpack.config';
import errHandler from './webpackErrorHandler';
import configLoader from './configLoader';
import { NodeEnv, ApiEnv } from './contant';
import initConfig, { ConfigType } from './initConfig';
import formatAll from './formatAll';

const [, , ...args] = process.argv;
const nodeEnv: NodeEnv = process.env.NODE_ENV as NodeEnv;
const apiEnv: ApiEnv = process.env.API_ENV as ApiEnv;
const config = configLoader(args, nodeEnv, apiEnv);
if (!nodeEnv || !apiEnv) {
  console.log(
    `请输入有效的 NODE_ENV 和 API_ENV ，例如：
    cross-env NODE_ENV=production API_ENV=production fe-builder pro
    `
  );
}

console.log(`===== nodeEnv:${nodeEnv}=apiEnv:${apiEnv}=args:${args}=====`);

const defaultWebpackConfig = getWebpackConfig({ nodeEnv, apiEnv, config });
let webpackConfig;
if (typeof config.webpackConfig === 'function') {
  webpackConfig = config.webpackConfig(defaultWebpackConfig, {
    args,
    nodeEnv,
    apiEnv
  });
} else {
  webpackConfig = defaultWebpackConfig;
}

const { argv } = yargs
  .scriptName('fe-builder')
  .usage('Usage:$0 <cmd> [args]')
  .describe('s', 'pass when you do not want to format your code')
  .command(
    ['dev', 'd'],
    'run develop mode! just for local developing',
    yarns => yarns,
    () => {
      new WebpackDevServer(
        webpack(webpackConfig),
        webpackConfig.devServer || {}
      ).listen(
        (webpackConfig.devServer && webpackConfig.devServer.port) || 3000,
        (webpackConfig.devServer && webpackConfig.devServer.host) || '0.0.0.0'
      );
    }
  )
  .command(
    ['pro', 'p'],
    'run production mode! for deploying on develop staging or online environment',
    {},
    () => {
      const compiler = webpack(webpackConfig);
      compiler.run(errHandler);
    }
  )
  .command(
    ['dll'],
    'build dll file! use it only if you use dll and the dll need update',
    {},
    () => {
      if (config.useDll) {
        webpack(dllConfig).run(errHandler);
      } else {
        console.log(`当配置 useDll 项，不为 true 的时候；你不需要执行此命令！`);
      }
    }
  )
  .command(
    ['init', 'i'],
    'build init! it will give you some default configs if needed.',
    {},
    () => {
      initConfig(ConfigType.babel);
      initConfig(ConfigType.typescript);
      initConfig(ConfigType.config);
      initConfig(ConfigType.prettier);
      initConfig(ConfigType.tslint);
    }
  )
  .command(
    ['formatAll', 'f'],
    'format all the file in src dirctory! it will format all the file in src dirctory by prettier.',
    {},
    () => {
      formatAll();
    }
  )
  .help();
