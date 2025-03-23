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
            <el-button type="primary" size="default" @click="postQuestionList">批量发布</el-button>
            <el-button type="danger" size="default" @click="delQuestion" :disabled="questionIdList.length == 0">批量删除</el-button>
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
      @rowSelect="select"
      >
      <template #title="{row}">
        <slot>
          <span style="color: blue;cursor: pointer;" @click="showWindowDetail(row)">{{ row.title }}</span>
        </slot>
      </template>
      <template #difficultyLevel="{row}">
          <slot>
            <el-rate v-model="row.difficultyLevel" :disabled="true"/>
          </slot>
        </template>
        <template #status="{row}">
          <slot>
            <el-tag :type="row.status === 0 ?'danger':'primary'">{{ row.status === 0?'待发布':'已发布' }}</el-tag>
          </slot>
        </template>
        <template #operation="{row}">
          <slot>
            <el-button type="primary" size="small" @click="updateQuestion(row)">修改</el-button>
            <el-button type="primary" size="small" @click="postQuestionList(row)">发布</el-button>
            <el-button type="primary" size="small" @click="delUser(row)">删除</el-button>
          </slot>
        </template>
      </Table>
    </el-card>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';

import { QuestionApi } from '@/api/question';
import { ElMessage } from 'element-plus';
import { ElMessageBox } from 'element-plus';
const searchForm = ref({
  categoryId:'',
})
const questionEditRef = ref()
const showDetailRef = ref()
const tableData = ref([])
const questionIdList = ref([])
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
    prop:'questionId',
    width:'70'
  },
  {
    label:'标题',
    prop:'title',
    scopedSlots:'title'
  },
  {
    label:'分类',
    prop:'categoryName',
    width:'100'
  },
  {
    label:'创建人',
    prop:'createUserName',
    width:'100'
  },
  {
    label:'创建时间',
    // prop:'status',
    // formatter:(row) => {
    //   return row.status === 1 ? '正常' : '禁用'
    // }
    prop:'createTime',
    width:'200'
  },
  {
    label:'难度',
    scopedSlots:'difficultyLevel'
  },
  {
    width:'120',
    label:'发布状态',
    scopedSlots:'status'
  },{
    label:'操作',
    scopedSlots:'operation'
  }
])


//获取八股文信息的方法
const loadQuestionList = () => {
  let params = {pageNo:pageOption.value.currentPage,pageSize:pageOption.value.pageSize}
  QuestionApi.getQuestionList(params).then(res => {
  // console.log(res)
  // console.log(123)
  tableData.value  = res.list
  pageOption.value.total = res.totalCount
})
}

//删除八股文的方法
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

//批量删除的方法
const delQuestion = () => {
  ElMessageBox.confirm(
    '你确定要删除吗？',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then( () => {
    let params = {}
    params.questionIds = questionIdList.value.join(',')
    QuestionApi.delQuestionList(params).then(() => {
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

//批量发布的方法
const postQuestionList = (row ={}) => {
  ElMessageBox.confirm(
    '你确定要发布吗？',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then( () => {
    let params = {}
    if(row?.status == 0){
      params = {questionIds:row.questionId}
    }else if(questionIdList.value.length > 0){
      params.questionIds = questionIdList.value.join(',')
    }
    QuestionApi.postQuestion(params).then(() => {
      ElMessage({
        type: 'success',
        message: '发布成功',
      })
      if(row?.status == 0) row.status = 1
      loadQuestionList() //刷新数据
    }).catch(() => {
      ElMessage({
      type: 'warning',
      message: '发布失败',
    })
    })
    
  })
}

//点击select
const select = (select) => {
  //收集选择的id数组
  questionIdList.value = select.map((item) => {
    return item.questionId
  })
}

//展示问题详情

const showWindowDetail = (row) => {
  showDetailRef.value.showDetail(row.questionId)
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