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
  </div>
</template>

<script setup>
import { onMounted,watch } from 'vue';
const emit = defineEmits(['rowClick'])
// const emit = defineEmits(['rowClick','rowSelected'])
const props = defineProps({
  dataSource:{
    type:Array,
    default:[]
  },
  // showPagination:{
  //   type:Boolean,
  //   default:true
  // },
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

watch(
    () => props.dataSource, //这样才可以检测到对象里面的值
)
watch(
    () => props.options, //这样才可以检测到对象里面的值
)
onMounted(() => {
  console.log(props.options)
})
</script>

<style lang="scss" scoped>

</style>