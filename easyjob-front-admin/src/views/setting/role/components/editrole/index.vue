<template>
  <div>
    <el-dialog v-model="dialogConfig.show">
      <template #header>
        <h1 style="margin-bottom: 20px; font-size: 20px;">{{ dialogConfig.title }}</h1>
      </template>
      <el-form>
        <el-form-item label="角色名称"><el-input placeholder="请输入角色名称" v-model="formData.roleName"></el-input></el-form-item>
        <el-form-item label="关联菜单" v-if="treeShow">
          <el-tree
            v-model="formData.menuIds"
            ref="menuTreeRef"
            style="max-width: 500px"
            :data="treeData"
            show-checkbox
            :highlight-current="true"
            node-key="menuId"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
          />
        </el-form-item>
        <el-form-item label="角色描述"><el-input type="textarea" placeholder="请输入角色描述" v-model="formData.roleDesc"></el-input></el-form-item>
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
import { nextTick, ref } from 'vue';
import { RoleAPI } from '@/api/role/index'
import { ElMessage } from 'element-plus';
const menuTreeRef = ref()
const props = defineProps({
  data:{
    type:Object,
    default:{}
  },
  treeData:{
    type:Array,
    default:[]
  }
})
const treeShow = ref(true)
const formData = ref({
  roleId:'',
  roleName:'',
  roleDesc:'' ,
  createTime:''
})
const dialogConfig = ref({
  show:false,
  title:'新增子菜单'
})
const defaultProps = {
  label:'menuName',
  children:'children',
  value:'menuId'
}
const emit = defineEmits(['reload'])
//点击确定的方法
const confirm = () => {
  let params = {}
  params = {
    roleId:formData.value.roleId,
    roleName:formData.value.roleName,
    roleDesc:formData.value.roleDesc,
    menuIds:''
  }
  if(treeShow.value){
    //收集菜单信息
    let menuIdArr = menuTreeRef.value.getCheckedKeys()
    let halfMenuIdArr = menuTreeRef.value.getHalfCheckedKeys()
    params.menuIds = menuIdArr.join(',')
    params.halfMenuIds = halfMenuIdArr.join(',')
  }
  RoleAPI.saveOrUpdateRole(params).then(res => {
    ElMessage({
      message: '保存成功',
      type: 'success',
      duration:1500
    })
    emit('reload')
    //关闭
    dialogConfig.value.show = false
  })
}

//点击取消的方法
const cancel = () => {
  //关闭
  dialogConfig.value.show = false
  formData.value = {}
}

//对外暴露的方法
const showDialog = (currentRow={},) => {
  formData.value = {}
  dialogConfig.value.show = true //显示对话框
  nextTick(() => {
  
  
  if(currentRow.roleId){
    //修改
    treeShow.value = false
    dialogConfig.value.title = '修改角色'
    Object.assign(formData.value,currentRow)
    console.log(formData.value)
  }else{
    treeShow.value = true

    dialogConfig.value.title = '新增角色'
  }
  })
}

defineExpose({
  showDialog
})
</script>

<style scoped lang="scss">

</style>