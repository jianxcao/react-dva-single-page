const loaderUtils = require('loader-utils');
const path = require('path');
const { getModelPath } = require('./utils');
const qs = require('querystring');
const hash = require('hash-sum');
const isProduction = process.env.NODE_ENV === 'production';

module.exports = function(source) {
  const resourcePath = this.resourcePath;
  const options = loaderUtils.getOptions(this);
  const {
    resourceQuery
  } = this;
  const rawQuery = resourceQuery.slice(1) || '';
  const incomingQuery = qs.parse(rawQuery);
  let context = options.context || process.cwd();
  if (!path.isAbsolute(context)) {
    context = path.join(process.cwd(), context);
  }
  options.context = context;
  const relativeSourcePath = path.relative(context, resourcePath);
  if (!incomingQuery.sourceCode) {
    incomingQuery.sourceCode = true;
    let include = options.include || null;
    if (typeof include === 'string') {
      include = [new RegExp(include)];
    } else if (Array.isArray(include)) {
      include = include.map(cur => {
        return new RegExp(cur);
      });
    }
    let exclude = options.exclude || [];
    if (typeof exclude === 'string') {
      exclude = [new RegExp(exclude)];
    } else if (Array.isArray(exclude)) {
      exclude = exclude.map(cur => new RegExp(cur));
    }

    if (include && include.length) {
      const normalPath = relativeSourcePath.replace(/\\/g, '/');
      const is = include.some(cur => cur
        .test(normalPath)) && exclude.every(cur => !cur.test(normalPath));
      // 匹配到正确的组件
      // 将组件注入model并改成异步加载
      if (is) {
        let str =  `
          import React, { PureComponent } from 'react';
          import loadable from '@loadable/component';
          `;
        if (options.loadingPath) {
          str += `
          import Loading from '${options.loadingPath}';
          `;
        } else {
          str += 'const Loading =  () => <div className="m-loading">loading</div>;';
        }
        if (options.loadingFailPath) {
          str += `
          import LoadingFailComponent from '${options.loadingFailPath}' `;
        } else {
          str += 'const LoadingFailComponent = () => <div className="m-loading-fail">loading fail</div>';
        }
        str += `
          ${parseAsyncConnect(this.resourcePath, incomingQuery, options)}
          `;
        this.resourcePath = path.dirname(this.resourcePath) + '/async.'+ path.basename(this.resourcePath);
        return str;
      }
    }
  }
  return source;
};

function parseAsyncConnect (resourcePath, incomingQuery, loaderOptions) {
  const webpackChunkFilename = `/* webpackChunkName: "${path.relative(loaderOptions.context, resourcePath)
    .replace(path.extname(resourcePath), '').replace(/\\/g, '\\\\')}" */`;
  return `
    let cache = null;
    export default class AsyncConnect extends PureComponent {
      constructor (...arg) {
        super(...arg);
        this.state = {
          isLoading: true,
          loadingSucc: false,
          loadingFail: false,
          Source: null
        };
      }
      componentDidMount() {
        // debugger;
        // 返回加载资源的promise
        let allPromise;
        // 组件二次加载直接从缓存中拿结果
        if (cache) {
          allPromise = cache;
        } else {
          // 解析model返回injectModelPromise
          ${parseModes(resourcePath, loaderOptions)}
          const SourcePromise = import(${webpackChunkFilename}'${resourcePath.replace(/\\/g, '\\\\')}?${qs.stringify(incomingQuery)}');
          allPromise = Promise.all([SourcePromise, injectModelPromise]).then(res => res[0]);
          cache = allPromise;
        }
        allPromise.then(res => {
          this.setState({
            Source: res['default'] || res['default'],
            loadingSucc: true,
            isLoading: false
          });
        }).catch(() => {
          this.setState({
            loadingFail: true,
            isLoading: false
          });
        });
      }
      render() {
        const { isLoading, loadingSucc, loadingFail, Source} = this.state;
        if (isLoading) {
          return <Loading/>;
        } else if (loadingSucc) {
          return <Source {...this.props}/>;
        } else if (loadingFail) {
          return <LoadingFailComponent/>;
        }
      }
    }
  `;
}

function parseModes (resourcePath, loaderOptions) {
  let allModelPath = [];
  let importModels = [];
  let strModel = [];
  const cwd = process.cwd();
  const injectModelPath = loaderOptions.injectModelPath;
  const context = loaderOptions.context;
  // 取到当前入口文件相对于编译路径的相对路径
  const relativePath = path.relative(cwd, resourcePath);
  // inject model
  if (injectModelPath) {
    const absPath =  path.join(cwd, injectModelPath);
    if (resourcePath.startsWith(absPath)) {
      let curPath = path.dirname(relativePath);
      while(path.relative(curPath, injectModelPath)) {
        let basePath = path.join(cwd, curPath, 'models');
        modelsPaths =  getModelPath(basePath);
        allModelPath.push(modelsPaths);
        let res = getPathStr(cwd, modelsPaths);
        importModels.push(res.import);
        strModel.push(res.name);
        curPath = path.dirname(curPath);
      }
    }
  };
  let str = `
    let injectModelPromise = [];
  `;
  // 加载model
  // 同一个目录下的models会打包成一个文件
  // 增加一个模块id去识别一个model模块，通过路径识别，如果这个路径在任务这个model模块已经载入过
  if (allModelPath.length) {
    allModelPath.forEach((oneAllModelPath, index) => {
      const chunkFileName = path.dirname(path.relative(context, oneAllModelPath[0]));
      // 对路径进行hash
      let modelsId = JSON.stringify(oneAllModelPath.map(cur => hash(cur)));
      str += `
      injectModelPromise.push(require.ensure(
        [],
        function(require) {
          ${importModels[index].join(';')}
          const models = [${strModel[index].join(',')}];
          const modelIds = ${modelsId};
          models.forEach((model, index) => {
            // 全局变量必须在，否则只加载不注入
            if (window.dva_app) {
              model = model['default'] || model;
              model.__hash_model_id = modelIds[index];
              const models = window.dva_app._models;
              if (model.namespace) {
                if (models.every(one => one.__hash_model_id !== model.__hash_model_id)) {
                  window.dva_app.model(model)
                }
              } else {
                console.warn('dva model needs the namespace attribute')
              }
            }
          });
        },
        null,
        '${chunkFileName.replace(/\\/g, '\\\\')}'
      ));
      `;
    });
    str += 'injectModelPromise = Promise.all(injectModelPromise)';
  } else {
    str = 'const injectModelPromise = Promise.resolve(null)';
  }
  return str;
}

function getPathStr (basePath, modelsPaths) {
  return modelsPaths.reduce((res, cur) => {
    const name = path.relative(basePath, cur)
      .replace(/\/|\\/g, '$').replace('.', '$');
    res.name.push(name);
    cur = cur.replace(/\\/g, '\\\\');
    res.import.push(`const ${name} = require('${cur}')`);
    return res;
  }, {
    name: [],
    import: []
  });
};
