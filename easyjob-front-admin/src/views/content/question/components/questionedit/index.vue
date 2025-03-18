<template>
  <div>
    <el-dialog v-model="dialogConfig.show" width="80%">
      <template #header>
        <h1 style="margin-bottom: 20px; font-size: 20px;">{{ dialogConfig.title }}</h1>
      </template>
      <el-form label-width="90px" :model="formData" :rules="rules" ref="formRef">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" ><el-input placeholder="请输入标题名称" v-model="formData.title"></el-input></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分类" >
              <CategorySelect :type="0" v-model="formData.categoryId"></CategorySelect>
            </el-form-item >
          </el-col>
          <el-col :span="6">
            <el-form-item label="难度"  >
              <el-rate v-model="formData.difficultyLevel" />
            </el-form-item>
          </el-col>
        </el-row>
       <el-row>
        <el-col :span="12"><el-form-item label="问题">
          <SunEditor v-model="formData.question"></SunEditor>
        </el-form-item></el-col>
        <el-col :span="12"><el-form-item label="答案分析">
          <SunEditor v-model="formData.answerAnalysis"></SunEditor>
        </el-form-item></el-col>
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
import { nextTick, onMounted, reactive, ref } from 'vue';
import { QuestionApi } from '@/api/question';
import { ElMessage } from 'element-plus';
const formRef = ref()
const formData = ref({})
const dialogConfig = ref({
  show:false,
  title:''
})

const rules = reactive({
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ],
  coverType: [
    { required: true, message: '请选择封面类型', trigger: 'change' }
  ],
  bgColor: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (formData.value.coverType === '0' && !value) {
          callback(new Error('请选择背景颜色'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  iconPath: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (formData.value.coverType === '1' && !value) {
          callback(new Error('请上传封面图片'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  type: [
    { required: true, message: '请选择分类类型', trigger: 'change' }
  ]
});
const emit = defineEmits(['reload'])


//点击确定的方法
const confirm = () => {
  let params = {}
  //新增用户
  Object.assign(params,formData.value)
  formRef.value.validate().then(() => {
    QuestionApi.saveOrUpdateQuestion(params).then(res => {
    ElMessage({
      message: '保存成功',
      type: 'success',
      duration:1500
    })
    emit('reload')  //刷新数据
    //关闭
    dialogConfig.value.show = false
  })
  }).catch(() => {
    ElMessage({
      message: '保存失败',
      type: 'error'
    })
  })
}

//点击取消的方法
const cancel = () => {
  //关闭
  dialogConfig.value.show = false
  formData.value = {}
}

//对外暴露的方法
const showDialog = (row={},) => {
  formData.value = {}
  dialogConfig.value.show = true //显示对话框
  nextTick(() => {
  formRef.value?.resetFields()
  console.log(row)
  if(row.questionId){
    //修改
    dialogConfig.value.title = '修改问题'
    const {questionId,title,categoryId,difficultyLevel,question,answerAnalysis} = row //拷贝对象
    formData.value = {questionId,title,categoryId,difficultyLevel,question,answerAnalysis}
    
  }else{
    dialogConfig.value.title = '新增问题'
     formData.value = {}
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