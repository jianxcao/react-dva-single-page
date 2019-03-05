// 单页面项目入口文件
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/component/layout';
import { Route, Switch }  from 'react-router';
import Home from './page/home';
import HomeNews from './page/home/newsList';
import UserList from './page/account/userList';
import UserSetting from './page/account/setting';

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
