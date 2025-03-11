<template>
  <div class="navbar">
    <div class="left">
      <!-- 收缩菜单的图标 -->
      <el-icon style="margin-right: 5px;"><Fold></Fold></el-icon>
      <!-- 面包屑 -->
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <NavBarRight></NavBarRight>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'
import NavBarRight from './components/narbarright.vue'
</script>

<style scoped lang="scss">
  .navbar{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left{
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
</style>