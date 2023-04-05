<script setup>
/**
 * Created by YuYoung on 2023/3/24
 * Description: 时间访问量柱状图
 */

import { ref, reactive, defineProps, watch } from 'vue';
import { useVisitStore } from '@/store/visit';
import { storeToRefs } from 'pinia';

const visitStore = useVisitStore();

const { visitAmount } = storeToRefs(visitStore);

const props = defineProps(['title', 'begin', 'end']);
const titleRef = ref(props.title);

const xData = ref([]);
watch(
    () => props,
    async (props) => {
        await visitStore.fetchVisitStatics(props.begin, props.end);
        xData.value = [];

        const startDate = new Date();
        startDate.setTime(1000 * props.begin);
        const endDate = new Date();
        endDate.setTime(1000 * props.end);

        // 循环遍历两个日期之间的每一天，并将其添加到数组中
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            xData.value.push(`${year}${month}${day}`);
        }
    },
    { immediate: true, deep: true }
);

const data = reactive({
    labels: xData,
    datasets: [
        {
            data: visitAmount,
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
