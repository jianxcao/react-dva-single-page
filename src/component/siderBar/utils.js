
export const getRenderData = (mapMenuList) => {
  const currentUrl = location.pathname + location.search;  
  let selectKey;
  let openKey;
  let title = 'app';
  if (mapMenuList[currentUrl]) {
    selectKey = currentUrl;
    openKey = mapMenuList[currentUrl].parentName;
    title = mapMenuList[currentUrl].name;
  }
  return {
    selectKey: selectKey ? [selectKey] : [],
    openKey: openKey ? [openKey] : [],
    title
  };
};
