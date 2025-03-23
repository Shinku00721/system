import request from "@/utils/request";
export const ExamApi = {
  //获取考题列表
  getExamList: (data) => {
    return request({
      url: '/examQuestion/loadDataList',
      params: data
    })
  },

  //获取问题选项
  getExamOption: (data) => {
    return request({
      url: '/examQuestion/loadQuestionItem',
      params: data
    })
  },

  //新增考题数据
  saveExam: (data) => {
    return request({
      url: '/examQuestion/saveExamQuestion',
      params: data
    })
  },

  //获取问题选项
  getExamItem: (data) => {
    return request({
      url: '/examQuestion/loadQuestionItem',
      params: data
    })
  },

  //删除考题
  delExam: (data) => {
    return request({
      url: '/examQuestion/delExamQuestion',
      params: data
    })
  },

  //批量发布
  postExamList: (data) => {
    return request({
      url: '/examQuestion/postExamQuestion',
      params: data
    })
  },

  //取消发布
  cancelPostExamList: (data) => {
    return request({
      url: '/examQuestion/cancelPostExamQuestion',
      params: data
    })
  },

  //导入题库
  importExamList: (data) => {
    return request({
      url: '/examQuestion/importExamQuestion',
      params: data
    })
  }
}