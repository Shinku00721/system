<template>
  <div  class="role">
        <el-card>
      <el-form label-width="70px" class="role-form">
        <el-row >
          <el-form-item label="加入时间" style="width: 300px;">
            <el-date-picker
              v-model="searchForm.createTimeRange"
              type="daterange"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="最近使用时间" style="width: 300px;" label-width="100px">
            <el-date-picker
              v-model="searchForm.lastUseTimeRange"
              type="daterange"
              format="YYYY/MM/DD"
              value-format="YYYY-MM-DD"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="品牌" style="width: 250px;">
            <el-input placeholder="请输入品牌" v-model="searchForm.deviceBrandFuzzy"></el-input>
          </el-form-item>      
          <el-form-item label="设备ID" style="width: 250px;">
            <el-input placeholder="请输入设备Id" v-model="searchForm.lastUseDeviceId"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="loadDeviceList">查询</el-button>
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
const searchForm = ref({
})
const tableData = ref([])
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
    label:"登陆设备",
    prop:'deviceId',
  },
  {
    label:'设备品牌',
    prop:'deviceBrand',
  },
  {
    label:'加入时间',
    prop:'createTime',
  },
  {
    label:'最后登录时间',
    prop:'lastUseTime',
  },
  {
    label:'登录ip',
    prop:'ip',
  },
])
//获取设备信息的方法
const loadDeviceList = () => {
  let params = {pageNo:pageOption.value.currentPage,pageSize:pageOption.value.pageSize}
  Object.assign(params,searchForm.value)
  if(searchForm.value.createTimeRange){
    params.createTimeStart = searchForm.value.createTimeRange[0]
    params.createTimeEnd = searchForm.value.createTimeRange[1]
  }
  if(searchForm.value.lastUseTimeRange){
    params.lastUsrTimeStart = searchForm.value.lastUseTimeRange[0]
    params.lastUsrTimeEnd = searchForm.value.lastUseTimeRange[1]
  }
  AppApi.getDeviceList(params).then(res => {
  // console.log(res)
  // console.log(123)
  tableData.value  = res.list
  pageOption.value.total = res.totalCount
})
}


onMounted(() => {
  nextTick(() => {
    loadDeviceList() //获取设备信息
  })
})
</script>

<style lang="scss" scoped>
.role-form{
  width: 100%;
}

</style>