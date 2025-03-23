<template>
  <div>
    <el-dialog v-model="dialogConfig.show" width="600px">
      <template #header>
        <h1 style="margin-bottom: 20px; font-size: 20px;">{{ dialogConfig.title }}</h1>
      </template>
      <el-form label-width="90px" :model="formData" :rules="rules" ref="formRef">
        <el-form-item class="cover-upload" prop="iconPath" label="轮播图" style="height: 250px;">
          <CoverUpload v-model="formData.imgPath" :type="1" :width="330" :height="180"></CoverUpload>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="formData.objectType">
            <el-radio :value="item.value*1" v-for="(item,index) in carouseList" :key="index">{{ item.title }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.objectType === '3'" label="外部链接">
          <el-input v-model="formData.outerLink" placeholder="请输入完整的外部链接"></el-input>
        </el-form-item>
        <el-form-item v-else label="文章Id">
          <el-input placeholder="请输入文章Id" v-model="formData.objectId"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
      <div>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </div>
    </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import { CarouseType } from '@/utils/constant';
import { AppApi } from '@/api/app';
import { ElMessage } from 'element-plus';
const formRef = ref()
const formData = ref({})
const dialogConfig = ref({
  show:false,
  title:''
})

const rules = reactive({
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ],
  coverType: [
    { required: true, message: '请选择封面类型', trigger: 'change' }
  ],
  bgColor: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (formData.value.coverType === '0' && !value) {
          callback(new Error('请选择背景颜色'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  iconPath: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (formData.value.coverType === '1' && !value) {
          callback(new Error('请上传封面图片'));
        } else {
          callback();
        }
      },
      trigger: 'change'
    }
  ],
  type: [
    { required: true, message: '请选择分类类型', trigger: 'change' }
  ]
});
const emit = defineEmits(['reload'])


//点击确定的方法
const confirm = () => {
  let params = {}
  //新增用户
  Object.assign(params,formData.value)
  formRef.value.validate().then(() => {
    AppApi.saveOrUpdateAppCarousel(params).then(res => {
    ElMessage({
      message: '保存成功',
      type: 'success',
      duration:1500
    })
    emit('reload')  //刷新数据
    //关闭
    dialogConfig.value.show = false
  })
  }).catch(() => {
    ElMessage({
      message: '保存失败',
      type: 'error'
    })
  })
}

//点击取消的方法
const cancel = () => {
  //关闭
  dialogConfig.value.show = false
  formData.value = {}
}

//对外暴露的方法
const showDialog = (row={},) => {
  formData.value = {}
  dialogConfig.value.show = true //显示对话框
  nextTick(() => {
  formRef.value?.resetFields()
  if(row.carouselId){
    //修改
    dialogConfig.value.title = '修改轮播图'
    Object.assign(formData.value,row)
  }else{
    dialogConfig.value.title = '新增轮播图'
     formData.value = {}
  }
  })
}

const carouseList = computed(() => {
  let carouseListArray = []
  for(let i in CarouseType){
    carouseListArray.push({
      title:CarouseType[i],
      value:i
    })
  }
  return carouseListArray
})

defineExpose({
  showDialog
})

</script>

<style scoped lang="scss">
.cover-upload{
  width: 100%;
  height: 100px;
  display: block;
  margin-bottom: 20px;
}
</style>