<script setup>
/**
 * Created by YuYoung on 2023/4/10
 * Description: 磁盘1分钟实时数据线图
 */

import { reactive, ref, watch } from 'vue';
import { useServerStore } from '@/store/server';
import { storeToRefs } from 'pinia/dist/pinia';
import MonitorDataCard from '@/components/Monitor/MonitorDataCard.vue';
import TitleDataDivVertical from '@/components/Monitor/TitleDataDivVertical.vue';
import TitleDataDivHorizon from '@/components/Monitor/TitleDataDivHorizon.vue';
import { autoTransferMemUnit } from '@/service/utils';
import { RealTimeLineChartData, RealTimeLineChartOption } from '@/service/graphConfig';

const serverStore = useServerStore();
const { diskStaticInfo, diskReadLastMin, diskWriteLastMin, diskUsageLastSec, diskAvailLastSec } =
    storeToRefs(serverStore);

const diskMaxUnit = ref('');
watch([diskWriteLastMin, diskReadLastMin], (val) => {
    let _diskMax = Math.max(...val[0]);
    _diskMax = Math.max(_diskMax, ...val[1]);
    diskMaxUnit.value = autoTransferMemUnit(_diskMax);
});

const data = reactive(new RealTimeLineChartData());
data.setData(diskReadLastMin, 'rgba(0, 181, 181, 0.72)');
data.setData(diskWriteLastMin, 'rgba(0, 181, 181, 0.72)');
data.datasets[1].backgroundColor = 'rgba(0, 0, 0, 0)';
data.datasets[1].borderDash = [5, 5];

const options = new RealTimeLineChartOption();
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
            <h5>磁盘</h5>
        </template>
        <template #unit-and-max>
            <div class="flex justify-content-between text-gray-600 text-xs">
                <span>吞吐量</span>
                <span>{{ diskMaxUnit }}</span>
            </div>
        </template>
        <template #chart>
            <Chart type="line" :data="data" :options="options" class="h-20rem" />
        </template>
        <template #real-time-info>
            <div class="flex flex-column">
                <div class="flex flex-wrap">
                    <TitleDataDivVertical
                        class="pr-5 pl-1 mt-2"
                        style="border-left: 0.25rem solid rgba(0, 181, 181, 0.72)"
                        title="读取速度"
                        :data="autoTransferMemUnit(diskReadLastMin[59]) + '/S'"
                    />
                    <TitleDataDivVertical
                        class="pr-3 pl-1 mt-2"
                        title="写入速度"
                        style="border-left: 0.25rem dashed rgba(0, 181, 181, 0.72)"
                        :data="autoTransferMemUnit(diskWriteLastMin[59]) + '/S'"
                    />
                </div>
                <div class="flex flex-wrap">
                    <TitleDataDivVertical
                        class="pr-3 pt-2"
                        title="当前使用"
                        :data="autoTransferMemUnit(diskUsageLastSec)"
                    />
                    <TitleDataDivVertical
                        class="pr-3 pt-2"
                        title="使用百分比"
                        :data="serverStore.diskUsageRatioLastSec + '%'"
                    />
                    <TitleDataDivVertical
                        class="pr-3 pt-2"
                        title="当前可用"
                        :data="autoTransferMemUnit(diskAvailLastSec)"
                    />
                </div>
            </div>
        </template>
        <template #static-info>
            <div class="flex flex-wrap flex-column">
                <TitleDataDivHorizon title="磁盘容量：" :data="autoTransferMemUnit(diskStaticInfo.diskTotalSize)" />
            </div>
        </template>
    </MonitorDataCard>
</template>
