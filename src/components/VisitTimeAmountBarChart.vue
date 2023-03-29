<script setup>
/**
 * Created by YuYoung on 2023/3/24
 * Description: 时间访问量柱状图
 */

import {ref, reactive, defineProps, watchEffect} from "vue";
import {useVisitStore} from "@/store/visit";
import {storeToRefs} from "pinia";

const visitStore = useVisitStore();

const {visitAmountLastBetween} = storeToRefs(visitStore);

const props = defineProps(['title', 'begin', 'end']);
const titleRef = ref(props.title);

const xData = reactive([]);

watchEffect(async () => {
  await visitStore.fetchVisitAmountLastBetween(props.begin, props.end);
  xData.splice(0, xData.length);
  for (let i = props.begin; i <= props.end; i++) {
    xData.push(i);
  }
});


const data = reactive({
  labels: xData,
  datasets: [
    {
      data: visitAmountLastBetween,
      fill: true,
      borderColor: '#6366F1',
      backgroundColor: '#6366F1',
      borderWidth: 1,
    }
  ]
});

const options = {
  animation: true,
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
      <h5>{{ titleRef }}</h5>
      <Chart type="bar" :data=data :options="options" class="h-20rem"/>
    </div>
  </div>
</template>
