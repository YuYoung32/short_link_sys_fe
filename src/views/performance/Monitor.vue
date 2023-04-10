<script setup>
/**
 * Created by YuYoung on 2023/3/23
 * Description: 性能监控
 */

import { computed, ref, watch } from 'vue';
import { useServerStore } from '@/store/server';
import { storeToRefs } from 'pinia/dist/pinia';
import { autoTransferMemUnit, autoTransferMem, formatSeconds } from '@/service/utils';
import OneMinLineChart from '@/components/OneMinLineChart.vue';
import OneMin2LineChart from '@/components/OneMin2LineChart.vue';

const serverStore = useServerStore();
const {
    cpuUsageRatioLastMin,
    cpuStaticInfo,
    cpuFreqLastSec,
    cpuRunningTime,

    memUsageLastMin,
    memStaticInfo,
    memUsageLastSec,
    memAvailLastSec,
    swapUsageLastSec,

    diskStaticInfo,
    diskReadLastMin,
    diskWriteLastMin,
    diskUsageLastSec,
    diskAvailLastSec
} = storeToRefs(serverStore);

// region 1分钟x坐标轴
const minuteLabels = ref([]);
for (let i = 0; i < 60; i++) {
    minuteLabels.value.push('');
}
minuteLabels.value[0] = '       60秒';
minuteLabels.value[30] = '30秒';
minuteLabels.value[59] = '1秒       ';
// endregion

serverStore.fetchServerStaticInfo();
serverStore.fetchInfoLast1Min().then(() => {
    serverStore.fetchRealtimeServerInfo();
});

const memUsageLastMinTransferUnit = computed(() => {
    const tmp = [];
    for (let i = 0; i < memUsageLastMin.value.length; i++) {
        tmp.push(autoTransferMem(memUsageLastMin.value[i]));
    }
    return tmp;
});
const diskMaxUnit = ref('');
watch([diskWriteLastMin, diskReadLastMin], (val) => {
    let _diskMax = Math.max(...val[0]);
    _diskMax = Math.max(_diskMax, ...val[1]);
    diskMaxUnit.value = autoTransferMemUnit(_diskMax);
});
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12 xl:col-6">
            <OneMinLineChart
                title="CPU"
                :data="cpuUsageRatioLastMin"
                border-color="rgba(255, 0, 0, 0.72)"
                min="0"
                max="100"
                unit="使用率%"
                max-unit="100%"
            >
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
                                <div class="text-2xl">{{ (cpuFreqLastSec / 1000).toFixed(2) }}GHz</div>
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
            </OneMinLineChart>
        </div>
        <div class="col-12 xl:col-6">
            <OneMinLineChart
                title="内存"
                :data="memUsageLastMinTransferUnit"
                border-color="rgba(0, 106, 255, 0.72)"
                unit="使用量"
                :max-unit="autoTransferMemUnit(memStaticInfo.physicalTotalSize)"
                :min="Number(0)"
                :max="autoTransferMem(memStaticInfo.physicalTotalSize)"
            >
                <div class="flex justify-content-between">
                    <!--实时数据-->
                    <div class="col-4 mr-3">
                        <div class="grid">
                            <div class="mt-2 mr-3">
                                <div class="text-sm text-gray-700 -mb-1">使用中</div>
                                <div class="text-2xl">{{ autoTransferMemUnit(memUsageLastSec) }}</div>
                            </div>
                            <div class="mt-2 mr-3">
                                <div class="text-sm text-gray-700 -mb-1">使用百分比</div>
                                <div class="text-2xl">{{ serverStore.memUsageRatioLastSec }}%</div>
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
            </OneMinLineChart>
        </div>
        <div class="col-12 xl:col-6">
            <OneMin2LineChart
                title="磁盘"
                :data1="diskReadLastMin"
                border-color1="rgba(0, 181, 181, 0.72)"
                :data2="diskWriteLastMin"
                border-color2="rgba(0, 181, 181, 0.72)"
                unit="吞吐量"
                :max-unit="diskMaxUnit"
            >
                <div class="flex justify-content-between">
                    <!--实时数据-->
                    <div class="col-4 mr-3">
                        <div class="grid">
                            <div class="pt-2 mr-3">
                                <div class="text-sm text-gray-700 -mb-1">读取速度</div>
                                <div class="text-2xl">{{ autoTransferMemUnit(diskReadLastMin[59]) }}/S</div>
                            </div>
                            <div class="pt-2 mr-3">
                                <div class="text-sm text-gray-700 -mb-1">写入速度</div>
                                <div class="text-2xl">{{ autoTransferMemUnit(diskWriteLastMin[59]) }}/S</div>
                            </div>
                        </div>
                        <div class="grid pt-3">
                            <div class="pt-2 mr-3">
                                <div class="text-sm text-gray-700 -mb-1">当前使用</div>
                                <div class="text-2xl">{{ autoTransferMemUnit(diskUsageLastSec) }}</div>
                            </div>
                            <div class="pt-2 mr-3">
                                <div class="text-sm text-gray-700 -mb-1">使用百分比</div>
                                <div class="text-2xl">{{ serverStore.diskUsageRatioLastSec }}%</div>
                            </div>
                            <div class="pt-2 mr-3">
                                <div class="text-sm text-gray-700 -mb-1">当前可用</div>
                                <div class="text-2xl">{{ autoTransferMemUnit(diskAvailLastSec) }}</div>
                            </div>
                        </div>
                    </div>
                    <!--静态信息-->
                    <div class="text-sm">
                        <div class="mt-2">
                            <span class="text-gray-700">磁盘容量：</span>
                            <span class="text-800">{{ autoTransferMemUnit(diskStaticInfo.diskTotalSize) }}</span>
                        </div>
                    </div>
                </div>
            </OneMin2LineChart>
        </div>
    </div>
</template>
