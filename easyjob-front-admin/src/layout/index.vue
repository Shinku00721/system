<template>
  <div class="layout">
    <el-container>
      <el-aside width="200px" class="layout-aside">
        <!-- 展示logo -->
        <Logo class="logo"></Logo>
        <!-- 展示菜单栏 -->
        <Menu :menuList="menuList" class="menu"></Menu>
      </el-aside>
      <el-container class="layout-container">
        <el-header class="header">
          <Navbar></Navbar>
        </el-header>
        <el-main class="main">
          <Main></Main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup >
import { reactive, ref ,onMounted} from 'vue'
import Navbar from './components/navbar/index.vue'
import Menu from './components/menu/index.vue'
import Logo from './components/logo/index.vue'
import Main from './components/main/index.vue'
//获取菜单栏数据
const menuList = reactive(JSON.parse(sessionStorage.getItem('userInfo')).menuList)
onMounted(() => {
  console.log(JSON.parse(sessionStorage.getItem('userInfo')).menuList)
})
</script>

<style scoped lang="scss">
.layout{
  width: 100vw;
  height: 100vh;
  .layout-aside{
    display: flex;
    flex-direction: column;
    position: fixed;
    .logo{
      height: 80px;
    }
    .menu{
      height: calc(100vh - 80px);
    }
  }
  .layout-container{
    display: flex;
    flex-direction: column;
    margin-left: 200px;
  }
}
</style>