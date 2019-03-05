# 项目说明

## 项目目录结构说明

``` bash
App
├── package.json
├── src
|   ├── asset(静态资源目录)
│   ├── component(公共组件目录)
│   ├── page(页面目录)
│   │   ├── pageOne
│   │   │   ├── models
│   │   │   └── index.jsx
│   │   ├── pageTwo
│   │   │   ├── models
│   │   │   └── index.jsx
│   │   ├── moduleOne
│   │   │   ├── pageThree
│   │   │   │   ├── models
│   │   │   │   └── index.jsx 
│   ├── models(全局dva目录)
│   ├── framework(框架相关，自定义loader，插件等)
│   ├── view(模板目录)
│   └── index.js(入口文件)
├── webpack.config.js
└── dist目录

```



## 项目编译说明

1. 编译采用[easywebpack](https://www.yuque.com/easy-team/easywebpack/home)
2. 编译中有自定义[loader](./src/framework/loaders/readme.md) 
   1. `./src/framework/loaders/clientloader`,[loader](./src/framework/loaders/readme.md)的主要作用是创建dva对象，加载全局的models对象，还有入口文件自带的models对象
   2. `./src/framework/loaders/asyncLoader`, [loader](./src/framework/loaders/readme.md)的主要作用是将page下的入口文件注入dva的models对象，并将组件和models异步加载



## 入口文件代码说明



``` javascript
// 单页面项目入口文件
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/component/layout';
import { Route, Switch }  from 'react-router';

//下面这些链接代表异步加载的页面
import Home from './page/home';
import HomeNews from './page/home/newsList';
import UserList from './page/account/userList';
import UserSetting from './page/account/setting';
/**
	注意这里所有的页面都这么写加载就可以
	这些页面在经过 asyncLoader后，会自动变成异步入口文件，并同时注入目录
	下面的models, 用户无需关心models的注入和入口文件的异步加载，
	
	我们为什么这么做
	
	是为了方便splitchunk，通过asyncLoader后面文件的models会自动打包成不
	同的chunk，而入口页面也会打包成一个异步模块，无需用户关心
*/
class App extends React.Component{
  render () {
    return <Layout>
      <Switch>
        <Route path="/userlist" component={UserList}></Route>
        <Route path="/setting" component={UserSetting}></Route>
        <Route path="/homenews" component={HomeNews}></Route>
        <Route path="/" component={Home}></Route>
      </Switch>
    </Layout>;
  }
}

export default App;

```



## 运行命令说明

1. `npm run start` 启动命令
2. `npm run build` 产出文件的命令

