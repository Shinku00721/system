<template>
  <div class="avatar-uploader-container">
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      :show-file-list="true"
      :limit="1"
      :http-request="uploadFile"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :on-change="handleChange"
    >
      <img v-if="modelValue" :src="`http://localhost:9091/api/file/getImage/` + modelValue" class="avatar" :style="{width:width,height:height}"/>
      <el-icon v-else class="avatar-uploader-icon" :style="{width:width +'px',height:height +'px'}"><Plus/></el-icon>
    </el-upload>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import request from '@/utils/request'
const file = ref('')
const uploadRef = ref()
const props = defineProps({
  width:{
    type:Number,
    default:100
  },
  height:{
    type:Number,
    default:100
  },
  type:{
    type:Number
  },
  modelValue:{
    type:String,
    default:null
  }
})
const emit = defineEmits()
const uploadFile = (file) => {
    file = file.file //获取file对象
    request({
      url:'/file/uploadFile',
      params:{
        file:file,
        type:props.type
      }
    }).then((result) => {
      emit('update:modelValue',result)
    })
    
}

const handleChange = (file,fileList) => {
  // console.log(file,fileList)
  uploadRef.value.clearFiles()
}
</script>
<style lang="scss" scoped>
.avatar-uploader .avatar {
  display: block;
}

</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  margin-left: 90px;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  /* width: 200px;
  height: 200px; */
  text-align: center;
}
</style>