<template>
  <div  class="role">
        <el-card>
      <el-form label-width="70px" class="role-form">
        <el-form-item label="用户名称" style="width: 350px;">
          <el-input placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号" style="width: 350px;">
          <el-input placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label-width="20px">
          <el-button type="success" size="small">查询</el-button>
          <el-button type="primary" size="small" @click="addUser">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px;">
      <Table 
      ref="tableInfoRef" 
      :column="columns" 
      :dataSource="tableData"
      :options="tableOptions"
      :extHeight="tableOptions.extHeight"
      >
      <template #status="{row}">
          <slot>
            <el-tag type="primary">{{ row.status === 0?'禁用':'启用' }}</el-tag>
          </slot>
        </template>
        <template #operation="{row}">
          <slot>
            <el-button type="primary" size="small" @click="updateRole(row)">修改</el-button>
            <el-button type="primary" size="small" @click="updatePassword(row)">修改密码</el-button>
            <el-button type="primary" size="small" @click="updateStatus(row)">禁用</el-button>
            <el-button type="primary" size="small" @click="delUser(row)">删除</el-button>
          </slot>
        </template>
      </Table>
    </el-card>
    <!-- 新增或删除角色弹窗 -->
    <EditUser ref="editUserRef"  @reload="loadUserList"></EditUser>
    <EditPassword ref="editPasswordRef"></EditPassword>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import EditUser from './component/edituser/index.vue'
import EditPassword from './component/editpassword/index.vue'
import { UserAPi } from '@/api/user';
import { ElMessage } from 'element-plus';
import { ElMessageBox } from 'element-plus';
const editUserRef = ref()
const editPasswordRef = ref()
const tableData = ref([])
const tableOptions = ref({
  showSelection:true,
  showIndex:false,
  extHeight:125
})
const columns = ref([
  {
    label:"用户名",
    prop:'userName'
  },
  {
    label:'手机号',
    prop:'phone'
  },
  {
    label:'角色名称',
    prop:'roleNames'
  },
  {
    label:'创建时间',
    prop:'createTime'
  },
  {
    label:'状态',
    // prop:'status',
    // formatter:(row) => {
    //   return row.status === 1 ? '正常' : '禁用'
    // }
    scopedSlots:'status'
  },
  {
    width:300,
    label:'操作',
    scopedSlots:'operation'
  }
])


//获取用户信息的方法
const loadUserList = () => {
  UserAPi.getUserList().then(res => {
  tableData.value = res.list
})
}

//启用禁用角色的方法
const updateStatus = (row) => {
  row.status === 0 ? row.status = 1 : row.status = 0
  const { status,userId}  = row
  const data = { status,userId}
  UserAPi.updateUserStatus(data).then(res => {
    ElMessage({
      type: 'success',
      message: '修改成功',
    })
    loadUserList() //刷新数据
  }).catch((err) => {
    ElMessage({
      type: 'waring',
      message: new Error(err),
    })
  })
}

//删除用户信息的方法
const delUser = (row) => {
  ElMessageBox.confirm(
    '你确定要删除吗？',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then( () => {
    let params = {userId:row.userId}
    UserAPi.deleteUser(params).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功',
    })
    loadUserList() //刷新数据
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

//新增用户的方法
const addUser = () => {
  editUserRef.value.showDialog()
}
//修改角色的方法
const updateRole = (row) => {
  editUserRef.value.showDialog(row)
}

//修改密码的方法
const updatePassword = (row) => {
  editPasswordRef.value.showDialog(row)
}

onMounted(() => {
  nextTick(() => {
    loadUserList() //获取用户信息
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