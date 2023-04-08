<script setup>
/**
 * Created by YuYoung on 2023/4/7
 * Description: 1分钟实时数据线图
 */
import { defineProps, reactive, ref, toRefs, watchEffect } from 'vue';

const props = defineProps(['title', 'unit', 'maxUnit', 'data', 'borderColor', 'backgroundColor', 'min', 'max']);

const { title, unit, maxUnit, data, borderColor, backgroundColor, min, max } = toRefs(props);

const minuteLabels = ref([]);
for (let i = 0; i < 60; i++) {
    minuteLabels.value.push('');
}
const lineData = reactive({
    labels: minuteLabels,
    datasets: [
        {
            data: data,
            fill: true,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            borderWidth: 1,
            pointRadius: 1,
            tension: 0.1
        }
    ]
});

const borderWidth = 2;
const lineOptions = {
    animation: false,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            position: 'left',
            grid: {
                drawTicks: false
            },
            ticks: {
                display: false
            },
            border: {
                display: true,
                width: borderWidth
            }
        },
        y2: {
            position: 'right',
            grid: {
                display: false,
                drawTicks: false
            },
            ticks: {
                display: false
            },
            border: {
                display: true,
                width: borderWidth
            }
        },
        x: {
            position: 'bottom',
            grid: {
                drawTicks: false
            },
            ticks: {
                display: false,
                maxTicksLimit: 6
            },
            border: {
                display: true,
                width: borderWidth
            }
        },
        x2: {
            position: 'top',
            grid: {
                display: false,
                drawTicks: false
            },
            ticks: {
                display: false
            },
            border: {
                display: true,
                width: borderWidth
            }
        }
    },
    layout: {
        autoPadding: false,
        padding: {
            bottom: 2
        }
    }
};
watchEffect(() => {
    if (min.value !== undefined) {
        lineOptions.scales.y.min = min.value;
    }
    if (max.value !== undefined) {
        lineOptions.scales.y.max = max.value;
    }
});
</script>

<template>
    <div class="card">
        <h5>{{ title }}</h5>
        <div class="flex justify-content-between text-gray-600 text-xs">
            <span>{{ unit }}</span>
            <span>{{ maxUnit }}</span>
        </div>
        <Chart type="line" :data="lineData" :options="lineOptions" class="h-20rem" />
        <div class="flex justify-content-between text-gray-600 text-xs">
            <span>60秒</span>
            <span>30秒</span>
            <span>0</span>
        </div>
        <slot></slot>
    </div>
</template>
