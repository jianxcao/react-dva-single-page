import React from 'react';
import './home.less';
import { connect } from 'dva';

@connect(({home}) => {
  return {
    home
  };
})
class Home extends React.PureComponent {
  render () {
    return <div className='m-home'>{this.props.home.info}</div>;
  }
}

export default Home;
