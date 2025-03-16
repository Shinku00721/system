<template>
  <div style="height: 100px;width: 100px;">
    <img v-if="cover" :src="`http://localhost:9091/api/file/getImage/`  + cover" class="img" style="width: 100%; height: 100%;"/>
    <div v-else :style="{ backgroundColor: bgColor}" class="bac"><p>{{ title }}</p></div>
  </div>
</template>

<script setup>
//上传图片的api
const imgUrl = '/api/file/getImage'
const props = defineProps({
  cover: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  bgColor: {
    type: String,
    default: '#ccc'
  }

})
</script>

<style lang="scss" scoped>
.bac{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 18px;
}
</style>