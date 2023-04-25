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
const { visitAmount, visitIPAmount, visitIPRegionAndAMountWithProvince } = storeToRefs(visitStore);

//region 筛选
// region 筛选日期
const lastDay = () => new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
const lastWeek = () => new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
const last15Days = () => new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000);
const last30Days = () => new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);

const dateKeywords = ref([new Date(), new Date()]);
dateKeywords.value[0] = lastWeek();
dateKeywords.value[1] = lastDay();

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
const linkSummaryShow = ref(false);
// endregion
//endregion 筛选

// region 图表-访问量和IP量折线图
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
            backgroundColor: '#6366f1',
            borderWidth: 2,
            pointRadius: 2,
            borderColor: '#6366f1',
            tension: 0.3
        },
        {
            label: '访问IP数量',
            data: visitIPAmount,
            borderWidth: 2,
            pointRadius: 2,
            backgroundColor: '#8a2be2',
            borderColor: '#8a2be2',
            tension: 0.3
        }
    ]
});
const lineOptions = ref({
    animation: true,
    maintainAspectRatio: false, // 是否保持长宽比
    scales: {
        y: {
            position: 'left',
            ticks: {
                stepSize: 1
            },
            min: 0,
            max: () => {
                const max = Math.max(Math.max(...visitAmount.value), Math.max(...visitIPAmount.value));
                if (max < 10) {
                    return max;
                }
                return max + 10;
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
                display: true
            }
        }
    },
    layout: {
        autoPadding: false,
        padding: {
            bottom: 2
        }
    }
});
//endregion

// region 图表-访问IP饼状图
const provinceToColor = {
    安徽: '#ff4500',
    北京: '#8fbc8f',
    重庆: '#34568B',
    福建: '#FF6F61',
    甘肃: '#ffd700',
    广东: '#1e90ff',
    广西: '#32cd32',
    贵州: '#f08080',
    海南: '#bdb76b',
    河北: '#6B5B95',
    河南: '#20b2aa',
    黑龙江: '#9932cc',
    湖北: '#00ffff',
    湖南: '#ff7f50',
    吉林: '#9acd32',
    江苏: '#ff8c00',
    江西: '#5f9ea0',
    辽宁: '#00bfff',
    内蒙古: '#88B04B',
    宁夏: '#66cdaa',
    青海: '#8a2be2',
    山东: '#F7CAC9',
    山西: '#00fa9a',
    陕西: '#7b68ee',
    上海: '#dc143c',
    四川: '#00ced1',
    台湾: '#556b2f',
    天津: '#b03060',
    西藏: '#955251',
    新疆: '#4682b4',
    云南: '#d2b48c',
    浙江: '#55B4B0',
    香港: '#2f4f4f',
    澳门: '#00ff7f',
    海外: '#ffa07a',
    未知: '#556b2f'
};

const visitIPRegionColors = ref([]);
const visitIPRegionWithProvince = ref([]);
const visitIPAmountWithProvince = ref([]);
// 以下两个变量是为了把xx省xx市归纳为为xx省
watch(
    visitIPRegionAndAMountWithProvince,
    (val) => {
        if (!val || val.length <= 0) {
            return;
        }
        for (let i = 0; i < val[0].length; i++) {
            try {
                visitIPRegionColors.value.push(provinceToColor[val[0][i]]);
            } catch (e) {
                visitIPRegionColors.value.push('#556b2f');
            }
        }
        visitIPRegionWithProvince.value = val[0];
        visitIPAmountWithProvince.value = val[1];
    },
    { deep: true }
);
const pieData = ref({
    labels: visitIPRegionWithProvince,
    datasets: [
        {
            data: visitIPAmountWithProvince,
            backgroundColor: visitIPRegionColors
        }
    ]
});
const pieOptions = ref({
    maintainAspectRatio: false, // 是否保持长宽比
    plugins: {
        legend: {
            labels: {
                usePointStyle: true
            }
        }
    }
});
//endregion

function confirmFilter() {
    visitStore.fetchVisitStatics(
        dateObjToDayBeginUnixTime(dateKeywords.value[0]),
        dateObjToDayEndUnixTime(dateKeywords.value[1]),
        linkBySLKeyword.value.shortLink
    );
    visitStore.fetchVisitIPRegion(
        dateObjToDayBeginUnixTime(dateKeywords.value[0]),
        dateObjToDayEndUnixTime(dateKeywords.value[1]),
        linkBySLKeyword.value.shortLink
    );
}

function clearAllFilter() {
    dateKeywords.value = [lastWeek(), lastDay()];
    linkBySLKeyword.value = '';
}

function search(event) {
    const query = event.query;
    linkStore.fetchLinks({ shortLink: query, longLink: query, comment: '' }, -1);
}

visitStore.fetchVisitStatics(
    dateObjToDayBeginUnixTime(dateKeywords.value[0]),
    dateObjToDayEndUnixTime(dateKeywords.value[1]),
    linkBySLKeyword.value.shortLink
);
visitStore.fetchVisitIPRegion(
    dateObjToDayBeginUnixTime(dateKeywords.value[0]),
    dateObjToDayEndUnixTime(dateKeywords.value[1]),
    linkBySLKeyword.value.shortLink
);
</script>

<template>
    <div class="grid">
        <!--筛选-->
        <div class="col-12">
            <div class="card">
                <h4>筛选</h4>
                <div class="flex justify-content-center align-content-center flex-column md:flex-row">
                    <!--时间-->
                    <div class="pt-2 mr-4 w-full md:w-6">
                        <Card style="min-height: 21rem">
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
                                                    @click="
                                                        dateKeywords[0] = lastWeek();
                                                        dateKeywords[1] = lastDay();
                                                        refreshCalendar();
                                                    "
                                                ></Button>
                                            </div>
                                        </template>
                                    </Calendar>
                                    <div class="mt-3 py-1">
                                        <Button
                                            label="过去1天（24小时）"
                                            class="my-2"
                                            @click="
                                                dateKeywords[0] = lastDay();
                                                dateKeywords[1] = lastDay();
                                                refreshCalendar();
                                            "
                                        ></Button>
                                        <div class="flex">
                                            <Button
                                                label="过去7天（默认）"
                                                class="mr-2"
                                                @click="
                                                    dateKeywords[0] = lastWeek();
                                                    dateKeywords[1] = lastDay();
                                                    refreshCalendar();
                                                "
                                            ></Button>
                                            <Button
                                                label="过去15天"
                                                class="mr-2"
                                                @click="
                                                    dateKeywords[0] = last15Days();
                                                    dateKeywords[1] = lastDay();
                                                    refreshCalendar();
                                                "
                                            ></Button>
                                            <Button
                                                label="过去30天"
                                                class=""
                                                @click="
                                                    dateKeywords[0] = last30Days();
                                                    dateKeywords[1] = lastDay();
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
                    <div class="pt-4 md:pt-2 w-full md:w-6">
                        <Card style="min-height: 21rem">
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
                                        @focus="linkSummaryShow = false"
                                        @blur="linkSummaryShow = true"
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
                                        <div v-if="!(linkSummaryShow && linkBySLKeyword)">
                                            <h3 class="flex align-items-center justify-content-center text-500">
                                                未选择
                                            </h3>
                                        </div>
                                        <div v-if="linkSummaryShow && linkBySLKeyword">
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
                <div class="flex justify-content-between align-content-center md:justify-content-end mt-3">
                    <Button
                        label="清除筛选"
                        icon="pi pi-filter-slash"
                        class="p-button-danger mr-2"
                        @click="clearAllFilter"
                    />
                    <Button label="确认筛选" icon="pi pi-filter" class="p-button-success" @click="confirmFilter" />
                </div>
            </div>
        </div>
        <!--访问量 折线图-->
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>访问-时间</h5>
                <h3
                    v-if="!(visitAmount && visitAmount.length > 0)"
                    class="flex align-items-center justify-content-center text-500 my-6"
                >
                    无数据
                </h3>
                <div v-if="visitAmount && visitAmount.length > 0">
                    <Chart type="line" :data="lineData" :options="lineOptions" style="min-height: 20rem"></Chart>
                </div>
            </div>
        </div>
        <!--IP来源 饼状图-->
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>访问IP来源</h5>
                <h3
                    v-if="!(visitIPRegionAndAMountWithProvince && visitIPRegionAndAMountWithProvince[0].length > 0)"
                    class="flex align-items-center justify-content-center text-500 my-6"
                >
                    无数据
                </h3>
                <div v-if="visitIPRegionAndAMountWithProvince && visitIPRegionAndAMountWithProvince[0].length > 0">
                    <Chart type="pie" :data="pieData" :options="pieOptions" style="min-height: 20rem" />
                </div>
            </div>
        </div>
    </div>
</template>
