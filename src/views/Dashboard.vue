<script setup>
/**
 * Created by YuYoung on 2023/3/20
 * Description: Dashboard
 */

import { storeToRefs } from 'pinia';
import { useServerStore } from '@/store/server';
import { useLinkStore } from '@/store/link';
import { useVisitStore } from '@/store/visit';
import DataShowCard from '@/components/DataShowCard';
import VisitTimeAmountBarChart from '@/components/VisitTimeAmountBarChart';
import { dateObjToDayBeginUnixTime, dateObjToDayEndUnixTime } from '@/service/utils';
import MonitorDataCard from '@/components/Monitor/MonitorDataCard.vue';
import { reactive } from 'vue';
import { RealTimeLineChartData, RealTimeLineChartOption } from '@/service/graphConfig';

const serverStore = useServerStore();
const linkStore = useLinkStore();
const visitStore = useVisitStore();

const { isOnline, avgCPURatioLastMin, cpuUsageRatioLastMin } = storeToRefs(serverStore);
const { amountTotal } = storeToRefs(linkStore);
const { visitAmountTotal } = storeToRefs(visitStore);

const cpuLineData = reactive(new RealTimeLineChartData());
cpuLineData.setData(cpuUsageRatioLastMin, 'rgba(255, 0, 0, 0.72)');
const cpuLineOption = new RealTimeLineChartOption();

serverStore.fetchInfoLast1Min();
serverStore.fetchRealtimeServerInfo();
linkStore.fetchLinksAmountTotal();
</script>

<template>
    <div class="grid">
        <!-- 1 服务器在线状态 -->
        <data-show-card title="服务器在线状态" custom="true">
            <span v-if="isOnline" class="text-900 font-semibold text-xl text-green-500">在线</span>
            <span v-if="!isOnline" class="text-900 font-semibold text-xl text-red-500">离线</span>
        </data-show-card>
        <!-- 2 过去24小时总转发次数 -->
        <data-show-card title="最近7天转发" :msg="visitAmountTotal + ' 次'" />
        <!-- 3 数据库总链接数 -->
        <data-show-card title="数据库存储链接" :msg="amountTotal + ' 个'" />
        <!-- 4 过去1分钟CPU平均占用率 -->
        <data-show-card title="1分钟CPU平均使用" :msg="avgCPURatioLastMin + ' %'" />

        <MonitorDataCard>
            <template #title>
                <h5>CPU</h5>
            </template>
            <template #unit-and-max>
                <div class="flex justify-content-between text-gray-600 text-xs">
                    <span>使用率%</span>
                    <span>100%</span>
                </div>
            </template>
            <template #chart>
                <Chart type="line" :data="cpuLineData" :options="cpuLineOption" class="h-20rem" />
            </template>
        </MonitorDataCard>
        <visit-time-amount-bar-chart
            title="7天访问量"
            :begin="dateObjToDayBeginUnixTime(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000))"
            :end="dateObjToDayEndUnixTime(new Date(new Date().getTime() - 24 * 60 * 60 * 1000))"
        />
    </div>
</template>
