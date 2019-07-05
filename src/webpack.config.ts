import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import HappyPack from 'happypack';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
// const CleanWebpackPlugin = require('clean-webpack-plugin');
import { NodeEnv } from './contant';
import getDevServer from './devServer';

const getWebpackConfig = ({ nodeEnv, apiEnv, config }) => {
  const devServer = getDevServer({ config });

  const devMode = nodeEnv === NodeEnv.development;
  const filename = config.outputFilename || 'bundle.[hash:9]';
  const baseFilename = filename.replace(/\.(js|css)$/g, '');

  let publicPath: string;
  if (typeof config.staticBaseUri === 'string') {
    publicPath = devMode ? '/' : config.staticBaseUri;
  } else {
    publicPath = devMode ? '/' : config.staticBaseUri[apiEnv];
  }

  const result: webpack.Configuration = {
    entry: {
      app: [
        devMode && `webpack-dev-server/client?${config.devUri}:${config.port}`,
        devMode && 'webpack/hot/dev-server',
        path.join(process.cwd(), './src/index')
      ].filter(Boolean)
    },
    // resolveLoader:reso
    output: {
      path: path.join(process.cwd(), 'build'), // 编译输出的静态资源根路径
      filename: `${baseFilename}.js`,
      publicPath
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    },
    mode: nodeEnv,
    devtool: devMode ? 'cheap-module-source-map' : false,
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'], // 自动补全的扩展名
      modules: [
        path.join(process.cwd(), 'src'),
        path.join(process.cwd(), 'node_modules')
      ]
    },
    devServer,
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            devMode || config.keepCssInJs
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
            config.useCssModal
              ? {
                  loader: 'typings-for-css-modules-loader', //已经包含了css-loader
                  options: {
                    localIdentName: '[name]-[local]-[hash:base64:5]',
                    modules: true,
                    namedExport: true,
                    camelCase: true,
                    sourceMap: false
                  }
                }
              : 'css-loader',
            config.usePostCss && 'postcss-loader'
          ].filter(Boolean)
        },
        {
          test: /\.(j|t)sx?$/,
          use: ['happypack/loader?id=jtsx']
        },
        {
          test: /\.(jpg|png|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 1024, // 1kb 以下base64 url打包
              fallback: 'file-loader',
              outputPath: 'images/'
            }
          }
        },
        {
          test: /\.(eot|woff|ttf|svg|cur|woff2)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 1024, // 1kb 以下base64 url打包
              fallback: 'file-loader',
              outputPath: 'others/'
            }
          }
        }
      ].filter(Boolean)
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        // favicon: "./src/favicon.ico",
        inject: 'body',
        publicPath
      }),
      new ScriptExtHtmlWebpackPlugin({
        custom: [
          {
            test: /\.js$/,
            attribute: 'corssorigin',
            value: 'anonymous'
          }
        ]
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(nodeEnv),
          API_ENV: JSON.stringify(apiEnv)
        }
      }),
      config.useDll &&
        new webpack.DllReferencePlugin({
          context: path.join(process.cwd(), 'resource'),
          manifest: path.join(process.cwd(), '/resource/vendor-manifest.json')
        }),
      new HappyPack({
        id: 'jtsx',
        threads: 4,
        loaders: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      }),
      devMode && new ForkTsCheckerWebpackPlugin(),
      devMode && new webpack.HotModuleReplacementPlugin(),
      !devMode &&
        !config.keepCssInJs &&
        new MiniCssExtractPlugin({
          filename: `${baseFilename}.css`
        })
    ].filter(Boolean)
  };

  return result;
};

export default getWebpackConfig;
