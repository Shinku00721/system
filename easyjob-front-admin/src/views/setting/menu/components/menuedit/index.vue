<template>
  <div>
    <el-dialog
    width="500"
    v-model="dialogConfig.show"
  >
    <template #header>
      <h1 style="margin-bottom: 20px; font-size: 20px;">{{ dialogConfig.title }}</h1>
      <el-form label-width="100px">
        <el-form-item label="菜单名称"><el-input placeholder="请输入菜单名称" v-model="formData.menuName"></el-input></el-form-item>
        <el-form-item label="父级菜单" v-if="formData.pId">
          <el-tree-select
            v-model="formData.pId"
            :data="treeData"
            :props="defaultProps"
            node-key="menuId"
            :highlight-current="true"
            :expand-on-click-node="false"
            :default-expand-all="true"
            clearable
            :check-strictly="true"
            style="width: 240px"
            placeholder="请选择父级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-radio-group v-model="formData.menuType">
            <el-radio :value= 1 size="large">按钮</el-radio>
            <el-radio :value= 0 size="large">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请求路径"><el-input v-model="formData.menuUrl"></el-input></el-form-item>
        <el-form-item label="权限编码"><el-input v-model="formData.permissionCode"></el-input></el-form-item>
        <el-form-item label="菜单图标"><el-input v-model="formData.icon"></el-input></el-form-item>
        <el-form-item label="排序号"><el-input v-model="formData.sort"></el-input></el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="dialog-footer">
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
import { nextTick, ref } from 'vue';
import { MenuAPI } from '@/api/menu';
import { ElMessage } from 'element-plus';
//接受数据
const props = defineProps({
  data:{
    type:Object,
  },
  treeData:{
    type:Array,
    default:[]
  },
})
const formData = ref({
  menuId:'',
  menuName:'',
  menuType:'',
  menuUrl:'',
  permissionCode:'',
  icon:'',
  sort:'',
  pId:''
})

const dialogConfig = ref({
  show:false,
  title:''
})

// 配置项
const defaultProps = {
  label:'menuName',
  children:'children',
  value:'menuId'
}

const showEditDialog = (type,nodeForm) => {
  //显示对话框
  dialogConfig.value.show = true

  //修改标题
  nextTick(() => {
    if(type === 'add'){
    dialogConfig.value.title = '新增子菜单'
    formData.value = {}
    formData.value.pId = props.data.data.menuId
  }else if(type === 'edit'){
    dialogConfig.value.title = '修改子菜单'
    Object.assign(formData.value,nodeForm)
    // console.log(props.data.data.menuId)
  }
  })
  // console.log(formData.data)
}

const emit = defineEmits(['reload'])
//点击确认
const confirm = async () => {
  dialogConfig.value.show = false
  //发送请求
  let params = []
  Object.assign(params,formData.value)
  delete params.children
  await MenuAPI.updateMenu(params)
  
  // 刷新数据
  emit('reload')
  ElMessage({
    message: formData.value.menuId ? '修改成功' : '新增成功',
    type: 'success'
  })
}

//暴露方法
defineExpose({
  showEditDialog
})
</script>

<style lang="scss" scoped>

</style>