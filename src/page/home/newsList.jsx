import React from 'react';
import './home.less';
import { connect } from 'dva';
import './news.less';

@connect(({homeNews}) => {
  return {
    homeNews
  };
})
class NewsList extends React.PureComponent{
  render () {
    const homeNews = this.props.homeNews;
    const news = homeNews.news || [];
    return <div className='m-home-news'><ul>{
      news.map((cur, index) => <li key={index}>{cur}</li>)
    }</ul></div>;
  }
}

export default NewsList;
