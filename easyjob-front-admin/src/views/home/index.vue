<template>
  <div>
    <el-card>
      <span style="font-size: 20px;">数据概括</span>
      <div class="allData">
        <div class="allData-item" v-for="(item,index) in AllData" :key="index">
          <span style="font-size: 14px;">{{ item.statisticsName }}</span>
          <div style="display: flex; margin-top: 10px; justify-content: space-between;">
            <p style="font-size: 23px;">{{ item.count }}</p>
            <p>昨日新增:<span>{{ item.preCount }}</span></p>
          </div>
        </div>
      </div>
    </el-card>
    <el-card style="margin-top: 10px;">
      <div style="display: flex; justify-content: space-between;">
        <div style="width: 45%; height: 300px;" ref="charts1">123</div>
        <div style="width: 45%; height: 300px;" ref="charts2">435</div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { HomeAPI } from '@/api/home';
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
const charts1 = ref()
const charts2 = ref()
//获取数据
const contentWeekDate = ref()
const AllData = ref([])
const appWeekDate = ref()
onMounted(async () => {
  //获取所有数据
  let result = await HomeAPI.getAllData()
  AllData.value = result
  console.log(result)
  //获取一周的内容统计数据
  let result2 = await HomeAPI.getContentWeekData()
  contentWeekDate.value = result2
  // 获取一周的APP统计数据
  let result3 = await HomeAPI.getAppWeekData()
  appWeekDate.value = result3

  //左侧的图表
  let myChart1 = echarts.init(charts1.value)
  const xAxisData = contentWeekDate.value.dateList
  const seriesData = []
  contentWeekDate.value.itemDataList.forEach(item => {
    seriesData.push({
      name:item.statisticsName,
      type:'bar',
      smooth:true,
      data:item.listData,
      itemStyle:{
        color:['red','green','blue','yellow']
      }
    })
  });
  myChart1.setOption(
    getOption('Week',xAxisData,seriesData)
  )


  let myChart2 = echarts.init(charts2.value)
   //右侧的图
  myChart2.setOption(
    getOption('Week',xAxisData,seriesData)
  )
})

//配置图标的方法
const getOption = (title, xAxisData, seriesData) => {
  return {
    title:{
      text:title
    },
    tooltip:{
      trigger:'axis',
      axisPointer:{
        type:'shadow',
        textStyle:{
          color:'red'
        }
      }
    },
    legend:{
      x:200
    },
    grid:{
      left:50,
      right:0
    },
    xAxis: {
      axisLine: {
        lineStyle:{
        color:'#90979c'
        }
      },
      data:xAxisData,
      axisLabel:{
        interval:0,
        rotate:45
      }
    },
    yAxis:{
      type:'value'
    },
    series:seriesData
}
}
</script>

<style lang="scss" scoped>
.allData{
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .allData-item{
    width: 200px;
    height: 90px;
    background-color: rgb(216, 209, 209) ;
    padding: 10px;
  }
}
</style>