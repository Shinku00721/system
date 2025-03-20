<template>
  <div style="width: 100%;">
    <el-select clear placeholder="请选择分类" :modelValue="modelValue" @change="change">
      <el-option v-for="(item,index)  in categoryList" :key="index" :value="item.categoryId" :label="item.categoryName">
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import request from '@/utils/request';
import { ref } from 'vue';
const categoryList = ref()
const props = defineProps({
  type:{
    type:Number,
    default:'',
  },
  modelValue:{
    type:String,
    default:'',
  }
})

//获取分类数据
const getCategory = async () => {
  let result = await request({
    url:'/category/loadAllCategory4Select',
    params:{
      type:props.type
    }
  })

  //收集数据
  categoryList.value = result
}
const emit = defineEmits(['update:modelValue','change'])
const change = (e) => {
  emit('update:modelValue',e)
  emit('change')
}
getCategory()
</script>

<style lang="scss" scoped>

</style>