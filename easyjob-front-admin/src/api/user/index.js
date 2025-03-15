import request from "@/utils/request"
export const UserAPi = {
  //获取用户列表
  getUserList: () => {
    return request({
      url: '/settings/loadAccountList',
    })
  },

  //修改用户状态
  updateUserStatus: (data) => {
    return request({
      url: '/settings/updateStatus',
      params: data
    })
  },

  //删除用户数据
  deleteUser: (data) => {
    return request({
      url: "/settings/delAccount",
      params: data
    })
  },

  //新增或修改用户信息
  saveOrUpdateUser: (data) => {
    return request({
      url: '/settings/saveAccount',
      params: data
    })
  },

  //修改用户密码
  updateUserPassword: (data) => {
    return request({
      url: '/settings/updatePassword',
      params: data
    })
  }
}