<script setup>
/**
 * Created by YuYoung on 2023/3/20
 * Description: 主页Dashboard页面
 */
import {ref, reactive} from 'vue';
import {storeToRefs} from "pinia";
import {useServerStore} from "@/store/server";

const serverStore = useServerStore();

const lineData = reactive({
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
  ,
  datasets: [
    {
      label: 'First Dataset',
      data: ['', '', '', 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60]
      ,
      fill: false,
      borderColor: '#ed1248',
      backgroundColor: '#ed1248',
      tension: 0.1
    }
  ]
});
const options = {
  animation: false
};

const {memTotalSize, cpuUsageRatioLastSec} = storeToRefs(serverStore);
const {mbToGb} = storeToRefs(serverStore);


serverStore.fetchServerStaticInfo();

serverStore.fetchRealtimeServerInfo();


const lineOptions = ref(options);

// let id = 0;

// function changeData() {
//   if (id !== 0) {
//     clearInterval(id);
//     id = 0;
//     return;
//   }
//   // eslint-disable-next-line no-constant-condition
//   id = setInterval(() => {
//     let i = 1;
//     for (; i < lineData.datasets[0].data.length; i++) {
//       lineData.datasets[0].data[i - 1] = lineData.datasets[0].data[i];
//     }
//     lineData.datasets[0].data[i] = Math.floor(Math.random() * 81) + 10;
//
//   }, 500);
//
// }

</script>


<template>
  <div class="grid">

    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Orders</span>
            <div class="text-900 font-medium text-xl">152</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-blue-100 border-round"
               style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">
          cpuUsage: {{ cpuUsageRatioLastSec }}
          memTotal: {{ memTotalSize }}
          roundup:{{mbToGb}}
        </span>
        <span class="text-500">since last visit</span>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Revenue</span>
            <div class="text-900 font-medium text-xl">$2.100</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-orange-100 border-round"
               style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-map-marker text-orange-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">%52+ </span>
        <span class="text-500">since last week</span>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Customers</span>
            <div class="text-900 font-medium text-xl">28441</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-cyan-100 border-round"
               style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-inbox text-cyan-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">520 </span>
        <span class="text-500">newly registered</span>
      </div>
    </div>
    <div class="col-12 lg:col-6 xl:col-3">
      <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
          <div>
            <span class="block text-500 font-medium mb-3">Comments</span>
            <div class="text-900 font-medium text-xl">152 Unread</div>
          </div>
          <div class="flex align-items-center justify-content-center bg-purple-100 border-round"
               style="width: 2.5rem; height: 2.5rem">
            <i class="pi pi-comment text-purple-500 text-xl"></i>
          </div>
        </div>
        <span class="text-green-500 font-medium">85 </span>
        <span class="text-500">responded</span>
      </div>
    </div>
    <!--    <button @click="changeData">changeData</button>-->

    <div class="col-12 lg:col-12 xl:col-6">
      <div class="card">
        <h5>CPU Ratio</h5>
        <Chart type="line" :data="lineData" :options="lineOptions" style="min-height: 200px;"/>
      </div>
    </div>


  </div>
</template>
