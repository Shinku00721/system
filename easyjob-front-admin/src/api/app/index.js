import request from "@/utils/request";
export const AppApi = {
  //获取app用户列表
  getAppUserList: (data) => {
    return request({
      url: "/appUser/loadDataList",
      params: data
    });
  },

  //更新app用户状态
  updateAppUserStatus: (data) => {
    return request({
      url: "/appUser/updateStatus",
      params: data
    });
  },

  //获取设备列表
  getDeviceList: (data) => {
    return request({
      url: "/appUser/loadDeviceList",
      params: data
    });
  },

  //获取轮播图列表
  getAppCarouselList: (data) => {
    return request({
      url: "/appCarousel/loadDataList",
      params: data
    });
  },

  //新增或修改轮播图
  saveOrUpdateAppCarousel: (data) => {
    return request({
      url: "/appCarousel/saveCarousel",
      params: data
    });
  },

  //删除轮播图的方法
  deleteAppCarousel: (data) => {
    return request({
      url: "/appCarousel/delCarousel",
      params: data
    });
  },

  //获取问题反馈列表
  getFeedbackList: (data) => {
    return request({
      url: "/appFeedback/loadFeedback",
      params: data
    });
  },
}