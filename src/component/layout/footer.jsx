import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;
class WrapFooter extends React.PureComponent {
  render () {
    return <Footer className="m-footer">
      footer
    </Footer>;
  }
}

export default WrapFooter;
