<template>
  <div>
    <el-dialog v-model="dialogConfig.show" style="width: 40%;"> 
      <template #header>
        <h1 style="font-size: 20px; margin-bottom: 20px;">{{ dialogConfig.title }}</h1>
      </template>
      <div class="content">
        <span>1.下载数据模板</span>
        <a :href="`/api/file/downloadTemplate?type=${type}`" target="_blank" style="text-decoration: none;"><span>点击下载</span></a>
        <span>2.上传数据</span>
        <div>
          <el-upload
            name="file"
            :multiple="false"
            :show-file-list="false"
            accept=".xls,.xlsx"
            :http-request="uploadFile"
            >
            <el-button type="primary" style="margin-right: 10px;">点击上传</el-button>
            <span>仅支持.xls .xlsx格式文件</span>
          </el-upload>
        </div>
      </div>
    </el-dialog>

    <!-- 展示错误信息 -->
    <ImportError ref="importErrorRef"></ImportError>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { QuestionApi } from '@/api/question/index';
import ImportError from './component/importError/index.vue'
const props = defineProps({
  type:{
    type:Number,
    default:0
  }

})
const dialogConfig = ref({
  show:false,
  title:'批量导入'
})

const emit = defineEmits(['reload'])
//上传文件的方法
const importErrorRef = ref()
const uploadFile = (file) => {
  let params = {}
  params.file = file.file
  QuestionApi.uploadQuestion(params).then(result=>{
    if(result.length >0){
      console.log(result)
      //展示错误信息
      importErrorRef.value.showDialog(result)
    }else if(result.length == 0){
      console.log('导入成功')
      dialogConfig.value.show = false
      // 刷新数据
      emit('reload')
    }
  })
}

const showDialog = () => {
  dialogConfig.value.show = true //显示对话框
}

defineExpose({
  showDialog
})
</script>

<style lang="scss" scoped>
.content{
  display: flex;
  height: 180px;
  flex-direction: column;
  justify-content: space-around;
  font-size: 16px;
}
</style>