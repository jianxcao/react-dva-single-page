# loader说明


## clientLoader

1. 主要作用于入口文件，在入口文件中用！加入这个loader，这个loader能自动注入dva，并注入全局model和入口文件同级目录下的model

  如 src/framework/loaders/clientLoader.js?globalModels=src/models&basePageModelPath=src/page
  
  主要参数  
    1. globalModels全局模块model的路径
    2. basePageModel 会对这个目录下的所有入口文件加载同级，及以上目录的model的配置
    3. polyfill参数，是否注入bable-polyfill模块



## asyncLoaer
1. 主要作用是将一个同步引入的模块切换成异步引入，并在同级目录下查找model，将model拆包后异步注册, 多个model将切成一个js，组件切成另外一个js动态引入

``` javascript
  {
    loader: 'asyncLoader',
    options: {
      // 可以为数组，表明哪些模块需要调整成异步
      include: ['src\/page\/.+\/.+\.jsx'],
      // 排除模块
      exclude: [],
      // 根路径，如果不设置就是项目的根路径
      context: 'src',
      // 是否在模块中注入异步model,model向上查找路径，如果不设置，就不会注入，否则会自动向上查找model并异步注入,目录相对于项目根目录
      injectModelPath: 'src/page',
      // loading组件的路径，相对于项目根目录，或者通过alias别名的目录
      loadingPath: 'loading',
      // 加载失败的情况
      loadingFailPath: 'falil'
    }
  }
  
``` 
  如果引入的模块自带sourceCode=true参数则会跳过这个loader
