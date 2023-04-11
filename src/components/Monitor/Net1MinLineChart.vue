<script setup>
/**
 * Created by YuYoung on 2023/4/10
 * Description: 网络1分钟实时数据线图
 */

import { reactive, ref, watch } from 'vue';
import { autoTransferMemUnit } from '@/service/utils';
import TitleDataDivVertical from '@/components/Monitor/TitleDataDivVertical.vue';
import TitleDataDivHorizon from '@/components/Monitor/TitleDataDivHorizon.vue';
import MonitorDataCard from '@/components/Monitor/MonitorDataCard.vue';
import { useServerStore } from '@/store/server';
import { RealTimeLineChartData, RealTimeLineChartOption } from '@/service/graphConfig';
import { storeToRefs } from 'pinia/dist/pinia';
import { color } from '@/components/Monitor/color';

const serverStore = useServerStore();
const { netRecvLastMin, netSendLastMin, netStaticInfo } = storeToRefs(serverStore);

const data = reactive(new RealTimeLineChartData());
data.setData(netSendLastMin, color.net);
data.setData(netRecvLastMin, color.net);
data.datasets[1].backgroundColor = color.transparent;
data.datasets[1].borderDash = [5, 5];
const options = new RealTimeLineChartOption();
options.plugins.tooltip = {
    callbacks: {
        label: (context) => {
            return autoTransferMemUnit(context.parsed.y);
        }
    }
};

const netMaxUnit = ref('');
watch([netRecvLastMin, netSendLastMin], (val) => {
    let _netMaxUnit = Math.max(...val[0]);
    _netMaxUnit = Math.max(_netMaxUnit, ...val[1]);
    netMaxUnit.value = autoTransferMemUnit(_netMaxUnit);
});
</script>

<template>
    <MonitorDataCard>
        <template #title>
            <h5>网络</h5>
        </template>
        <template #unit-and-max>
            <div class="flex justify-content-between text-gray-600 text-xs">
                <span>吞吐量</span>
                <span>{{ netMaxUnit }}</span>
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
                        :style="'border-left: 0.25rem solid ' + color.net"
                        title="接收速度"
                        :data="autoTransferMemUnit(netRecvLastMin[59]) + '/S'"
                    />
                    <TitleDataDivVertical
                        class="pr-3 pl-1 mt-2"
                        title="发送速度"
                        :style="'border-left: 0.25rem dashed ' + color.net"
                        :data="autoTransferMemUnit(netSendLastMin[59]) + '/S'"
                    />
                </div>
            </div>
        </template>
        <template #static-info>
            <div class="flex flex-wrap flex-column">
                <TitleDataDivHorizon title="IPv4：" :data="netStaticInfo.ipv4" />
                <TitleDataDivHorizon title="MAC：" :data="netStaticInfo.mac" />
            </div>
        </template>
    </MonitorDataCard>
</template>
