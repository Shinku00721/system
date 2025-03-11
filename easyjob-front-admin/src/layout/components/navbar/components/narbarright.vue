<template>
  <div class="right">
    <!-- 搜索 -->
     <el-icon><Search></Search></el-icon>
    <!-- 全屏模式 -->
    <el-icon><FullScreen></FullScreen></el-icon>
    <!-- 切换语言 -->
    <el-icon>中</el-icon>
    <!-- 消息中心 -->
    <el-icon><Notification></Notification></el-icon>
    <!-- 用户的头像和用户名信息 -->
    <el-dropdown  trigger="click">
      <div>
        <img src="" alt="" style="width: 40px; height: 40px;border-radius: 50px;margin-right: 5px;">
        <span style="font-size: 16px;"></span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 设置 -->
    <el-icon><Setting></Setting></el-icon>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.right{
  width: 260px;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>