<template>
  <div>
    <el-dialog v-model="dialogConfig.show" width="600px">
      <template #header>
        <h1 style="margin-bottom: 20px; font-size: 20px;">{{ dialogConfig.title }}</h1>
      </template>
      <el-form label-width="100px" :model="formData" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="userName"><el-input placeholder="请输入用户名称" v-model="formData.userName"></el-input></el-form-item>
        <el-form-item label="手机号" prop="phone"><el-input placeholder="请输入手机号" v-model="formData.phone"></el-input></el-form-item>
        <template v-if="dialogConfig.title == '新增用户'">
          <el-form-item label="密码" prop="password"><el-input placeholder="请输入密码" type="password" show-password v-model="formData.password"></el-input></el-form-item>
          <el-form-item label="确认密码" prop="rePassword"><el-input placeholder="请再次输入密码" type="password"  show-password v-model="formData.rePassword"></el-input></el-form-item>
        </template>
        <el-form-item label="职位"><el-input placeholder="请输入职位" v-model="formData.position"></el-input></el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-checkbox-group v-model="formData.roles" v-for="(item,index) in userRole" :key="index" style="margin-right: 10px;">
            <el-checkbox :label="item.roleName" :value="item.roleId + ''" />
          </el-checkbox-group>
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
import { RoleAPI } from '@/api/role/index'
import { ElMessage } from 'element-plus';
import { UserAPi } from '@/api/user';
const formRef = ref()
const props = defineProps({
  data:{
    type:Object,
    default:{}
  },
  treeData:{
    type:Array,
    default:[]
  }
})

const formData = ref({})
const userRole = ref({})
const dialogConfig = ref({
  show:false,
  title:''
})
//表单校验
const validatorPhone = (rule,value,callback) => {
  // 校验手机号
  if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('手机号格式不正确'))
  } else {
    callback()
  }
}
const validatorRePassword = (rule,value,callback) => {
  if(formData.value.password != value){
    callback(new Error('两次密码不一致'))
  }else{
    callback()
  }
}
const rules = reactive({
  userName:[{required: true, message: '请输入用户名', trigger: 'blur'}],
  phone:[{required: true, message: '请输入正确的手机号', trigger: 'blur',validator:validatorPhone}],
  password:[{required: true, message: '请输入密码', trigger: 'blur',min:8}],
  rePassword:[{required: true, message: '请再次输入密码', trigger: 'blur',validator:validatorRePassword}],
  roles:[{required: true, message: '请选择角色', trigger: 'blur'}],
})
const emit = defineEmits(['reload'])

//获取所有的角色信息
const getUserRole = () => {
  RoleAPI.loadRoles().then(res=>{
    userRole.value = res
  })
}
getUserRole()
//点击确定的方法
const confirm = () => {
  let params = {}
  params = {
    // userId:formData.value.userId,
    phone:formData.value.phone,
    userName:formData.value.userName,
    password:formData.value.password,
    position:formData.value.position,
    roles:formData.value.roles
  }
  if(formData.value.userId){
    params.userId = formData.value.userId
  }
  // if(treeShow.value){
  //   //收集菜单信息
  //   let menuIdArr = menuTreeRef.value.getCheckedKeys()
  //   let halfMenuIdArr = menuTreeRef.value.getHalfCheckedKeys()
  //   params.menuIds = menuIdArr.join(',')
  //   params.halfMenuIds = halfMenuIdArr.join(',')
  // }
  formRef.value.validate().then(() => {
    UserAPi.saveOrUpdateUser(params).then(res => {
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
  userRole.value = {}
  dialogConfig.value.show = true //显示对话框
  nextTick(() => {
  formRef.value?.resetFields()
  if(row.userId){
    //修改
    dialogConfig.value.title = '修改用户'
    getUserRole()
    Object.assign(formData.value,row)
    formData.value.roles = row.roles.split(',')
  }else{
    dialogConfig.value.title = '新增用户'
    getUserRole()
  }
  })
}

defineExpose({
  showDialog
})

</script>

<style scoped lang="scss">

</style>