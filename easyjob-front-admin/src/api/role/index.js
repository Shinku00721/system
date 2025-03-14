import request from "@/utils/request"
export const RoleAPI = {
  //获取所有的角色信息
  loadRoles: () => {
    return request({
      url: '/settings/loadAllRoles',
    })
  },

  //根据id 获取角色的详情信息
  getRoleDetail: (roleId) => {
    return request({
      url: '/settings/getRoleByRoleId',
      params: { roleId: roleId }
    })
  },

  //保存角色的菜单信息
  saveRole: (data) => {
    return request({
      url: '/settings/saveRoleMenu',
      params: data
    })
  },

  //删除角色信息
  delRole: (roleId) => {
    return request({
      url: '/settings/delRole',
      params: { roleId: roleId }
    })
  },

  //新增或修改角色信息
  saveOrUpdateRole: (data) => {
    return request({
      url: '/settings/saveRole',
      params: data

    })
  }
}