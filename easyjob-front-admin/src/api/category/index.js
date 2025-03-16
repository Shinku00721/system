import request from "@/utils/request"
export const CategoryApi = {
  //获取全部的分类
  getAllCategory: () => {
    return request({
      url: '/category/loadAllCategory',
    })
  },

  ///删除分类的方法
  delCategory: (data) => {
    return request({
      url: '/category/delCategory',
      params: data
    })
  },

  //修改或添加分类的方法
  saveCategory: (data) => {
    return request({
      url: '/category/saveCategory',
      params: data
    })
  },


}