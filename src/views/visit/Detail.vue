<script setup>
/**
 * Created by YuYoung on 2023/3/23
 * Description: 访问详情
 */
import { reactive, ref, watch, nextTick, computed } from 'vue';
import { useVisitStore } from '@/store/visit';
import { storeToRefs } from 'pinia';
import { dateObjToDayBeginUnixTime, dateObjToDayEndUnixTime } from '@/service/utils';
import { useToast } from 'primevue/usetoast';
const visitStore = useVisitStore();
const { visitDetailsAmount, visitDetails } = storeToRefs(visitStore);

// 弹窗实例
const toast = useToast();

// 数据预获取
visitStore.fetchVisitDetails();

// 编程式生成数据列, 添加/删除列仅修改此即可, 数据特殊处理的列单独处理
const columns = [
    { field: 'shortLink', header: '短链', sortable: true },
    { field: 'longLink', header: '长链', sortable: true },
    { field: 'comment', header: '链接备注', sortable: true },
    { field: 'ip', header: 'IP', sortable: true },
    { field: 'region', header: '区域', sortable: true },
    { field: 'visitTime', header: '访问时间', sortable: true }
];
const selectedItemsLabelStr = computed(() => {
    return `{0}/${columns.length}列已显示`;
});

// 表格Summary
const currentPageReportTemplateStr = ref(`显示-条的最新{totalRecords}条，当前 {first} - {last}`);
watch(visitDetailsAmount, (newVal) => {
    currentPageReportTemplateStr.value = `显示${newVal}条的最新{totalRecords}条，当前 {first} - {last}`;
});

// region 控制表格列的显示/隐藏
// 中文列名, 供选择显示列使用
const selectColumns = (function () {
    const selectColumns = [];
    columns.forEach((column) => {
        selectColumns.push(column.header);
    });
    return selectColumns;
})();
// 用于控制表格列的显示/隐藏
const _showMap = (function () {
    const showMap = {};
    columns.forEach((column) => {
        showMap[column.header] = true;
    });
    return showMap;
})();
const showMap = reactive(_showMap);
const selectedColumns = ref(selectColumns);
watch(selectedColumns, (newVal) => {
    Object.keys(showMap).forEach((key) => {
        showMap[key] = false;
    });
    newVal.forEach((selectedColumn) => {
        showMap[selectedColumn] = true;
    });
});
// endregion

// region 筛选表单
const showFieldSet = ref(true);
function makeFieldSetCollapsed() {
    showFieldSet.value = false;
    nextTick(() => (showFieldSet.value = true));
}
const shortLinkKeywords = ref([]);
const longLinkKeywords = ref([]);
const commentKeywords = ref([]);
const IPKeywords = ref([]);
const regionKeywords = ref([]);
const showTable = ref(true);
const selectRegions = [
    '安徽',
    '北京',
    '重庆',
    '福建',
    '甘肃',
    '广东',
    '广西',
    '贵州',
    '海南',
    '河北',
    '河南',
    '黑龙江',
    '湖北',
    '湖南',
    '吉林',
    '江苏',
    '江西',
    '辽宁',
    '内蒙古',
    '宁夏',
    '青海',
    '山东',
    '山西',
    '陕西',
    '上海',
    '四川',
    '台湾',
    '天津',
    '西藏',
    '新疆',
    '云南',
    '浙江',
    '香港',
    '澳门',
    '海外',
    '未知'
];
const rangeTimeKeywords = ref([]);

function confirmAllFilter() {
    const options = {
        shortLink: shortLinkKeywords.value,
        longLink: longLinkKeywords.value,
        comment: commentKeywords.value,
        ip: IPKeywords.value,
        region: regionKeywords.value,
        rangeTime: []
    };
    if (rangeTimeKeywords.value[0] && rangeTimeKeywords.value[1]) {
        options.rangeTime = [
            dateObjToDayBeginUnixTime(rangeTimeKeywords.value[0]),
            dateObjToDayEndUnixTime(rangeTimeKeywords.value[1])
        ];
    }
    visitStore.fetchVisitDetails(options).then((res) => {
        if (res === true) {
            toast.add({ severity: 'success', summary: '成功', detail: '筛选成功', life: 3000 });
            makeFieldSetCollapsed();
        } else {
            toast.add({ severity: 'error', summary: '失败', detail: '请检查填写内容或网络', life: 3000 });
        }
    });
}

function removeAllFilter() {
    shortLinkKeywords.value = [];
    longLinkKeywords.value = [];
    commentKeywords.value = [];
    IPKeywords.value = [];
    regionKeywords.value = [];
    rangeTimeKeywords.value = [];
    visitStore.fetchVisitDetails().then((res) => {
        if (res === true) {
            toast.add({ severity: 'success', summary: '成功', detail: '清除筛选成功', life: 3000 });
            makeFieldSetCollapsed();
        } else {
            toast.add({ severity: 'error', summary: '失败', detail: '请检查网络', life: 3000 });
        }
    });
}
// endregion

// 清除排序
function removeAllSort() {
    showTable.value = false;
    nextTick(() => {
        showTable.value = true;
    });
    toast.add({ severity: 'success', summary: '成功', detail: '已清除排序', life: 3000 });
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <!-- 筛选表单 -->
                <Fieldset v-if="showFieldSet" legend="筛选" :toggleable="true" :collapsed="true">
                    <div class="p-fluid lg:mr-8 lg:ml-8" style="max-width: 100%">
                        <p>
                            每项按回车确定，均可多选。留空为不包含该条件，以下筛选类型均为“与”的关系，同个筛选类型的不同条件为”或“的关系。
                        </p>
                        <h5>短链</h5>
                        <span style="padding: 0">
                            <Chips type="text" v-model="shortLinkKeywords" placeholder="短链包含字符..." />
                        </span>
                        <h5>长链</h5>
                        <span style="padding: 0">
                            <Chips type="text" v-model="longLinkKeywords" placeholder="长链包含字符..." />
                        </span>
                        <h5>备注</h5>
                        <span style="padding: 0">
                            <Chips type="text" v-model="commentKeywords" placeholder="备注包含字符..." />
                        </span>
                        <h5>IP</h5>
                        <span style="padding: 0">
                            <Chips type="text" v-model="IPKeywords" placeholder="使用x取代段 例如 113.60.43.x" />
                        </span>
                        <h5>区域</h5>
                        <span style="padding: 0">
                            <MultiSelect
                                v-model="regionKeywords"
                                :options="selectRegions"
                                :option-label="(data) => data"
                                display="comma"
                                placeholder="选择区域..."
                                :max-selected-labels="5"
                                selectedItemsLabel="{0}个区域已选择"
                                :filter="true"
                                filterPlaceholder="搜索区域"
                            >
                                <template #footer>
                                    <div class="py-2 px-3">
                                        <b>{{ regionKeywords.length }}</b
                                        >个区域已选择
                                    </div>
                                </template>
                            </MultiSelect>
                        </span>

                        <h5>访问时间</h5>
                        <span style="padding: 0">
                            <Calendar
                                v-model="rangeTimeKeywords"
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
                                        <Button label="清除" severity="danger" @click="rangeTimeKeywords = []"></Button>
                                    </div>
                                </template>
                            </Calendar>
                        </span>
                        <p />
                        <Button
                            label="确认筛选"
                            icon="pi pi-filter"
                            class="p-button-success"
                            @click="confirmAllFilter"
                        />
                        <p />
                        <Button
                            label="清除筛选"
                            icon="pi pi-filter-slash"
                            class="p-button-danger"
                            @click="removeAllFilter"
                        />
                    </div>
                </Fieldset>
                <p></p>
                <!--表格-->
                <DataTable
                    v-if="showTable"
                    :value="visitDetails"
                    dataKey="shortLink"
                    :paginator="true"
                    :rows="10"
                    :rowsPerPageOptions="[10, 20, 50, 100]"
                    paginator-position="bottom"
                    sortMode="multiple"
                    removableSort
                    resizableColumns
                    columnResizeMode="fit"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown "
                    :currentPageReportTemplate="currentPageReportTemplateStr"
                    responsiveLayout="scroll"
                >
                    <!--表头-->
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <div style="text-align: left">
                                <MultiSelect
                                    v-model="selectedColumns"
                                    :options="selectColumns"
                                    :max-selected-labels="0"
                                    :selectedItemsLabel="selectedItemsLabelStr"
                                    display="comma"
                                    placeholder="选择列"
                                />
                            </div>
                            <div style="text-align: right">
                                <Button
                                    label="清除排序"
                                    icon="pi pi-sort-alt-slash"
                                    class="p-button-danger"
                                    @click="removeAllSort"
                                />
                            </div>
                        </div>
                    </template>
                    <!--无数据情况-->
                    <template #empty> 无数据</template>
                    <!--数据列-->
                    <template v-for="column in columns" :key="column.shortLink">
                        <Column
                            :hidden="!showMap[column.header]"
                            :field="column.field"
                            :header="column.header"
                            :sortable="column.sortable"
                        >
                            <template #body="slotProps">
                                {{ slotProps.data[column.field] }}
                            </template>
                        </Column>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
