<script setup>
/**
 * Created by YuYoung on 2023/4/10
 * Description: CPU1分钟实时数据线图
 */

import { useServerStore } from '@/store/server';
import { RealTimeLineChartData, RealTimeLineChartOption } from '@/service/graphConfig';
import { reactive } from 'vue';
import { storeToRefs } from 'pinia/dist/pinia';
import MonitorDataCard from '@/components/Monitor/MonitorDataCard.vue';
import { formatSeconds } from '@/service/utils';
import { color } from '@/components/Monitor/color';
import TitleDataDivVertical from '@/components/Monitor/TitleDataDivVertical.vue';
import TitleDataDivHorizon from '@/components/Monitor/TitleDataDivHorizon.vue';

const serverStore = useServerStore();
const { cpuUsageRatioLastMin, cpuStaticInfo, cpuRunningTime } = storeToRefs(serverStore);

const data = reactive(new RealTimeLineChartData());
data.setData(cpuUsageRatioLastMin, color.cpu);
const options = new RealTimeLineChartOption();
options.scales.y.min = 0;
options.scales.y.max = 100;
</script>

<template>
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
            <Chart type="line" :data="data" :options="options" class="h-20rem" />
        </template>
        <template #real-time-info>
            <div class="flex flex-column">
                <div class="flex flex-wrap">
                    <TitleDataDivVertical class="pr-3 pt-2" title="当前" :data="cpuUsageRatioLastMin[59] + '%'" />
                </div>
                <div class="flex flex-wrap">
                    <TitleDataDivVertical
                        class="pr-3 pt-2"
                        title="正常运行时间"
                        :data="formatSeconds(cpuRunningTime)"
                    />
                </div>
            </div>
        </template>
        <template #static-info>
            <div class="flex flex-wrap flex-column">
                <TitleDataDivHorizon title="型号：" :data="cpuStaticInfo.name" />
                <TitleDataDivHorizon class="pt-1" title="核心数：" :data="cpuStaticInfo.coreNum" />
                <TitleDataDivHorizon class="pt-1" title="线程数：" :data="cpuStaticInfo.threadNum" />
                <TitleDataDivHorizon
                    class="pt-1"
                    title="缓存："
                    :data="(cpuStaticInfo.cacheSize / 1024).toFixed(1) + 'MB'"
                />
            </div>
        </template>
    </MonitorDataCard>
</template>
