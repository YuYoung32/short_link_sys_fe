<script setup>
/**
 * Created by YuYoung on 2023/4/10
 * Description: 内存1分钟实时数据线图
 */

import { reactive, watch } from 'vue';
import { RealTimeLineChartData, RealTimeLineChartOption } from '@/service/graphConfig';
import { useServerStore } from '@/store/server';
import { storeToRefs } from 'pinia/dist/pinia';
import TitleDataDivHorizon from '@/components/Monitor/TitleDataDivHorizon.vue';
import TitleDataDivVertical from '@/components/Monitor/TitleDataDivVertical.vue';
import MonitorDataCard from '@/components/Monitor/MonitorDataCard.vue';
import { autoTransferMemUnit } from '@/service/utils';

const serverStore = useServerStore();
const { memUsageLastMin, memAvailLastSec, swapUsageLastSec, memStaticInfo, memUsageLastSec } = storeToRefs(serverStore);

serverStore.fetchServerStaticInfo();

const data = reactive(new RealTimeLineChartData());
data.setData(memUsageLastMin, 'rgba(0, 106, 255, 0.72)');

const options = new RealTimeLineChartOption();
watch(memStaticInfo, (newVal) => {
    options.scales.y.max = newVal.physicalTotalSize;
});
options.scales.y.min = 0;
options.plugins.tooltip = {
    callbacks: {
        label: (context) => {
            return autoTransferMemUnit(context.parsed.y);
        }
    }
};
</script>

<template>
    <MonitorDataCard>
        <template #title>
            <h5>内存</h5>
        </template>
        <template #unit-and-max>
            <div class="flex justify-content-between text-gray-600 text-xs">
                <span>使用量</span>
                <span>{{ autoTransferMemUnit(memStaticInfo.physicalTotalSize) }}</span>
            </div>
        </template>
        <template #chart>
            <Chart type="line" :data="data" :options="options" class="h-20rem" />
        </template>
        <template #real-time-info>
            <div class="flex flex-column">
                <div class="flex flex-wrap">
                    <TitleDataDivVertical
                        class="pr-3 pt-2"
                        title="使用中"
                        :data="autoTransferMemUnit(memUsageLastSec)"
                    />
                    <TitleDataDivVertical
                        class="pr-3 pt-2"
                        title="使用百分比"
                        :data="serverStore.memUsageRatioLastSec + '%'"
                    />
                    <TitleDataDivVertical class="pr-3 pt-2" title="可用" :data="autoTransferMemUnit(memAvailLastSec)" />
                </div>
                <div class="flex flex-wrap">
                    <TitleDataDivVertical
                        class="pr-3 pt-2"
                        title="已使用交换内存"
                        :data="autoTransferMemUnit(swapUsageLastSec)"
                    />
                </div>
            </div>
        </template>
        <template #static-info>
            <div class="flex flex-wrap flex-column">
                <TitleDataDivHorizon
                    title="物理内存总量："
                    :data="autoTransferMemUnit(memStaticInfo.physicalTotalSize)"
                />
                <TitleDataDivHorizon
                    class="pt-1"
                    title="交换内存总量："
                    :data="autoTransferMemUnit(memStaticInfo.swapTotalSize)"
                />
            </div>
        </template>
    </MonitorDataCard>
</template>
