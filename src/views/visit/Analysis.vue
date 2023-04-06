<script setup>
/**
 * Created by YuYoung on 2023/3/23
 * Description: 访问分析
 */
import { nextTick, ref, watch } from 'vue';
import { useLinkStore } from '@/store/link';
import { useVisitStore } from '@/store/visit';
import { storeToRefs } from 'pinia/dist/pinia';
import {
    dateBetweenToList,
    dateObjToDayBeginUnixTime,
    dateObjToDayEndUnixTime,
    unixTimeToString
} from '@/service/utils';

const visitStore = useVisitStore();
const linkStore = useLinkStore();
const { links, linksTotal } = storeToRefs(linkStore);
const { visitAmount, visitIPLastBetween } = storeToRefs(visitStore);

//region 筛选
// region 筛选日期
const lastDay = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
const lastWeek = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
const last15Days = new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000);
const last30Days = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);

const dateKeywords = ref([lastDay, lastDay]);

const showCalendar = ref(true);
function refreshCalendar() {
    showCalendar.value = false;
    nextTick(() => {
        showCalendar.value = true;
    });
}
// endregion

// region 筛选短链
const linkBySLKeyword = ref('');
const filterDatatableShow = ref(false);
// endregion
//endregion 筛选

// region 图表-访问量和IP量
const labelDateList = ref([]);
watch(
    () => visitAmount.value,
    () => {
        labelDateList.value = dateBetweenToList(dateKeywords.value[0], dateKeywords.value[1]);
    }
);
const lineData = ref({
    labels: labelDateList,
    datasets: [
        {
            label: '访问数量',
            data: visitAmount,
            fill: false,
            backgroundColor: '#6366f1',
            borderColor: '#6366f1',
            tension: 0.1
        },
        {
            label: '访问IP数量',
            data: visitIPLastBetween,
            fill: false,
            backgroundColor: '#bcbdf9',
            borderColor: '#bcbdf9',
            tension: 0.1
        }
    ]
});
const lineOptions = ref({
    animation: true,
    maintainAspectRatio: false // 是否保持长宽比
});
//endregion

function confirmFilter() {
    visitStore.fetchVisitStatics(
        dateObjToDayBeginUnixTime(dateKeywords.value[0]),
        dateObjToDayEndUnixTime(dateKeywords.value[1]),
        linkBySLKeyword.value
    );
}

function clearAllFilter() {
    dateKeywords.value = [lastWeek, lastDay];
    linkBySLKeyword.value = '';
}

function search(event) {
    const query = event.query;
    linkStore.fetchLinks({ shortLink: query, longLink: query, comment: '' }, -1);
}

visitStore.fetchVisitStatics(
    dateObjToDayBeginUnixTime(dateKeywords.value[0]),
    dateObjToDayEndUnixTime(dateKeywords.value[1]),
    linkBySLKeyword.value
);
</script>

<template>
    <!--筛选-->
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h4>筛选</h4>
                <div class="grid">
                    <!--时间-->
                    <div class="mt-2 sm:col-12 md:col-6">
                        <Card class="h-19rem">
                            <template v-slot:title>
                                <h5 class="font-medium">时间（必选）</h5>
                            </template>

                            <template v-slot:content>
                                <div class="p-fluid">
                                    <Calendar
                                        v-if="showCalendar"
                                        v-model="dateKeywords"
                                        showIcon
                                        placeholder="时间段...选择两个日期（可重复）"
                                        selection-mode="range"
                                        date-format="yymmdd"
                                        showOtherMonths
                                        selectOtherMonths
                                        :max-date="new Date(new Date().getTime() - 24 * 60 * 60 * 1000)"
                                    >
                                        <template #footer>
                                            <div class="py-2 px-3">
                                                <Button
                                                    label="还原"
                                                    severity="danger"
                                                    @click="dateKeywords = [lastWeek, lastDay]"
                                                ></Button>
                                            </div>
                                        </template>
                                    </Calendar>
                                    <div class="mt-3 py-1">
                                        <Button
                                            label="过去1天（24小时）"
                                            class="my-2"
                                            @click="
                                                dateKeywords[0] = lastDay;
                                                dateKeywords[1] = lastDay;
                                                refreshCalendar();
                                            "
                                        ></Button>
                                        <div class="flex">
                                            <Button
                                                label="过去7天（默认）"
                                                class="mr-2 w-4"
                                                @click="
                                                    dateKeywords[0] = lastWeek;
                                                    dateKeywords[1] = lastDay;
                                                    refreshCalendar();
                                                "
                                            ></Button>
                                            <Button
                                                label="过去15天"
                                                class="mr-2 w-4"
                                                @click="
                                                    dateKeywords[0] = last15Days;
                                                    dateKeywords[1] = lastDay;
                                                    refreshCalendar();
                                                "
                                            ></Button>
                                            <Button
                                                label="过去30天"
                                                class="w-4"
                                                @click="
                                                    dateKeywords[0] = last30Days;
                                                    dateKeywords[1] = lastDay;
                                                    refreshCalendar();
                                                "
                                            ></Button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Card>
                    </div>
                    <!--短链-->
                    <div class="mt-2 sm:col-12 md:col-6">
                        <Card class="h-19rem">
                            <template v-slot:title>
                                <h5 class="font-medium">短链</h5>
                            </template>

                            <template v-slot:content>
                                <div class="p-fluid">
                                    <AutoComplete
                                        v-model="linkBySLKeyword"
                                        :suggestions="links"
                                        option-label="shortLink"
                                        @complete="search($event)"
                                        force-selection
                                        placeholder="短链或长链的关键字..."
                                        :delay="500"
                                        @focus="filterDatatableShow = false"
                                        @blur="filterDatatableShow = true"
                                    >
                                        <template #empty>
                                            <div class="flex align-items-center justify-content-center">
                                                未找到匹配的短链
                                            </div>
                                        </template>
                                        <template #header>
                                            <div class="flex align-items-center justify-content-center">
                                                显示总计{{ linksTotal }}条的{{ links.length }}条
                                            </div>
                                        </template>
                                        <template #option="slotProps">
                                            <div class="flex align-items-center justify-content-center">
                                                <div>{{ slotProps.option.shortLink }}</div>
                                                &nbsp;|&nbsp;
                                                <div>{{ slotProps.option.longLink }}</div>
                                                &nbsp;|&nbsp;
                                                <div>{{ slotProps.option.comment }}</div>
                                            </div>
                                        </template>
                                    </AutoComplete>
                                    <div class="card py-2 px-3 mt-4">
                                        <h6>当前短链信息：</h6>
                                        <div v-if="!(filterDatatableShow && linkBySLKeyword)">
                                            <h3 class="flex align-items-center justify-content-center text-500">
                                                未选择
                                            </h3>
                                        </div>
                                        <div v-if="filterDatatableShow && linkBySLKeyword">
                                            短链：{{ linkBySLKeyword.shortLink }}
                                            <br />
                                            长链：{{ linkBySLKeyword.longLink }}
                                            <br />
                                            备注：{{ linkBySLKeyword.comment }}
                                            <br />
                                            创建时间：{{ unixTimeToString(linkBySLKeyword.createTime) }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </Card>
                    </div>
                </div>
                <div class="flex align-content-center justify-content-end">
                    <div class="my-2">
                        <Button
                            label="确认筛选"
                            icon="pi pi-filter"
                            class="p-button-success mr-2"
                            @click="confirmFilter"
                        />
                        <Button
                            label="清除筛选"
                            icon="pi pi-filter-slash"
                            class="p-button-danger"
                            @click="clearAllFilter"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--统计数据图表-->
    <div class="grid p-fluid">
        <div class="col-12">
            <div class="card">
                <h5>访问-时间 曲线图</h5>
                <h3 v-if="visitAmount.length <= 0" class="flex align-items-center justify-content-center text-500 my-6">
                    无数据
                </h3>
                <div v-if="visitAmount.length > 0">
                    <Chart type="line" :data="lineData" :options="lineOptions" style="min-height: 20rem"></Chart>
                </div>
            </div>
        </div>
    </div>
</template>
