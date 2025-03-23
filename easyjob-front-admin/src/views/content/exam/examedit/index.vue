<template>
  <div>
    <el-dialog v-model="dialogConfig.show" width="80%">
      <template #header>
        <h1 style="margin-bottom: 20px; font-size: 20px;">{{ dialogConfig.title }}</h1>
      </template>
      <el-form label-width="90px" :model="formData" :rules="rules" ref="formRef">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title"><el-input placeholder="请输入标题名称" v-model="formData.title"></el-input></el-form-item>
            <el-form-item label="分类" style="width: 300px;" prop="categoryId">
              <CategorySelect :type="0" v-model="formData.categoryId"></CategorySelect>
            </el-form-item>
            <el-form-item label="难度" prop="difficultyLevel">
              <el-rate v-model="formData.difficultyLevel" />
            </el-form-item>
            <el-form-item label="问题类型" prop="questionType">
              <el-radio-group v-model="formData.questionType" @change="changeQuestionType">
                <el-radio :value="item.value*1" v-for="(item,index) in questionTypeList" :key="index" :disabled="formData.questionId">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="答案选项" v-if="formData.questionType !== 0" >
              <div v-for="(item,index) in formData.questionItemList" :key="index">
                <div style="width: 100%; display: flex; align-items: center;margin: 10px 0px;">
                  <div style="font-size: 20px;">{{ AnswerType[index] }}</div>
                  <el-form-item :rules="{required:true,message:'请输入选项内容',trigger: 'blur'}" :prop="`questionItemList.`+ index+ `.title`"><el-input style="width: 300px; margin: 0px 10px;" placeholder="请输入答案" v-model="item.title" ></el-input></el-form-item>
                  <el-icon size="25px" @click="addQuestionItem" v-if="index==0"><Plus></Plus></el-icon>
                  <el-icon size="25px" @click="delQuestionItem" v-if="index>0"><Minus></Minus></el-icon>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="答案" prop="questionAnswer">
              <template v-if="formData.questionType == '0'">
                <el-radio-group v-model="formData.questionAnswer">
                  <el-radio value="1" >正确</el-radio>
                  <el-radio value="0" >错误</el-radio>
                </el-radio-group>
              </template>
              <template v-if="formData.questionType == 1">
                <el-radio-group v-model="formData.questionAnswer">
                  <el-radio :value="index + ''" v-for="(item,index) in formData.questionItemList" :key="index">{{ AnswerType[index] }}</el-radio>
                </el-radio-group>
              </template>
              <template v-if="formData.questionType == 2">
                <el-checkbox-group v-model="formData.questionAnswer">
                  <el-checkbox :value="index + ''" v-for="(item,index) in formData.questionItemList" :key="index" :label="AnswerType[index]"></el-checkbox>
                </el-checkbox-group>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题" style="height: 300px;">
              <SunEditor v-model="formData.question"></SunEditor>
            </el-form-item>
            <el-form-item label="答案分析" style="height: 300px;" prop="answerAnalysis">
              <SunEditor v-model="formData.answerAnalysis"></SunEditor>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
      <div>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </div>
    </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { QuestionApi } from '@/api/question';
import { ExamType,AnswerType } from '@/utils/constant';
import { ElMessage } from 'element-plus';
import { ExamApi } from '@/api/exam';
import message from '@/utils/message';
const formRef = ref()
const formData = ref({})
const dialogConfig = ref({
  show:false,
  title:''
})


const rules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'blur' }
  ],
  difficultyLevel:[
    { required: true, message: '请选择难度', trigger: 'blur' }
  ],
  questionType:[{required:true,message:'请选择问题类型',trigger:'blur'}],
  questionAnswer: [
    { required: true, message: '请选择答案', trigger: 'blur' }
  ],
  answerAnalysis: [
    { required: true, message: '请输入答案解析', trigger: 'blur' }
  ]
});
const emit = defineEmits(['reload'])

//计算问题类型属性
const questionTypeList = computed(() => {
  let questionTypeArray = []
  for(let item in ExamType){
    questionTypeArray.push({
      label: ExamType[item],
      value: item
    })
  }
  return questionTypeArray
})


//点击确定的方法
const confirm = () => {

  let params = {}
  //新增用户
  Object.assign(params,formData.value)
  
  formRef.value.validate().then(() => {
    //ToDo 验证 是否重复
    if(isRepeat(params.questionItemList)){
      ElMessage({
        message: '选项不能重复',
        type: 'warning'
      })
      return
    }
    if(params.questionType == 2){
      params.questionAnswer = params.questionAnswer.join(',')  //转换字符串
    }
    if(params.questionType !== 0){
      params.questionItemListJson = JSON.stringify(params.questionItemList)
    }
    delete params.questionItemList 
    ExamApi.saveExam(params).then(res => {
    ElMessage({
      message: '保存成功',
      type: 'success',
      duration:1500
    })
    emit('reload')  //刷新数据
    //关闭
    dialogConfig.value.show = false
  }).catch((err) => {
    ElMessage({
      type:'error',
      message: err.message
    })
  })
  })
}

//验证表单重复
const isRepeat = (array) => {
  var temMap = {}
  for(let i in array){
    if(temMap[array[i].title]){
      return true
    }
    temMap[array[i].title] = true
  }
  return false
}

//点击取消的方法
const cancel = () => {
  //关闭
  dialogConfig.value.show = false
  formData.value = {}
}


//点击加号
const addQuestionItem = () => {
  if(formData.value.questionItemList.length >= 4){
    ElMessage({
      message: '最多添加4个选项',
      type: 'error'
    })
    return
  }
  formData.value.questionItemList.push({
    title:'',
    sort:formData.value.questionItemList.length+1
  })
}
//点击减号
const delQuestionItem = () => {
  formData.value.questionItemList.pop()
  if(formData.value.questionType == 2){
    formData.value.questionAnswer.pop()
  }
  if(formData.value.questionType == 1){
    if(formData.value.questionItemList.length-1 < formData.value.questionAnswer){
      formData.value.questionAnswer = null
    }
  }
}

//切换问题类型
const changeQuestionType = (val) => {
  if(val == 2){
    //清空选项
    formData.value.questionAnswer = []
  }else{
    formData.value.questionAnswer = undefined
  }
}

//对外暴露的方法
const showDialog = (row={},) => {
  formData.value = {}
  dialogConfig.value.show = true //显示对话框
  nextTick(() => {
  formRef.value?.resetFields()
  // console.log(row)
  if(row.questionId){
    //修改
    dialogConfig.value.title = '修改考题'
    Object.assign(formData.value,row)
    ExamApi.getExamItem({questionId:row.questionId}).then((res) => {
      formData.value.questionItemList = res //获取选项
    })
    if(formData.value.questionType == 2){
      formData.value.questionAnswer = formData.value.questionAnswer.split(',')
    }
    delete formData.value.status
    // console.log(formData.value.questionAnswer)
  }else{
    dialogConfig.value.title = '新增考题'
     formData.value = {}
     formData.value.questionItemList = [{
      title:'',
      sort:1
     }]
  }
  })
}


defineExpose({
  showDialog
})

</script>

<style scoped lang="scss">
.cover-upload{
  width: 100%;
  height: 100px;
  display: block;
  margin-bottom: 20px;
}
</style>