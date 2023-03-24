<script setup>
/**
 * Created by YuYoung on 2023/3/24
 * Description: 通用标题-折线图展示卡片
 * Uses:
 * @prop.title(必须) 标题
 * @prop.xData(必须) x轴数据
 * @prop.yData(必须) y轴数据, 可以为pinia中的state或reactive对象
 */

// eslint-disable-next-line no-unused-vars
import {defineProps, reactive} from 'vue';

const props = defineProps(['title', 'xData', 'yData']);

// watch(() => props.yData, (newVal) => {
//   _yData = newVal;
//   console.log(_yData);
// }, {deep: true});

const lineData = reactive({
  labels: props.xData,
  datasets: [
    {
      data: props.yData,
      fill: true,
      borderColor: 'rgba(255,0,0,0.72)',
      backgroundColor: 'rgba(255,0,0,0.36)',
      borderWidth: 1,
      pointRadius: 1,
      tension: 0.1
    }
  ]
});

const lineOptions = {
  animation: false,
  maintainAspectRatio: false, // 是否保持长宽比
  // scales: {
  // x: [{
  //   ticks: {
  //     beginAtZero: true
  //   },
  //   gridLines: {
  //     display: true, // 显示网格线
  //     color: '#ccc', // 设置网格线颜色
  //     lineWidth: 1 // 设置网格线宽度
  //   },
  // }],
  // yAxes: [{
  //   ticks: {
  //     beginAtZero: true
  //   },
  //   gridLines: {
  //     display: true,
  //     color: '#ccc',
  //     lineWidth: 1
  //   }
  // }]
  // },
  plugins: {
    legend: {
      display: false
    }
  }
};

</script>


<template>
  <div class="col-12 xl:col-6">
    {{ lineData.datasets[0].data }}
    {{ props.yData }}
    <div class="card">
      <h5>{{ props.title }}</h5>
      <Chart type="line" :data=lineData :options="lineOptions" class="h-20rem"/>
    </div>
  </div>
</template>
