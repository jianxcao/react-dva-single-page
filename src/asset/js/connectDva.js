import dva from 'dva';
import { AppContainer } from 'react-hot-loader';
import React from 'react';
import { Router } from 'dva/router';
import ReactDOM from 'react-dom';
import { withRouter }  from 'react-router';
import { createBrowserHistory } from 'history';
import createLoading from 'dva-loading';
import hoistNonReactStatics from 'hoist-non-react-statics';
const IS_DEV = !EASY_ENV_IS_PROD;

function clientRender(models, target, opt = {}) {
  if (!models) {
    models = [];
  }
  if (!Array.isArray(models)) {
    models = [models];
  }
  opt.history = createBrowserHistory();
  // 只用dva的store不用router
  const app = dva(opt);
  for(let model of models) {
    app.model(model);
  }
  // 写在全局方便测试
  window.dva_app = app;
  const router = getRouter(target, app);
  app.router(router);
  setLoading(app);
  const App = app.start();
  // dva注入
  App.prototype.dva = app;
  const render = Page =>{
    ReactDOM.hydrate(IS_DEV ? <AppContainer><Page /></AppContainer> : <Page />, document.getElementById('app'));
  };
  if (IS_DEV && module.hot) {
    module.hot.accept();
  }
  render(App);
}

const setLoading = app => {
  app.use(createLoading({
    global: false
  }));
};
/**
 * 
 * @param {component|Object} target 根据目标生成dva的路由方法,传入一个组件或者一个router的配置对象
 */
const getRouter = (target, app) => {
  const Com = withRouter(target);
  return ({ history }) => <Router history={history}><DvaContext.Provider value={app}>
    <Com/>
  </DvaContext.Provider></Router>;
};
/**
 * 这里只是一个单个组件的链接不带路由
 * 链接dva到一个react的class组件上，注意只能是class组件
 * 这里多用于一个页面直接渲染，后者子路由通过前端渲染
 * @param {Array|Object} models 其他model，非必须，可以自己在组件中调用this.dva注入model
 * @param {Object} opt 标准的dva的配置的参数
 */
export default function connectDva(models, opt) {
  /**
   * 组件或者router对象
   * @param {component|Object} target react的组件 函数式或者class
   * */ 
  return target => {
    // 将类转换成一个对象
    return clientRender(models, target, opt); 
  };
}
export const DvaContext = React.createContext();

export const getDva = App => {
  const Components = (props) => {
    return <DvaContext.Consumer>{dva => (<App {...props} dva={dva}/>)}</DvaContext.Consumer>;
  };
  Components.displayName = 'Connectdva';
  hoistNonReactStatics(Components, App);
  return Components;
};
