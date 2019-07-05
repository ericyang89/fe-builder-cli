// 参考 https://github.com/capaj/be-pretty

import path from 'path';
import execa from 'execa';

const getSupportedExtensions = (prettier: {
  getSupportInfo: () => { languages: any[] };
}) => {
  const supportedExtensions = prettier
    .getSupportInfo()
    .languages.reduce(
      (prev: string[], language: { extensions: string }) =>
        prev.concat(language.extensions || []),
      []
    );
  return supportedExtensions;
};

const formatAll = () => {
  const prettier = require(path.resolve(
    process.cwd(),
    'node_modules/prettier/index.js'
  ));
  const allExtensionsComaSeparated = getSupportedExtensions(prettier)
    .map((ext: string) => ext.substring(1))
    .join(',');

  console.log('========start to format===========');

  (async () => {
    const { stdout } = await execa('npx', [
      'prettier',
      `src/**/*.{${allExtensionsComaSeparated}}`,
      '--write'
    ]);
    console.log(stdout);
    console.log('======== format done ===========');
  })();
};

export default formatAll;
