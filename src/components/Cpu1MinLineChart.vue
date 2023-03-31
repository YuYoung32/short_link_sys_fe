<script setup>
/**
 * Created by YuYoung on 2023/3/24
 * Description: CPU1分钟负载折线图
 */

import { useServerStore } from '@/store/server';
import { reactive } from 'vue';
import { storeToRefs } from 'pinia/dist/pinia';

const serverStore = useServerStore();

const { cpuUsageRatioLastMin } = storeToRefs(serverStore);

serverStore.fetchInfoLast1Min();
serverStore.fetchRealtimeServerInfo();
const last1MinLabels = [
    -60, -59, -58, -57, -56, -55, -54, -53, -52, -51, -50, -49, -48, -47, -46, -45, -44, -43, -42, -41, -40, -39, -38, -37, -36, -35, -34, -33, -32, -31, -30, -29, -28, -27, -26, -25, -24, -23, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13, -12,
    -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1
];

const lineData = reactive({
    labels: last1MinLabels,
    datasets: [
        {
            data: cpuUsageRatioLastMin,
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
            <h5>CPU实时使用率</h5>
            <Chart type="line" :data="lineData" :options="lineOptions" class="h-20rem" />
        </div>
    </div>
</template>
