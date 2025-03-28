import request from "@/utils/request"

export const QuestionApi = {
  //根据页码获取八股文列表
  getQuestionList: (data) => {
    return request({
      url: '/questionInfo/loadDataList',
      params: data
    })
  },

  //新增或修改八股文的方法
  saveOrUpdateQuestion: (data) => {
    return request({
      url: '/questionInfo/saveQuestionInfo',
      params: data
    })
  },

  //删除八股文的方法
  delQuestion: (data) => {
    return request({
      url: '/questionInfo/delQuestion',
      params: data
    })
  },

  //批量导入数据上传文件的方法
  uploadQuestion: (data) => {
    return request({
      url: '/questionInfo/importQuestion',
      params: data
    })
  },

  //批量删除八股文的方法
  delQuestionList: (data) => {
    return request({
      url: "/questionInfo/delQuestionBatch",
      params: data
    })
  },

  //发布八股文的方法
  postQuestion: (data) => {
    return request({
      url: "/questionInfo/postQuestion",
      params: data
    })
  },

  //获取八股文详情信息的方法
  getQuestionDetail: (data) => {
    return request({
      url: "/questionInfo/showQuestionDetailNext",
      params: data
    })
  }
}