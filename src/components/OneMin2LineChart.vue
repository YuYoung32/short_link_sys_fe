<script setup>
/**
 * Created by YuYoung on 2023/4/8
 * Description: 1分钟实时数据线图, 有两个数据列, 暂时无法解决如何动态设置多个数据列的问题
 */
import { defineProps, reactive, ref, toRefs, watchEffect } from 'vue';
import { autoTransferMemUnit, changeRgbaAlpha } from '@/service/utils';

const props = defineProps(['title', 'unit', 'maxUnit', 'data1', 'borderColor1', 'data2', 'borderColor2', 'min', 'max']);

const { title, unit, maxUnit, data1, data2, borderColor1, borderColor2, min, max } = toRefs(props);

const minuteLabels = ref([]);
for (let i = 0; i < 60; i++) {
    minuteLabels.value.push('');
}
const lineData = reactive({
    labels: minuteLabels,
    datasets: [
        {
            data: data1,
            fill: true,
            borderColor: borderColor1,
            backgroundColor: changeRgbaAlpha(borderColor1.value, 0.36),
            borderWidth: 1,
            pointRadius: 1,
            tension: 0.1
        },
        {
            data: data2,
            fill: false,
            borderDash: [5, 5],
            borderColor: borderColor2,
            backgroundColor: changeRgbaAlpha(borderColor2.value, 0.36),
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
        },
        tooltip: {
            callbacks: {
                // 修改提示框中每个数据点的文本内容
                label: function (context) {
                    return autoTransferMemUnit(context.parsed.y);
                }
            }
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
