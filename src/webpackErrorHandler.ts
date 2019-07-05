const  errHandler = (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  // 参考 https://webpack.js.org/configuration/stats/
  console.log(stats.toString({
    colors: true,
    assets: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    children: false,
    modules: false,
    moduleTrace: false,
    reasons: false,
  }));

  if(stats.hasErrors()){
    process.exit(1);
  }

};
export default errHandler;
