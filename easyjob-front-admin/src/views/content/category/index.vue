<template>
  <div  class="role">
    <el-card>
      <el-button type="primary" size="default" @click="addCategory">新增分类</el-button>    
    </el-card>
    <el-card style="margin-top: 10px;">
      <Table 
      ref="tableInfoRef" 
      :column="columns" 
      :dataSource="tableData"
      :options="tableOptions"
      :extHeight="tableOptions.extHeight"
      @row-click="handleRowClick"
      >
        <template #img="{row}">
          <Cover :cover="row.iconPath" :title="row.categoryName" :bgColor="row.bgColor"></Cover>
        </template>
        <template #type="{row}">
            <span v-if="row.type=='0'"> 问题分类 </span>
            <span v-if="row.type=='1'"> 考题分类 </span>
            <span v-if="row.type=='2'"> 问题/考题分离 </span>
        </template>
        <template #operation="{row}">
          <slot>
            <el-button type="primary" size="small" @click="updateCategory(row)">修改</el-button>
            <el-button type="primary" size="small" @click="delCategory(row)">删除</el-button>
            <el-button type="primary" size="small" @click="updatePassword(row)">上移</el-button>
            <el-button type="primary" size="small" @click="updateStatus(row)">下移</el-button>
          </slot>
        </template>
      </Table>
    </el-card>
    <!-- 新增修改分类数据 -->
    <CategoryEdit ref="categoryEditRef" @reload="loadCategoryList"></CategoryEdit>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import CategoryEdit from './components/categoryedit/index.vue'
import { CategoryApi } from '@/api/category';
import { ElMessage } from 'element-plus';
import { ElMessageBox } from 'element-plus';
const categoryEditRef = ref()
const tableData = ref([])
const tableOptions = ref({
  showSelection:false,
  showIndex:false,
  extHeight:125
})
const columns = ref([
  {
    label:"封面",
    scopedSlots:'img'
  },
  {
    label:'分类名称',
    prop:'categoryName'
  },
  {
    width:300,
    label:'类型',
    scopedSlots:'type'
  },

  {
    width:300,
    label:'操作',
    scopedSlots:'operation'
  }
])


//获取分类信息的方法
const loadCategoryList = () => {
  CategoryApi.getAllCategory().then(res => {
  tableData.value = res
})
}



//删除用户信息的方法
const delCategory = (row) => {
  ElMessageBox.confirm(
    '你确定要删除吗？',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then( () => {
    let params = {categoryId:row.categoryId}
    CategoryApi.delCategory(params).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      loadCategoryList() //刷新数据
    }).catch(() => {
      ElMessage({
      type: 'warning',
      message: '删除失败',
    })
    })
    
  }).catch(() => {
    ElMessage({
      type: 'warning',
      message: '取消删除',
    })
  })
}

//新增用户的方法
const addCategory = () => {
  categoryEditRef.value.showDialog()
}
//修改角色的方法
const updateCategory = (row) => {
  categoryEditRef.value.showDialog(row)
}



onMounted(() => {
  nextTick(() => {
    loadCategoryList() //获取分类信息
  })
})
</script>

<style lang="scss" scoped>

</style>