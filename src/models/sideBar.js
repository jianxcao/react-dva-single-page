const data = [{
  name: 'home',
  children: [{
    name: 'home',
    link: '/'
  }, {
    name: 'home-news',
    link: '/homenews'
  }]
}, {
  name: 'account',
  children: [{
    name: 'setting',
    link: '/setting'
  }, {
    name: 'userList',
    link: '/userList'
  }]
}, {
  name: 'test',
  link: '/test'
}];

const getMapMenuList = (data, parentName) => {
  let res = {};
  if (!data) {
    return res;
  }
  for (let cur of data) {
    if (cur.name) {
      if (cur.children) {
        const one = getMapMenuList(cur.children, cur.name);
        Object.assign(res, one);
      } else if (cur.link) {
        Object.assign(res, {
          [cur.link]: {
            parentName,
            name: cur.name
          }
        });
      }
    }
  }
  return res;
};


export default {
  namespace: 'sideBar',
  // 是否展开菜单
  collapsed: false,
  state: {
    menuList: [],
    mapMenuList: {}
  },
  reducers: {
    update (state, { payload: data}) {
      return {
        menuList: data,
        mapMenuList: getMapMenuList(data)
      };
    }
  },
  effects: {
    *sync(action, { call, put }) {
      yield put({
        type: 'update',
        payload: data
      });
    }
  }
};
