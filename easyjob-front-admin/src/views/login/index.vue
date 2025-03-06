<template>
  <div class="login">
    <div class="login-form">
      <p style="margin-bottom: 20px; font-size: 20px; font-weight:bold ;">easyjob后台管理系统</p>
      <el-form :model="loginForm" ref="loginFormRef" :rules="rules">
        <el-form-item prop="phone"><el-input v-model="loginForm.phone"  style="width: 400px; height: 45px;" placeholder="请输入手机号" /></el-form-item>
        <el-form-item prop="password"><el-input v-model="loginForm.password"  style="width: 400px; height: 45px;" placeholder="请输入密码" show-password/></el-form-item>
        <el-form-item prop="checkCode">
          <el-input v-model="loginForm.checkCode"  style="width: 300px; height: 45px;" placeholder="请输入验证码" />
          <img :src="checkCodeUrl" alt="" style="width: 100px; height: 45px;" @click="changeCheckCode">
        </el-form-item>
        <el-form-item><el-checkbox v-model="loginForm.rememberMe" label="记住我" size="large" /></el-form-item>
        <el-form-item><el-button type="primary" style="width: 400px; border-radius: 5px;" @click="login">登录</el-button></el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import md5 from 'js-md5';
import { useRouter } from 'vue-router';
let router = useRouter()
const { proxy } = getCurrentInstance()
const url = '/api/login'
//表单对象实例
const loginFormRef = ref()
//收集的表单数据
const loginForm = ref({
  phone:'',
  password:'',
  checkCode:'',
  rememberMe:false
})
//表单验证规则
const rules = reactive({
  phone:[{required:true,message:'请输入手机号',trigger:'blur'}],
  password:[{required:true,message:'请输入密码',trigger:'blur'}],
  checkCode:[{required:true,message:'请输入验证码',trigger:'blur'}]
})

//验证码
const checkCodeUrl = ref('/api/checkCode')
const changeCheckCode = () => {
  checkCodeUrl.value = '/api/checkCode?time=' + new Date().getTime()
}

//登录点击事件
const login = () => {
  //表单验证 ,valid是一个boolean,通过为true,失败为false
  loginFormRef.value.validate(async (valid) => {
    if(!valid){
      return
    }
    let params = {}
    Object.assign(params,loginForm.value) //收集数据
    //@ts-ignore,cookie存在不加密
    if(proxy.VueCookies.isKey('loginForm')){
      //@ts-ignore
      params.password = proxy.VueCookies.get('loginForm').password
    }else{
      //@ts-ignore
      params.password = md5(params.password)
    }
     //密码加密
    //@ts-ignore
    let result = await proxy.Request({
      url:'/login',
      params,
      errorCallback:() => {
        changeCheckCode() //刷新验证码
      }
    })
    if(!result){
      return
    }
    //@ts-ignore,勾选记住我
    if(params.rememberMe){
      // @ts-ignore ,存储cookie中
      proxy.VueCookies.set('loginForm',params,'7d')
      loginFormRef.value.resetFields()
      changeCheckCode()
    }else{
      //@ts-ignore
      proxy.VueCookies.remove('loginForm')
    }
    //@ts-ignore
    proxy.Message.success('登录成功')
    sessionStorage.setItem('userInfo',JSON.stringify(result))
    let firstMenu = result.menuList[0]
    if(firstMenu.children.length > 0){
      firstMenu = firstMenu.children[0]
    }
    router.push(firstMenu.menuUrl)

  })
}

//加载
onMounted(() => {
  changeCheckCode()
  //@ts-ignore判断是否存在cookie
  if(proxy.VueCookies.isKey('loginForm')){
    //@ts-ignore
    loginForm.value = proxy.VueCookies.get('loginForm')
    loginForm.value.checkCode = ''
  }
})
</script>

<style scoped lang="scss">
.login{
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/login-bg.jpg") no-repeat center right;
  background-size:200% 200%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form{
    width: 500px;
    height: 370px;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 35px;
    border-radius: 5px;
    box-shadow: 7px 7px 40px rgba(0, 0, 0, 0.4);
    .el-form-item:nth-child(3){
      margin-bottom: 5px;
    }
    .el-form-item:nth-child(4) {
      margin-bottom: 5px;
    }
  }
}
</style>