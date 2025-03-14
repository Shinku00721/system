<template>
  <div class="menu">
    <el-card style="width: 49%;">
      <template #header>
        <div >
          <span>菜单管理</span>
        </div>
      </template>
      <el-tree
      ref="treeRef"
      style="max-width: 600px;"
      :data="menuList"
      node-key="menuId"
      default-expand-all
      :highlight-current="true"
      :expand-on-click-node="false"
      :props="defaultProps"
      @node-click="clickNode"
      @current-change="currentChange"
    >
      <template #default="{ node, data }">
        
        <div class="custom-tree-node">
          <span>{{node.label}}</span>
          <div class="tree-btn">
            <el-dropdown trigger="click">
              <span>==</span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="showEditDialog('add')">添加子菜单</el-dropdown-item>
                    <el-dropdown-item v-if="data.pId !== -1" @click="showEditDialog('edit',nodeForm)">修改</el-dropdown-item>
                    <el-dropdown-item v-if="data.pId !== -1" @click="del">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
            </el-dropdown>
          </div>
        </div>
      </template>
    </el-tree>
    </el-card>
    <el-card style="width: 49%;">
      <template #header>
        <div >
          <span>菜单管理</span>
        </div>
      </template>
      <el-form :model="nodeForm">
        <el-form-item label="菜单id">{{ nodeForm.menuId }}</el-form-item>
        <el-form-item label="菜单名称">{{ nodeForm.menuName }}</el-form-item>
        <el-form-item label="菜单层级">
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item v-for="(item,index) in menuName" :key="index">{{ item }}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-form-item>
        <el-form-item label="菜单类型">{{ nodeForm.menuType === 0?'菜单':'按钮' }}</el-form-item>
        <el-form-item label="请求路径">{{ nodeForm.menuUrl?nodeForm.menuUrl:'--' }}</el-form-item>
        <el-form-item label="权限编码">{{ nodeForm.permissionCode }}</el-form-item>
        <el-form-item label="菜单图标">{{ nodeForm.icon }}</el-form-item>
        <el-form-item label="排序号">{{ nodeForm.sort }}</el-form-item>
      </el-form>
    </el-card>
    <MenuEdit ref="menuEdit" :data="currentNode" :treeData="menuList" @reload="getMenuList"></MenuEdit>
  </div>
</template>

<script setup>
import { MenuAPI } from '@/api/menu';
import { nextTick, onMounted, ref } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue'
import MenuEdit from './components/menuedit/index.vue'
const menuList = ref([])
const treeRef = ref()
// 配置项
const defaultProps = {
  label:'menuName',
  children:'children',
  value:'menuId'
}

//展示子节点的菜单数据
const nodeForm =ref({})
let menuName = ref([])
let currentNode = ref()
const clickNode = (data,node) => {
  //展示的数据
  Object.assign(nodeForm.value,data)
  if(menuName.value.length>0){
    menuName.value =[]
  }
  menuName.value = getMenuName(node,menuName.value)
  currentNode.value = node
}

const currentChange = (data,node) => {
  menuName.value =[]
}
const getMenuName = (node,name) => {
  if(node.data.menuName){
    name.unshift(node.data.menuName)
    if(node.parent.data.menuName){
      getMenuName(node.parent,name)
    }
  }
  return name
}

const getMenuList = async () => {
  //获取全部的菜单数据
  let result = await MenuAPI.getMenuList()
  menuList.value = result
}

onMounted(async () => {
  let result = await MenuAPI.getMenuList()
  menuList.value = result
  let first = result[0].children[0]
  nextTick(() => {
    treeRef.value.setCurrentKey(first.menuId)
    const currentNode =  treeRef.value.getNode(first.menuId)
    clickNode(currentNode.data,currentNode)
  })
})

//新增或删除的方法
const menuEdit = ref()
const showEditDialog = (type,nodeForm) => {
  menuEdit.value.showEditDialog(type,nodeForm)  //显示对话框
}

const del = async () => {
  let params = {menuId:currentNode.value.data.menuId}
  await MenuAPI.delMenu(params)
  let result = await MenuAPI.getMenuList()
  menuList.value = result
  let first = result[0].children[0]
  nextTick(() => {
    treeRef.value.setCurrentKey(first.menuId)
    const currentNode =  treeRef.value.getNode(first.menuId)
    clickNode(currentNode.data,currentNode)
  })
}
</script>

<style lang="scss" scoped>
.menu{
  display: flex;
  justify-content: space-between;
  .custom-tree-node{
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>