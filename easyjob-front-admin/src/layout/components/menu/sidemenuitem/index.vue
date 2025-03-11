<template>
  <div>
    <!-- 当不存在子路由的时候 -->
    <div v-if="!route.children">
      <el-menu-item :index="route.menuUrl">
        <template #title>
            <el-icon></el-icon>
            <span>{{ route.menuName }}</span>
          </template>
      </el-menu-item>
    </div>
    <!-- 存在子路由的时候 -->
     <div v-if="route.children&& route.children.length>1">
      <el-sub-menu :index="route.menuUrl">
        <template #title>
            <el-icon></el-icon>
            <span>{{ route.menuName }}</span>
          </template>
        <SideMenuItem v-for="(item,index) in route.children" :key="index" :route="item"></SideMenuItem>
      </el-sub-menu>
     </div>

     <!-- 存在子路由并且只有一个的时候 -->
      <div v-if="route.children && route.children.length == 1">
        <el-menu-item :index="route.menuUrl">
        <template #title>
            <el-icon></el-icon>
            <span>{{ route.menuName }}</span>
          </template>
      </el-menu-item>
      </div>
  </div>
</template>

<script setup>
defineProps(['route'])
</script>
<script>
export default {
  name:'SideMenuItem'
}
</script>
<style lang="scss" scoped>

</style>