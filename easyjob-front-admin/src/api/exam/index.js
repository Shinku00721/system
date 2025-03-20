import request from "@/utils/request";
const ExamApi = {
  //获取考题列表
  getExamList: (data) => {
    return request({
      url: '/examQuestion/loadDataList',
      params: data
    })
  },
}