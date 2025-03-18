<template>
  <div  class="role">
        <el-card>
      <el-form label-width="55px" class="role-form">
        <el-row style="display: flex; justify-content: space-between;">
          <el-form-item label="标题" style="width: 250px;">
          <el-input placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="分类" style="width: 250px;">
          <CategorySelect :type="0" v-model="searchForm.categoryId" @change="loadQuestionList"></CategorySelect>
        </el-form-item>
        <el-form-item label="难度" style="width: 250px;">
          <el-input placeholder="请选择难度"></el-input>
        </el-form-item>
        <el-form-item label="状态" style="width: 230px;">
          <el-input placeholder="请选择状态"></el-input>
        </el-form-item>        
        <el-form-item label="创建人" style="width: 240px;">
          <el-input placeholder="请输入创建人"></el-input>
        </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label-width="20px">
          <el-button-group >
            <el-button type="success" size="default">查询</el-button>
            <el-button type="primary" size="default" @click="addQuestion">新增问题</el-button>
            <el-button type="primary" size="default" @click="importQuestion">批量导入</el-button>
            <el-button type="primary" size="default">批量发布</el-button>
            <el-button type="danger" size="default">批量删除</el-button>
          </el-button-group>
        </el-form-item>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 10px;">
      <Table 
      ref="tableInfoRef" 
      :column="columns" 
      :dataSource="tableData"
      :options="tableOptions"
      :pageOptions="pageOption"
      @reload="loadQuestionList"
      >
      <template #status="{row}">
          <slot>
            <el-tag type="primary">{{ row.status === 0?'禁用':'启用' }}</el-tag>
          </slot>
        </template>
        <template #operation="{row}">
          <slot>
            <el-button type="primary" size="small" @click="updateQuestion(row)">修改</el-button>
            <el-button type="primary" size="small" @click="updateStatus(row)">禁用</el-button>
            <el-button type="primary" size="small" @click="delUser(row)">删除</el-button>
          </slot>
        </template>
      </Table>
    </el-card>
    <!-- 添加或修改问题 -->
    <QuestionEdit ref="questionEditRef" @reload="loadQuestionList"></QuestionEdit>
    <!-- 批量导入数据 -->
     <ImportData ref="importDataRef" :type="0" @reload="loadQuestionList"></ImportData>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import QuestionEdit from './components/questionedit/index.vue'
import { QuestionApi } from '@/api/question';
import { ElMessage } from 'element-plus';
import { ElMessageBox } from 'element-plus';
const searchForm = ref({
  categoryId:'',
})
const questionEditRef = ref()
const editPasswordRef = ref()
const tableData = ref([])
const pageOption = ref({
  total:12, //设置总条数
  pageSize:5, //设置每页显示条数
  currentPage:1 
})
const tableOptions = ref({
  showSelection:true,
  showIndex:false,
  showPage:true
})
const columns = ref([
  {
    label:"ID",
    prop:'questionId'
  },
  {
    label:'标题',
    prop:'title'
  },
  {
    label:'分类',
    prop:'categoryName'
  },
  {
    label:'创建人',
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


//获取八股文信息的方法
const loadQuestionList = () => {
  let params = {pageNo:pageOption.value.currentPage,pageSize:pageOption.value.pageSize}
  QuestionApi.getQuestionList(params).then(res => {
  console.log(res)
  console.log(123)
  tableData.value  = res.list
  pageOption.value.total = res.totalCount
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
    let params = {questionId:row.questionId}
    QuestionApi.delQuestion(params).then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功',
    })
    loadQuestionList() //刷新数据
    }).catch(() => {
      ElMessage({
      type: 'warning',
      message: '删除失败',
    })
    })
    
  })
}

//新增问题的方法
const addQuestion = () => {
  questionEditRef.value.showDialog()
}
//修改问题的方法
const updateQuestion = (row) => {
  questionEditRef.value.showDialog(row)
}

//批量导入的方法
const importDataRef = ref()
const importQuestion = () => {
  importDataRef.value.showDialog()
}

onMounted(() => {
  nextTick(() => {
    loadQuestionList() //获取八股文信息
  })
})
</script>

<style lang="scss" scoped>
.role-form{
  width: 100%;
}

</style>