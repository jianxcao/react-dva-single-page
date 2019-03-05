'use strict';
const easywebpack = require('easywebpack-react');
const path = require('path');
const resolve = (filepath) => path.resolve(__dirname, filepath);
const IS_PRO = process.env.NODE_ENV === 'production';
const developmentFilename = '[name].js';
const productionFilename = '[name].[chunkhash].js';
const defaultFilename = IS_PRO ? productionFilename : developmentFilename;
const developmentChunkFilename = '[name].js';
const productionChunkFilename = '[name].[chunkhash].js';
const chunkFilename = IS_PRO ? productionChunkFilename : developmentChunkFilename;

const config = {
  target: 'web',
  framework: 'react',
  devtool: 'cheap-module-source-map',
  entry: {
    include: 'src/index.jsx',
    exclude: ['src/page/[^\/]+/(component|components|store|models|common|page|pagelet|image|img|style|styles|css)'],
    loader: {
      // 2个参数，一个表示注入全局的model一个表示注入入口文件对应的model
      client: 'src/framework/loaders/clientLoader.js?globalModels=src/models&basePageModelPath=src/page&polyfill=true'
    }
  },
  output: {
    filename: defaultFilename,
    chunkFilename: chunkFilename
  },
  alias: {
    common: 'src/common',
    framework: 'src/framework',
    asset: 'src/asset',
    '@' :'src/'
  },
  template: 'src/view/layout.html',
  loaders: {
    babel: {
      include: [resolve('src'), resolve('node_modules')],
      use: [{
        loader: 'thread-loader'
      }, {
        loader: 'babel-loader'
      },{
        loader: 'asyncLoader',
        options: {
          include: ['page\/[^\/]+\/.+\.jsx', 'page\/[^\/]+\/[^\/]+\/.+\.jsx'],
          exclude: ['page/[^\/]+/(component|components|store|models|common|page|pagelet|image|img|style|styles|css)'],
          // model自动注入，向上查找到src/page目录下, 相对于编译目录
          injectModelPath: 'src/page',
          context: 'src',
          loadingPath: '@/component/loading',
          loadingFailPath: '@/component/loading/fail'
        }
      }]
    },
    less: {
      include: [resolve('src'), resolve('node_modules')],
      options: {
        javascriptEnabled: true
        // modifyVars: { // AntD Theme Customize
        //   'primary-color': 'red',
        //   'link-color': '#1DA57A',
        //   'border-radius-base': '2px'
        // }
      }
    }
  },
  optimization: {
    runtimeChunk: { name: 'common/runtime'},
    splitChunks: {
      filename: `common/${chunkFilename}`,
      cacheGroups: {
        default: false,
        polyfill: {
          name: 'polyfill',
          minChunks: 1,
          test(module) {
            return module.resource && (module.resource.indexOf('node_modules/core-js') > -1 || module.resource.indexOf('node_modules/babel-runtime') > -1);
          },
          priority: 1
        },
        styles: {
          chunks: 'initial'
        },
        vendors: {
          chunks: 'initial'
        }
      }
    }
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, 'src/framework/loaders'),
      'node_modules'
    ]
  }
};

module.exports = config;

// const res = easywebpack.getWebWebpackConfig(config);
// console.log(res);
