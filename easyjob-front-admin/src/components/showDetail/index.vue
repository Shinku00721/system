<template>
  <div v-show="show">
    <!-- 遮罩层 -->
     <div class="mask">
      <div style="position: fixed; right: 10px; top: 10px;"><el-icon :size="35" @click="cancel" class="close-icon"><Close/></el-icon></div>
      <div style="height: 100%; width: 600px; display: flex;justify-content: space-around; align-items: center; ">
        <el-icon :size="45" class="icon-left" @click="nextAndPre(-1)"><ArrowLeft/></el-icon>
        <div class="content">
          <div class="title">{{ detailData?.title }}</div>
          <el-rate v-model="detailData.difficultyLevel" :disabled="true"/>
        </div>
        <el-icon :size="45" @click="nextAndPre(1)"><ArrowRight/></el-icon>
      </div>
     </div>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import { QuestionApi } from '@/api/question';
const show = ref(false)
const nextType = ref()
const currentId = ref()
const detailData = ref({})
const showDetail = (id) => {
  show.value = true
  currentId.value = id
  nextType.value = ''
  nextTick(() => {
    getQuestionDetail()
  })
  // window.addEventListener('keydown',keydown,false)
}
//添加键盘监听
const keydown = (event) => {
  const e = event || window.event
  let key = e.keyCode
  if(key === 37){
    nextAndPre(-1)
  }else if (key === 39){
    nextAndPre(1)
  }
}

defineExpose({
  showDetail
})

const cancel = () => {
  show.value = false
}

// 下一页和上一页
const nextAndPre = (type) => {
  nextType.value = type  // 1 下一页  -1 上一页
  getQuestionDetail()
}

//获取八股文详情信息
const getQuestionDetail = () => {
  let params = {}
  params.currentId = currentId.value
  params.nextType = nextType.value
  QuestionApi.getQuestionDetail(params).then((result) => {
    detailData.value = result
    currentId.value = result.questionId
  })
}
</script>

<style lang="scss" scoped>
.mask{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  .close-icon{
    color: white;
    position: relative;
    top: 20px;
    right: 10px;
  }

  .content{
    width: 405px;
    height: 720px;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    background-color: white;
    border: 15px solid #000;
    border-radius: 7%;
  }
}
</style>