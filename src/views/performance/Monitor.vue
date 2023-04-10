<script setup>
/**
 * Created by YuYoung on 2023/3/23
 * Description: 性能监控
 */

import { useServerStore } from '@/store/server';
import CPU1MinLineChart from '@/components/Monitor/CPU1MinLineChart.vue';
import Mem1MinLineChart from '@/components/Monitor/Mem1MinLineChart.vue';
import Disk1MinLineChart from '@/components/Monitor/Disk1MinLineChart.vue';
import Net1MinLineChart from '@/components/Monitor/Net1MinLineChart.vue';

const serverStore = useServerStore();

serverStore.fetchServerStaticInfo();
serverStore.fetchInfoLast1Min().then(() => {
    serverStore.fetchRealtimeServerInfo();
});
</script>

<template>
    <div class="grid">
        <CPU1MinLineChart></CPU1MinLineChart>
        <Mem1MinLineChart></Mem1MinLineChart>
        <Disk1MinLineChart></Disk1MinLineChart>
        <Net1MinLineChart></Net1MinLineChart>
    </div>
</template>
