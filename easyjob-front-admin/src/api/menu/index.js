import request from "@/utils/request";
export const MenuAPI = {
  //获取菜单列表
  getMenuList: () => {
    return request({
      url: '/settings/menuList',
    })
  }
}