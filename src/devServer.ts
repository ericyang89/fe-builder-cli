import path from "path";
import opn from 'opn'

const getDevServer = ({ config }) => {
  const host = /\/\//.test(config.devUri) ? config.devUri.split('//')[1] : config.devUri;
  return {
    hot: true,
    proxy: config.proxy,
    contentBase: path.join(process.cwd(), "build"),
    disableHostCheck: true,
    publicPath: "/",
    allowedHosts: [".a.com"],
    host,
    historyApiFallback: true,
    port: config.port,
    open: true,
    after: () => {
      opn(`http://${host}:${config.port}`)
    }
  };

};

export default getDevServer;
