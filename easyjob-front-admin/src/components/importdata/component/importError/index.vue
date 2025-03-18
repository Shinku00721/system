<template>
  <div>
    <el-dialog v-model="show">
      <Table
      ref="tableInfoRef" 
      :column="columns" 
      :dataSource="tableData"
      :options="tableOptions"
      >

      </Table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const tableData = ref()
const tableOptions = ref({
  showSelection:false,
  showIndex:true,
  showPage:false
})
const columns = ref([
  {
    label:'错误行',
    prop:'rowNum'
  },
  {
    label:'错误信息',
    prop:'errorItemList'
  }
])
const show = ref(false)
const showDialog = (result) => {
  show.value = true
  tableData.value = result
}
defineExpose({
  showDialog,
})
</script>

<style lang="scss" scoped>

</style>