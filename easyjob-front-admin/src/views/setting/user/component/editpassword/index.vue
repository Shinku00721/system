<template>
  <div>
    <el-dialog v-model="dialogConfig.show" width="600px">
      <template #header>
        <h1 style="margin-bottom: 20px; font-size: 20px;">{{ dialogConfig.title }}</h1>
      </template>
      <el-form label-width="100px" :model="formData" :rules="rules" ref="formRef">
        <el-form-item label="用户名">{{ formData.userName }}</el-form-item>
        <el-form-item label="密码" prop="password"><el-input placeholder="请输入密码" type="password" show-password v-model="formData.password"></el-input></el-form-item>
        <el-form-item label="确认密码" prop="rePassword"><el-input placeholder="请再次输入密码" type="password"  show-password v-model="formData.rePassword"></el-input></el-form-item>
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
import { RoleAPI } from '@/api/role/index'
import { ElMessage } from 'element-plus';
import { UserAPi } from '@/api/user';
const formRef = ref()

const formData = ref({})

const dialogConfig = ref({
  show:false,
  title:'修改密码'
})
//表单校验
const validatorRePassword = (rule,value,callback) => {
  if(formData.value.password != value){
    callback(new Error('两次密码不一致'))
  }else{
    callback()
  }
}
const rules = reactive({

  password:[{required: true, message: '请输入密码,最少8位', trigger: 'blur',min:8}],
  rePassword:[{required: true,  trigger: 'blur',validator:validatorRePassword}],

})



//点击确定的方法
const confirm = () => {
  let params = {}
  params = {
    userId:formData.value.userId,
    password:formData.value.password,
  }

  formRef.value.validate().then(() => {
    UserAPi.updateUserPassword(params).then(res => {
    ElMessage({
      message: '保存成功',
      type: 'success',
      duration:1500
    })
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
  formRef.value?.resetFields() //重置表单

  Object.assign(formData.value,row)

  })
}

defineExpose({
  showDialog
})

</script>

<style scoped lang="scss">

</style>