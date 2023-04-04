<script setup>
/**
 * Created by YuYoung on 2023/3/24
 * Description: 时间访问量柱状图
 */

import { ref, reactive, defineProps, watchEffect } from 'vue';
import { useVisitStore } from '@/store/visit';
import { storeToRefs } from 'pinia';

const visitStore = useVisitStore();

const { visitAmountLastBetween } = storeToRefs(visitStore);

const props = defineProps(['title', 'begin', 'end']);
const titleRef = ref(props.title);

const xData = reactive([]);
watchEffect(async () => {
    await visitStore.fetchVisitAmountLastBetween(props.begin, props.end);
    xData.splice(0, xData.length);

    const startDate = props.begin;
    const endDate = props.end;
    const start = new Date(startDate.substring(0, 4), parseInt(startDate.substring(4, 6)) - 1, startDate.substring(6));
    const end = new Date(endDate.substring(0, 4), parseInt(endDate.substring(4, 6)) - 1, endDate.substring(6));

    // 循环遍历两个日期之间的每一天，并将其添加到数组中
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        xData.push(`${year}${month}${day}`);
    }
});

const data = reactive({
    labels: xData,
    datasets: [
        {
            data: visitAmountLastBetween,
            fill: true,
            borderColor: '#6366F1',
            backgroundColor: '#6366F1',
            borderWidth: 1
        }
    ]
});

const options = {
    animation: true,
    maintainAspectRatio: false, // 是否保持长宽比
    plugins: {
        legend: {
            display: false
        }
    }
};
</script>

<template>
    <div class="col-12 xl:col-6">
        <div class="card">
            <h5>{{ titleRef }}</h5>
            <Chart type="bar" :data="data" :options="options" class="h-20rem" />
        </div>
    </div>
</template>
