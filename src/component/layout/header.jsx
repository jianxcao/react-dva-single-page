import React from 'react';
import { Layout, Icon } from 'antd';
import './header.less';
const { Header } = Layout;
class WrapHeader extends React.PureComponent{
  render () {
    const { collapsed, OnToggleSiderBarMenu } = this.props;
    return <Header className="m-header">
      <Icon
        className="m-trigger-menu-list"
        type={collapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={OnToggleSiderBarMenu}
      />
    </Header>;
  }
}

export default WrapHeader;
