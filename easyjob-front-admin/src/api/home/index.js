import request from "@/utils/request"
export const HomeAPI = {
  //查询近一周的内容统计数据
  getContentWeekData: () => {
    return request({
      url: "/index/getContentWeekData",
    })
  },

  //查询近一周的app统计数据
  getAppWeekData: () => {
    return request({
      url: '/index/getAppWeekData'
    })
  },

  //查询一周内容发布数据
  getAllData: () => {
    return request({
      url: '/index/getAllData'
    })
  }
}