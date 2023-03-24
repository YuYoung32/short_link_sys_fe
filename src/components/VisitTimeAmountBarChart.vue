<script setup>
/**
 * Created by YuYoung on 2023/3/24
 * Description: 时间访问量柱状图
 */

import {reactive} from "vue";
import {storeToRefs} from "pinia/dist/pinia";
import {useVisitStore} from "@/store/visit";

const visitStore = useVisitStore();

const {xHourTimePoints, visitAmountLastXHour} = storeToRefs(visitStore);

visitStore.fetchVisitAmountXhr(24);


const data = reactive({
  labels: xHourTimePoints,
  datasets: [
    {
      data: visitAmountLastXHour,
      fill: true,
      borderColor: 'rgba(255,0,0,0.72)',
      backgroundColor: 'rgba(255,0,0,0.36)',
      borderWidth: 1,
    }
  ]
});

const options = {
  animation: false,
  maintainAspectRatio: false, // 是否保持长宽比
  plugins: {
    legend: {
      display: false
    }
  }
};
</script>


<template>
  <div class="col-12 xl:col-6">
    <div class="card">
      <h5>24小时访问时段图</h5>
      <Chart type="bar" :data=data :options="options" class="h-20rem"/>
    </div>
  </div>
</template>
