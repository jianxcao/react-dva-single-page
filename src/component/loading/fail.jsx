import React from 'react';

class Fail extends React.PureComponent{
  render () {
    return <div>loading fail  <a href="javascript:location.reload();">retry</a></div>;
  }
}
export default Fail;
