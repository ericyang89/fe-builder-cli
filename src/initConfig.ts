import findUp from 'find-up';
import path from 'path';
import fs from 'fs';

export enum ConfigType {
  babel = 'babel.config.js',
  typescript = 'tsconfig.json',
  config = 'fe-builder.config.js',
  prettier = 'prettier.config.js',
  tslint = 'tslint.json'
}

const getTemplatePath: (configType: ConfigType) => string = (
  configType: ConfigType
) => path.join(__dirname, '../template/', configType.toString());

const isFileExist: (filePath: string) => boolean = (filePath: string) => {
  const configPath = findUp.sync(filePath);
  return !!configPath;
};

const init: (configType: ConfigType) => void = (configType: ConfigType) => {
  const appPath = path.join(process.cwd(), configType.toString());
  if (isFileExist(appPath)) {
    console.log(
      `${configType} 配置文件已存在。
    你也可以选择手动删除该文件！`
    );
    return;
  }

  const templatePath = getTemplatePath(configType);
  const readStream = fs.createReadStream(templatePath);
  const writeStream = fs.createWriteStream(appPath);
  readStream.pipe(writeStream);
};

export default init;
