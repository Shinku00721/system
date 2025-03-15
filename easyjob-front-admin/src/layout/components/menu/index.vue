<template>
  <div>
    <el-menu router :default-active="$route.path">
      <SideMenuItem v-for="(item,index) in menuList" :key="index" :route="item"></SideMenuItem>
    </el-menu>
  </div>
</template>

<script setup>
import SideMenuItem from './sidemenuitem/index.vue'
defineProps(['menuList'])

</script>

<style lang="scss" scoped>

</style>