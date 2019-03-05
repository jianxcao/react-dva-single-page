import React from 'react';
import { Layout, Drawer } from 'antd';
import classNames from 'classnames';
import Media from 'react-media';
import SideBar from '@/component/siderBar/siderBar';
import { ContainerQuery } from 'react-container-query';
import 'antd/dist/antd.less';
import WrapFooter from './footer';
import WrapHeader from './header';

const {Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599
  },
  'screen-xxl': {
    minWidth: 1600
  }
};
class WrapLayout extends React.PureComponent{
  state = {
    collapsed: false,
    drawerToggle: false
  };

  static getDerivedStateFromProps(props, state) {
    if (state.drawerToggle && !props.isMinMode) {
      return {
        drawerToggle: false
      };
    }
    return null;
  }

  toggle = () => {
    const { isMinMode } = this.props;
    if (isMinMode) {
      this.setState({
        drawerToggle: !this.state.drawerToggle
      });
    } else {
      this.setState({
        collapsed: !this.state.collapsed
      });
    }
  }
  handleCloseDrawer = () => {
    this.setState({
      drawerToggle: false
    });
  }
  render () {
    const { collapsed, drawerToggle } = this.state;
    const { isMinMode } = this.props;
    return <ContainerQuery query={query}>{params => (
      <div className={classNames(params)}>
        <Layout>
          {/* min模式下不显示siderbar */}
          {!isMinMode ? <SideBar 
            collapsed={collapsed}
            breakpoint="lg"
            width={256}
          /> : <Drawer
            placement={'left'}
            closable={false}
            onClose={this.handleCloseDrawer}
            visible={drawerToggle}
          >
            <SideBar 
              breakpoint="lg"
              width={256}
            /> 
          </Drawer> }
          <Layout style={{miniHeight: '100vh'}}>
            <WrapHeader
              collapsed={collapsed}
              OnToggleSiderBarMenu={this.toggle}
            />
            <Content style={{
              margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280
            }}>
              {this.props.children}
            </Content>
            <WrapFooter/>
          </Layout>
        </Layout>
      </div>
    )}</ContainerQuery>;
  }
}

// 小于599则隐藏左侧菜单，点击header上的菜单展开drawer菜单
export default props => <Media query="(max-width: 599px)">
  { isMinMode => <WrapLayout {...props} isMinMode={isMinMode} />}
</Media>;
