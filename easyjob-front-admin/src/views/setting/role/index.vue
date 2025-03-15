<template>
  <div  class="role">
    <el-row>
      <el-col :span="17">
        <el-card>
      <el-form label-width="70px" class="role-form">
        <el-form-item label="角色名称" style="width: 350px;">
          <el-input placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="描述" style="width: 350px;">
          <el-input placeholder="请输入描述"></el-input>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-button type="success" size="small">查询</el-button>
          <el-button type="primary" size="small" @click="addRole">新增</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px;height: 90%;">
      <Table 
      ref="tableInfoRef" 
      :column="columns" 
      :fetch="loadDataList"
      :dataSource="tableData"
      :options="tableOptions"
      :extHeight="tableOptions.extHeight"
      @row-click="handleRowClick"
      >
        <template #operation="{row}">
          <slot>
            
            <el-button type="primary" size="small" @click="updateRole(row)">修改</el-button>
            <el-button type="primary" size="small" @click="delRole(row)">删除</el-button>
          </slot>
        </template>
      </Table>
    </el-card>
      </el-col>
      <el-col :span="7"> 
        <el-card style="margin-left: 10px;">
          <template #header>
            <span>菜单</span>
            <el-button type="primary" size="default" style="float: right;" @click="saveRoleMenu">保存</el-button>
          </template>
          <el-tree
            style="max-width: 600px"
            ref="menuTreeRef"
            :data="treeData"
            show-checkbox
            :default-expand-all="true"
            :highlight-current="true"
            node-key="menuId"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
          />
        </el-card>
      </el-col>
    </el-row>
    <!-- 新增或删除角色弹窗 -->
    <EditRole :data="currentRow" ref="editRoleRef" :treeData="treeData" @reload="loadDataList"></EditRole>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { RoleAPI } from '@/api/role';
import { MenuAPI } from '@/api/menu';
import { ElMessage } from 'element-plus';
import EditRole from './components/editrole/index.vue'
import { ElMessageBox } from 'element-plus';
const menuTreeRef= ref()
const editRoleRef = ref()
const tableData = ref([])
const treeData = ref([])
const currentRow = ref({})
const defaultProps = {
  label:'menuName',
  children:'children',
  value:'menuId'
}
const tableOptions = ref({
  showIndex:true,
  extHeight:125
})
const columns = ref([
  {
    label:"角色名称",
    prop:'roleName'
  },
  {
    label:'描述',
    prop:'roleDesc'
  },
  {
    label:'创建时间',
    prop:'createTime'
  },
  {
    width:200,
    label:'操作',
    scopedSlots:'operation'
  }
])
//获取角色信息的方法
const loadDataList = () => {
  RoleAPI.loadRoles().then(res => {
  tableData.value = res
})
}

//删除角色信息的方法
const delRole = (row) => {
  ElMessageBox.confirm(
    '你确定要删除吗？',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then( () => {
    RoleAPI.delRole(row.roleId).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功',
    })
    currentRow.value = {}
    loadDataList() //刷新数据
    }).catch(() => {
      ElMessage({
      type: 'warning',
      message: '删除失败',
    })
    })
    
  }).catch(() => {
    ElMessage({
      type: 'warning',
      message: '取消删除',
    })
  })
}

//获取菜单信息的方法
const loadMenu = () => {
  MenuAPI.getMenuList().then(res => {
    treeData.value = res
  })
}

//保存角色菜单信息
const saveRoleMenu = () => {
  let params = {}
  let menuIdArr = menuTreeRef.value.getCheckedKeys()
  let halfMenuIdArr = menuTreeRef.value.getHalfCheckedKeys()
  params = {
    roleId:currentRow.value.roleId,
    menuIds:menuIdArr.join(','),
    halfMenuIds:halfMenuIdArr.join(',')
  }
  RoleAPI.saveRole(params).then(res => {
    ElMessage({
      message: '保存成功',
      type: 'success',
      duration:1500
    })
  handleRowClick(params) //刷新数据
  }).catch(err=>{
    ElMessage({
      message: '保存失败',
      type: 'error'
    })
  })
}

//点击row获取菜单数据
const handleRowClick = (row) => {
  RoleAPI.getRoleDetail(row.roleId).then(res=>{
    Object.assign(currentRow.value,res)
    menuTreeRef.value.setCheckedKeys(res.menuIds) 
  })
}

//新增角色的方法
const addRole = () => {
  editRoleRef.value.showDialog()
}
//修改角色的方法
const updateRole = (row) => {
  editRoleRef.value.showDialog(row)
}

onMounted(() => {
  nextTick(() => {
    loadDataList()
    loadMenu()
  })
})
</script>

<style lang="scss" scoped>
  .role-form{
  width: 100%;
  display: flex;
  align-items: center;
}

</style>