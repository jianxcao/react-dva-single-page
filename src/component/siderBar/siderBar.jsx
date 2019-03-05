import React from 'react';
import PropTypes from 'prop-types';
import { propTypes } from 'react-decoration';
import DocumentTitle from 'react-document-title';
import { Layout, Menu} from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import classNames from 'classnames';
import * as setting from '@/setting';
import { getRenderData} from './utils';
import './index.less';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

// 不在mobile下，宽度大的时候可以fixsiderbar
const siderClassName = classNames('sider', {
  ['fixSiderbar']: false,
  ['light']: setting.navTheme === 'light'
});

@connect(({sideBar}) => ({ menuList: sideBar.menuList || [], mapMenuList: sideBar.mapMenuList || {}}))
@propTypes({
  collapsed: PropTypes.bool
})
class SiderBar extends React.PureComponent{
  constructor (props) {
    super(props);
    const { mapMenuList } = this.props;
    this.state = {
      mapMenuList,
      ...getRenderData(mapMenuList)
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.mapMenuList !== props.mapMenuList) {
      const res = getRenderData(props.mapMenuList);
      let { selectKey, openKey } = state;
      if (selectKey.every(cur => cur !== res.selectKey[0])) {
        selectKey.push(res.selectKey[0]);
      }
      if (openKey.every(cur => cur !== res.openKey[0])) {
        openKey.push(res.openKey[0]);
      }
      return {
        mapMenuList: props.mapMenuList,
        selectKey,
        openKey
      };
    }
    return null;
  }
 
  handleSelectMenu = ({ item, selectedKeys}) => {
    const key = selectedKeys[0];
    const { mapMenuList } = this.props;
    if (mapMenuList[key]) {
      this.setState({
        title: mapMenuList[key].name,
        selectKey: selectedKeys
      });
    }
  }
  handleOpenChange = (openKeys) => {
    this.setState({
      openKey: openKeys
    });
  }

  getMenuData (data) {
    if (!data) {
      return null;
    }
    return data.map(cur => this
      .getSubMenuOrItem(cur))
      .filter(item => item);
  }

  getSubMenuOrItem (data) {
    const currentUrl = location.pathname + location.search;
    if (!data || !data.name) {
      return null;
    }
    if (data.children) {
      return (
        <SubMenu
          title={data.name}
          key={data.name}
        >
          {this.getMenuData(data.children)}
        </SubMenu>
      );
    }
    return <Menu.Item key={data.link}><Link
      to={data.link}
      target={data.target}
      replace={data.link === currentUrl}
    >{data.name}</Link></Menu.Item>;
  }

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'sideBar/sync'
    });
  }

  render () {
    const { collapsed, menuList, width} = this.props;
    const { selectKey, openKey, title } = this.state;
    return <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className={siderClassName}
      width={width}
    >
      <div className="logo">
        <Link to="/">
          {/* <img src={logo} alt="logo" /> */}
          <h1>doc</h1>
        </Link>
      </div>
      <Menu theme={setting.navTheme}
        mode="inline"
        onSelect={this.handleSelectMenu}
        onOpenChange={this.handleOpenChange}
        selectedKeys={selectKey}
        openKeys={openKey}>
        {this.getMenuData(menuList)}
      </Menu>
      <DocumentTitle title={title || 'app'}></DocumentTitle>;
    </Sider>;
  }
}

export default SiderBar;
