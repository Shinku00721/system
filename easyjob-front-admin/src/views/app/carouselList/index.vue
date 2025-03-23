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
      >
        <template #img="{row}">
          <Cover :cover="row.imgPath" :title="row.categoryName" :bgColor="row.bgColor"></Cover>
        </template>
        <template #type="{row}">
            <span > {{ CarouseType[row.objectType] }} </span>
        </template>
        <template #Object="{row}">
            <div v-if="row.objectType == 3">{{ row.outerLink }}</div>
            <div v-else>{{ row.objectId }}</div>
        </template>
        <template #operation="{row}">
          <slot>
            <el-button type="primary" size="small" @click="updateCategory(row)">修改</el-button>
            <el-button type="primary" size="small" @click="delCarouse(row)">删除</el-button>
            <el-button type="primary" size="small" @click="updatePassword(row)">上移</el-button>
            <el-button type="primary" size="small" @click="updateStatus(row)">下移</el-button>
          </slot>
        </template>
      </Table>
    </el-card>
    <!-- 新增修改分类数据 -->
    <CarouseEdit ref="carouseEditRef" @reload="loadCarouseList"></CarouseEdit>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import CarouseEdit from './components/carouseedit/index.vue'
import { AppApi } from '@/api/app';
import {CarouseType} from '@/utils/constant'
import { ElMessage } from 'element-plus';
import { ElMessageBox } from 'element-plus';
const carouseEditRef = ref()
const tableData = ref([])
const tableOptions = ref({
  showSelection:false,
  showIndex:false,
  extHeight:125
})
const columns = ref([
  {
    label:"轮播图",
    prop:'imgPath',
    width:330,
    scopedSlots:'img'
  },
  {
    label:'类型',
    prop:'objectType',
    scopedSlots:'type'
  },
  {
    label:'主体ID/链接',
    prop:'object',
    scopedSlots:'Object'
  },

  {
    label:'操作',
    scopedSlots:'operation'
  }
])


//获取轮播图的方法
const loadCarouseList = () => {
  AppApi.getAppCarouselList().then(res => {
  tableData.value = res
})
}

//删除用户信息的方法
const delCarouse= (row) => {
  ElMessageBox.confirm(
    '你确定要删除吗？',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then( () => {
    let params = {carouselId:row.carouselId}
    AppApi.deleteAppCarousel(params).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      loadCarouseList() //刷新数据
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
  carouseEditRef.value.showDialog()
}
//修改角色的方法
const updateCategory = (row) => {
  carouseEditRef.value.showDialog(row)
}

onMounted(() => {
  nextTick(() => {
    loadCarouseList() //获取分轮播图信息
  })
})
</script>

<style lang="scss" scoped>

</style>