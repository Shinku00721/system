<template>
  <div  class="role">
        <el-card>
      <el-form label-width="70px" class="role-form">
        <el-row >
          <el-form-item label="加入时间" style="width: 300px;">
            <el-date-picker
              v-model="searchForm"
              type="daterange"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="邮箱" style="width: 300px;">
            <el-input placeholder="请输入邮箱"></el-input>
          </el-form-item>      
          <el-form-item label="设备ID" style="width: 300px;">
            <el-input placeholder="请输入设备Id"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="loadAppUserList">查询</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px;">
      <Table 
      ref="tableInfoRef" 
      :column="columns" 
      :dataSource="tableData"
      :options="tableOptions"
      :pageOptions="pageOption"
      @reload="loadAppUserList"
      @rowSelect="select"
      >
      
      </Table>
    </el-card>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { AppApi } from '@/api/app';
import { ElMessage } from 'element-plus';
import { ElMessageBox } from 'element-plus';
const searchForm = ref({
})
const questionEditRef = ref()
const showDetailRef = ref()
const tableData = ref([])
const questionIdList = ref([])
const pageOption = ref({
  total:12, //设置总条数
  pageSize:5, //设置每页显示条数
  currentPage:1 
})
const tableOptions = ref({
  showSelection:true,
  showIndex:false,
  showPage:true
})
const columns = ref([
  {
    label:"邮箱",
    prop:'questionId',
    width:'70'
  },
  {
    label:'昵称',
    prop:'title',
    scopedSlots:'title'
  },
  {
    label:'加入时间',
    prop:'categoryName',
    width:'100'
  },
  {
    label:'最后登录时间',
    prop:'createUserName',
    width:'100'
  },
  {
    label:'登录设备',
    // prop:'status',
    // formatter:(row) => {
    //   return row.status === 1 ? '正常' : '禁用'
    // }
    prop:'createTime',
    width:'200'
  },
  {
    label:'设备品牌',
    scopedSlots:'difficultyLevel'
  },
  {
    width:'最后登录ip',
    label:'发布状态',
    scopedSlots:'status'
  },
  {
    width:'状态',
    label:'发布状态',
    scopedSlots:'status'
  },
  {
    label:'操作',
    scopedSlots:'operation'
  }
])
//获取app用户信息的方法
const loadAppUserList = () => {
  let params = {pageNo:pageOption.value.currentPage,pageSize:pageOption.value.pageSize}
  Object.assign(params,searchForm.value)
  AppApi.getAppUserList(params).then(res => {
  // console.log(res)
  // console.log(123)
  tableData.value  = res.list
  pageOption.value.total = res.totalCount
})
}


onMounted(() => {
  nextTick(() => {
    loadAppUserList() //获取app用户信息
  })
})
</script>

<style lang="scss" scoped>
.role-form{
  width: 100%;
}

</style>