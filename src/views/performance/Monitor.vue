<script setup>
/**
 * Created by YuYoung on 2023/3/23
 * Description: 性能监控
 */

import { reactive, ref } from 'vue';
import { useServerStore } from '@/store/server';
import { storeToRefs } from 'pinia/dist/pinia';
import { autoTransferMemUnit, formatSeconds } from '@/service/utils';

const serverStore = useServerStore();
const {
    cpuUsageRatioLastMin,
    cpuStaticInfo,
    cpuFreq,
    cpuRunningTime,

    memUsageRatioLastMin,
    memStaticInfo,
    memUsageLastSec,
    memAvailLastSec,
    swapUsageLastSec
} = storeToRefs(serverStore);

// region 1分钟x坐标轴
const minuteLabels = ref([]);
for (let i = 0; i < 60; i++) {
    minuteLabels.value.push('');
}
minuteLabels.value[0] = '60秒';
minuteLabels.value[29] = '30秒';
minuteLabels.value[30] = '31秒';
minuteLabels.value[57] = '2秒';
minuteLabels.value[58] = '1秒';
minuteLabels.value[59] = '0秒';
// endregion

const lineOptions = {
    animation: false,
    maintainAspectRatio: false, // 是否保持长宽比
    plugins: {
        legend: {
            display: false
        }
    }
};

const cpuLineData = reactive({
    labels: minuteLabels,
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

const memLineData = reactive({
    labels: minuteLabels,
    datasets: [
        {
            data: cpuUsageRatioLastMin,
            fill: true,
            borderColor: 'rgba(0,106,255,0.72)',
            backgroundColor: 'rgba(0,106,255,0.36)',
            borderWidth: 1,
            pointRadius: 1,
            tension: 0.1
        }
    ]
});

serverStore.fetchServerStaticInfo();
serverStore.fetchInfoLast1Min().then(() => {
    serverStore.fetchRealtimeServerInfo();
});
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>CPU</h5>
                <div class="text-600 text-xs">使用率%</div>
                <Chart type="line" :data="cpuLineData" :options="lineOptions" class="h-20rem" />
                <div class="flex justify-content-between">
                    <!--实时数据-->
                    <div class="col-4 mr-3">
                        <div class="grid">
                            <div class="mt-2 mr-3">
                                <div class="text-sm text-gray-700 -mb-1">当前</div>
                                <div class="text-2xl">{{ cpuUsageRatioLastMin[59] }}%</div>
                            </div>
                            <div class="mt-2">
                                <div class="text-sm text-gray-700 -mb-1">速度</div>
                                <div class="text-2xl">{{ cpuFreq }}MHz</div>
                            </div>
                        </div>
                        <div class="grid mt-2">
                            <div>
                                <div class="text-sm text-gray-700 -mb-1">正常运行时间</div>
                                <div class="text-2xl">{{ formatSeconds(cpuRunningTime) }}</div>
                            </div>
                        </div>
                    </div>
                    <!--静态信息-->
                    <div class="text-sm">
                        <div class="mt-2">
                            <span class="text-gray-700">型号：</span>
                            <span class="text-800">{{ cpuStaticInfo.name }}</span>
                        </div>
                        <div class="mt-1">
                            <span class="text-gray-700">核心数：</span>
                            <span class="text-800">{{ cpuStaticInfo.coreNum }}</span>
                        </div>
                        <div class="mt-1">
                            <span class="text-gray-700">线程数：</span>
                            <span class="text-800">{{ cpuStaticInfo.threadNum }}</span>
                        </div>
                        <div class="mt-1">
                            <span class="text-gray-700">缓存：</span>
                            <span class="text-800">{{ cpuStaticInfo.cacheSize }}MB</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>内存</h5>
                <div class="text-600 text-xs">使用率%</div>
                <Chart type="line" :data="memLineData" :options="lineOptions" class="h-20rem" />
                <div class="flex justify-content-between">
                    <!--实时数据-->
                    <div class="col-4 mr-3">
                        <div class="grid">
                            <div class="mt-2 mr-3">
                                <div class="text-sm text-gray-700 -mb-1">当前</div>
                                <div class="text-2xl">{{ memUsageRatioLastMin[59] }}%</div>
                            </div>
                            <div class="mt-2 mr-3">
                                <div class="text-sm text-gray-700 -mb-1">使用中</div>
                                <div class="text-2xl">{{ autoTransferMemUnit(memUsageLastSec) }}</div>
                            </div>
                            <div class="mt-2">
                                <div class="text-sm text-gray-700 -mb-1">可用</div>
                                <div class="text-2xl">{{ autoTransferMemUnit(memAvailLastSec) }}</div>
                            </div>
                        </div>
                        <div class="grid mt-2">
                            <div>
                                <div class="text-sm text-gray-700 -mb-1">已使用交换内存</div>
                                <div class="text-2xl">{{ autoTransferMemUnit(swapUsageLastSec) }}</div>
                            </div>
                        </div>
                    </div>
                    <!--静态信息-->
                    <div class="text-sm">
                        <div class="mt-2">
                            <span class="text-gray-700">物理内存总量：</span>
                            <span class="text-800">{{ autoTransferMemUnit(memStaticInfo.physicalTotalSize) }}</span>
                        </div>
                        <div class="mt-1">
                            <span class="text-gray-700">交换内存总量：</span>
                            <span class="text-800">{{ autoTransferMemUnit(memStaticInfo.swapTotalSize) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
