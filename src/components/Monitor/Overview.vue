<script setup>
/**
 * Created by YuYoung on 2023/4/11
 * Description: 概览卡片
 */

import { useServerStore } from '@/store/server';
import { storeToRefs } from 'pinia/dist/pinia';
import { color } from '@/components/Monitor/color';
import { autoTransferMemUnit } from '@/service/utils';
import TitleDataDivVertical from '@/components/Monitor/TitleDataDivVertical.vue';

const serverStore = useServerStore();
const { cpuUsageRatioLastSec, diskReadLastMin, diskWriteLastMin, netRecvLastMin, netSendLastMin } =
    storeToRefs(serverStore);
</script>

<template>
    <div class="col-12">
        <div class="card">
            <h5>概览</h5>
            <div class="flex flex-wrap justify-content-between align-content-center">
                <div class="flex justify-content-between md:w-5 w-full">
                    <div class="flex-column">
                        <Knob
                            v-model="cpuUsageRatioLastSec"
                            valueTemplate="{value}%"
                            :min="0"
                            :max="100"
                            readonly
                            :value-color="color.cpu"
                        />
                        <div class="flex justify-content-center">CPU使用率</div>
                    </div>
                    <div class="flex-column">
                        <Knob
                            v-model="serverStore.memUsageRatioLastSec"
                            valueTemplate="{value}%"
                            :min="0"
                            :max="100"
                            readonly
                            :value-color="color.mem"
                        />
                        <div class="flex justify-content-center">内存使用率</div>
                    </div>
                </div>

                <div class="flex justify-content-between md:w-5 w-full">
                    <div class="flex-column">
                        <TitleDataDivVertical
                            class="pr-5 pl-1 mt-2"
                            :style="'border-left: 0.25rem solid ' + color.disk"
                            title="磁盘读取速度"
                            :data="autoTransferMemUnit(diskReadLastMin[59]) + '/S'"
                        />
                        <TitleDataDivVertical
                            class="pr-3 pl-1 mt-2"
                            title="磁盘写入速度"
                            :style="'border-left: 0.25rem dashed ' + color.disk"
                            :data="autoTransferMemUnit(diskWriteLastMin[59]) + '/S'"
                        />
                    </div>
                    <div class="flex-column">
                        <TitleDataDivVertical
                            class="pr-5 pl-1 mt-2"
                            :style="'border-left: 0.25rem solid ' + color.net"
                            title="网络接收速度"
                            :data="autoTransferMemUnit(netRecvLastMin[59]) + '/S'"
                        />
                        <TitleDataDivVertical
                            class="pr-3 pl-1 mt-2"
                            title="网络发送速度"
                            :style="'border-left: 0.25rem dashed ' + color.net"
                            :data="autoTransferMemUnit(netSendLastMin[59]) + '/S'"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
