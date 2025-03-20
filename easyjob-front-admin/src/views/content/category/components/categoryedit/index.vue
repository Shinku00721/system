<template>
  <div>
    <el-dialog v-model="dialogConfig.show" width="600px">
      <template #header>
        <h1 style="margin-bottom: 20px; font-size: 20px;">{{ dialogConfig.title }}</h1>
      </template>
      <el-form label-width="90px" :model="formData" :rules="rules" ref="formRef">
        <el-form-item label="分类名称" prop="categoryName"><el-input placeholder="请输入分类名称" v-model="formData.categoryName"></el-input></el-form-item>
        <el-form-item label="封面类型" prop="coverType">
          <el-radio-group v-model="formData.coverType">
            <el-radio value="0">背景颜色</el-radio>
            <el-radio value="1">图片</el-radio>
          </el-radio-group>
        </el-form-item >
        <el-form-item label="背景颜色" v-if="formData.coverType == 0" prop="bgColor">
          <el-color-picker v-model="formData.bgColor"/>
        </el-form-item>
        <el-form-item v-if="formData.coverType == 1" class="cover-upload" prop="iconPath">
          <CoverUpload v-model="formData.iconPath" :type="0"></CoverUpload>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :value="0">问题分类</el-radio>
            <el-radio :value="1">考题分类</el-radio>
            <el-radio :value="2">问题/考题分类</el-radio>
          </el-radio-group>
        </el-form-item>
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
import { CategoryApi } from '@/api/category';
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
  if(formData.value.coverType == 0){
    delete params.iconPath
  }else if(formData.value.coverType == 1){
    delete params.bgColor
  }
  formRef.value.validate().then(() => {
    CategoryApi.saveCategory(params).then(res => {
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
  if(row.categoryId){
    //修改
    dialogConfig.value.title = '修改分类'
    const {categoryName,type,categoryId} =row
    formData.value = {categoryName,type,categoryId}
    if(row.bgcolor !== null && row.bgcolor !== ''){
      //背景颜色图
      formData.value.coverType = '0'
      formData.value.bgColor = row.bgColor
    }else if(true){
      //图片
      formData.value.coverType = '1'
      formData.value.iconPath = row.iconPath
    }
    
  }else{
    dialogConfig.value.title = '新增分类'
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