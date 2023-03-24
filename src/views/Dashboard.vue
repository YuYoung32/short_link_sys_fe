<script setup>
/**
 * Created by YuYoung on 2023/3/20
 * Description: Dashboard
 */

import {storeToRefs} from "pinia";
import {useServerStore} from "@/store/server";
import {useVisitStore} from "@/store/visit";
import {useLinksStore} from "@/store/link";
import DataShowCard from "@/components/DataShowCard";
import Cpu1MinLineChart from "@/components/Cpu1MinLineChart";
import VisitTimeAmountBarChart from "@/components/VisitTimeAmountBarChart";


const serverStore = useServerStore();
const visitStore = useVisitStore();
const linkStore = useLinksStore();

const {isOnline, avgCPURatioLastMin} = storeToRefs(serverStore);
const {amountTotal} = storeToRefs(linkStore);
const {visitAmountLast24HourTotal} = storeToRefs(visitStore);

serverStore.fetchRealtimeServerInfo();
visitStore.fetchVisitAmountXHourTotal(24);
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
    <data-show-card title="24小时转发" :msg="visitAmountLast24HourTotal + ' 次'"/>
    <!-- 3 数据库总链接数 -->
    <data-show-card title="数据库存储链接" :msg="amountTotal + ' 个'"/>
    <!-- 4 过去1分钟CPU平均占用率 -->
    <data-show-card title="1分钟CPU平均使用" :msg="avgCPURatioLastMin + ' %'"/>

    <cpu1-min-line-chart/>
    <visit-time-amount-bar-chart/>

  </div>
</template>
