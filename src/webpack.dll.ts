
import path from 'path'
import webpack from 'webpack'
import UglifyJsPlugin from "uglifyjs-webpack-plugin"

const NODE_ENV = 
process.env.NODE_ENV === 'production' ? 'production' : "development";

const dllConfig: webpack.Configuration = {
  resolve: {
    modules: [path.join(process.cwd(), "src"), "node_modules"]
  },

  entry: {
    vendor: [path.join(process.cwd(), "src", "vendors.js")]
  },
  output: {
    path: path.join(process.cwd(), "resource"),
    filename: "dll.[name].js",
    library: "[name]_[hash]"
  },
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(NODE_ENV)
      }
    }),
    new webpack.DllPlugin({
      context: path.join(process.cwd(), "resource"),
      path: path.join(process.cwd(), "resource", "[name]-manifest.json"),
      name: "[name]_[hash]",
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.join(process.cwd(), "src") // important for performance!
        ],
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            }
          }
        ]
      }
    ]
  }
};

export default dllConfig;
