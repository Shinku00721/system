<template>
  <div>
    <el-dialog v-model="dialogConfig.show" width="600px">
      <template #header>
        <h1 style="margin-bottom: 20px; font-size: 20px;">{{ dialogConfig.title }}</h1>
      </template>
      <el-form label-width="90px" :model="formData" :rules="rules" ref="formRef">
        <el-form-item label="分类名称" prop="categoryName"><el-input placeholder="请输入分类名称" v-model="formData.categoryName"></el-input></el-form-item>
        <el-form-item label="封面类型">
          <el-radio-group v-model="formData.coverType">
            <el-radio value="0">背景颜色</el-radio>
            <el-radio value="1">图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="背景颜色" v-if="formData.coverType == 0">
          <el-color-picker v-model="formData.bgColor"/>
        </el-form-item>
        <el-item-form v-if="formData.coverType == 1" class="cover-upload">
          <CoverUpload v-model="formData.iconPath" :type="0"></CoverUpload>
        </el-item-form>
        <el-form-item label="类型">
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


//表单校验
// const validatorPhone = (rule,value,callback) => {
//   // 校验手机号
//   if (!/^1[3-9]\d{9}$/.test(value)) {
//     callback(new Error('手机号格式不正确'))
//   } else {
//     callback()
//   }
// }
// const validatorRePassword = (rule,value,callback) => {
//   if(formData.value.password != value){
//     callback(new Error('两次密码不一致'))
//   }else{
//     callback()
//   }
// }
// const rules = reactive({
//   userName:[{required: true, message: '请输入用户名', trigger: 'blur'}],
//   phone:[{required: true, message: '请输入正确的手机号', trigger: 'blur',validator:validatorPhone}],
//   password:[{required: true, message: '请输入密码', trigger: 'blur',min:8}],
//   rePassword:[{required: true, message: '请再次输入密码', trigger: 'blur',validator:validatorRePassword}],
//   roles:[{required: true, message: '请选择角色', trigger: 'blur'}],
// })
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