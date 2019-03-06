const path = require('path');
const { getModelPath } = require('./utils');
const loaderUtils = require('loader-utils');
module.exports = function(source) {
  this.cacheable();
  const resourcePath = this.resourcePath;
  const cwd = process.cwd();
  let importModels = [];
  let strModel = [];
  // 取到当前入口文件相对于编译路径的相对路径
  const relativePath = path.relative(cwd, resourcePath);
  // 是否需要检测文件是否是一个入口文件，这个loaer是在config中动态注入的，理论上只有入口文件会调用这个loader
  const options = loaderUtils.getOptions(this);
  // 从option中取出全局参数
  const globalModels = options.globalModels;
  const basePageModelPath = options.basePageModelPath;
  // 导入全局包
  if (globalModels) {
    const globalBasePath =  path.join(cwd, globalModels);
    let modelsPaths =  getModelPath(globalBasePath);
    let res = getPathStr(globalBasePath, modelsPaths);
    importModels = importModels.concat(res.import);
    strModel = strModel.concat(res.name);
  }
  if (basePageModelPath) {
    const absPath =  path.join(cwd, basePageModelPath);
    if (resourcePath.startsWith(absPath)) {
      let curPath = path.dirname(relativePath);
      while(path.relative(curPath, basePageModelPath)) {
        let basePath = path.join(cwd, curPath, 'models');
        modelsPaths =  getModelPath(basePath);
        let res = getPathStr(cwd, modelsPaths);
        importModels = importModels.concat(res.import);
        strModel = strModel.concat(res.name);
        curPath = path.dirname(curPath);
      }
    }
  }

  strModel = `[${strModel.join(',')}]`;
  const polyfill = options.polyfill ? 'import \'babel-polyfill\';' : '';
  const stri = `
    ${polyfill}
    const connectDva = require('asset/js/connectDva');
    const resource = require('${resourcePath.replace(/\\/g, '\\\\')}');
    ${importModels.join(';')};
    const models = ${strModel};
    if (module.hot) {
      module.hot.accept();
    }
    export default connectDva['default'](models, resource.dvaOpt || window.dvaOpt, resource.routers)(resource['default']);
  `;
  this.resourcePath = path.dirname(this.resourcePath) + '/source.'+ path.basename(this.resourcePath);
  return stri;
};

function getPathStr (basePath, modelsPaths) {
  return modelsPaths.reduce((res, cur) => {
    const name = path.relative(basePath, cur)
      .replace(/\/|\\/g, '$').replace('.', '$');
    res.name.push(name);
    cur = cur.replace(/\\/g, '\\\\');
    res.import.push(`import ${name} from '${cur.replace(/\\/g, '\\\\')}'`);
    return res;
  }, {
    name: [],
    import: []
  });
};
