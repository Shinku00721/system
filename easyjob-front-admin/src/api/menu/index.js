import request from "@/utils/request";
export const MenuAPI = {
  //获取菜单列表
  getMenuList: () => {
    return request({
      url: '/settings/menuList',
    })
  },

  //修改菜单数据
  updateMenu: (data) => {
    return request({
      url: '/settings/saveMenu',
      params: data
    })
  },

  //删除菜单数据
  delMenu: (data) => {
    return request({
      url: '/settings/delMenu',
      params: data
    })
  }
}