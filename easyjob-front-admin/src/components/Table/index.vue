<template>
  <div>
    <el-table :data="dataSource" v-if="dataSource.length" :highlight-current-row="true" @row-click="handleRowClick">
      <el-table-column type="selection" width="55" v-if="options.showSelection"/>
      <!-- 序号列 -->
      <el-table-column type='index' label="序号" width="150" v-if="options.showIndex"/>
      <!-- 展示数据 -->
      <template v-for="(column,index) in column" :key="index">
        <!-- 传入插槽 -->
        <el-table-column v-if="column.scopedSlots" :label="column.label" :width="column.width">
          <template #default="{row,index}">
            <slot
            :name="column.scopedSlots"
            :index="index"
            :row="row"
            >
            </slot>
          </template>
        </el-table-column>

        <el-table-column
        v-else
        :property="column.prop"
        :label="column.label"
        >
        </el-table-column>
      </template>
    </el-table>
    <div style="margin-top: 20px; float: right; margin-bottom: 20px;" v-if="options.showPage">
      <el-pagination
      v-model:current-page="pageOptions.currentPage"
      v-model:page-size="pageOptions.pageSize"
      :page-sizes="[3, 5, 7, 9]"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="props.pageOptions.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    </div>
  </div>
</template>

<script setup>
import { onMounted,watch } from 'vue';
const emit = defineEmits(['rowClick','reload'])
// const emit = defineEmits(['rowClick','rowSelected'])
const props = defineProps({
  dataSource:{
    type:Array,
    default:[]
  },
  pageOptions:{
    type:Object,
    default:{}
  },
  column:{
    type:Array,
    default:[]
  },
  options:{
    type:Object,
    default:{}
  },
  // ectHeight:{
  //   default:70
  // },
  // fetch:Function,
  // initFetch:{
  //   type:Boolean,
  //   default:true
  // },
  // selected:Function
})
//行点击
const handleRowClick = (row) => {
  emit('rowClick',row)
}

//页码发生变化
const handleSizeChange = () => {
  emit('reload')
}

//页面发生变化
const handleCurrentChange = () => {
  emit('reload')
}
watch(
    () => props.dataSource, //这样才可以检测到对象里面的值
)
watch(
    () => props.options, //这样才可以检测到对象里面的值
)
onMounted(() => {
  // console.log(props.options)
})
</script>

<style lang="scss" scoped>

</style>