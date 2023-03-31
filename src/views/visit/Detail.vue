<script setup>
/**
 * Created by YuYoung on 2023/3/23
 * Description: 访问详情
 */
import {reactive, ref, watch, nextTick} from 'vue';
import {useLinkStore} from "@/store/link";

// const currentPageReportTemplateStr = ref(`显示${amountTotal}条的最新{totalRecords}条，当前 {first} 到 {last} `);
// watch(amountTotal, (val) => {
//   currentPageReportTemplateStr = `显示${val}条的最新{totalRecords}条，当前 {first} 到 {last} `;
// });

const columns = ['短链', '长链', '备注', 'IP', '区域', '访问时间'];
const showMap = reactive({
    '短链': true,
    '长链': true,
    '链接备注': true,
    'IP': true,
    '区域': true,
    '访问时间': true,
});
const selectedColumns = ref(columns);
watch(selectedColumns, (newVal) => {
    Object.keys(showMap).forEach(key => {
        showMap[key] = false;
    });
    newVal.forEach(selectedColumn => {
        showMap[selectedColumn] = true;
    });
});

const shortLinkKeywords = ref([]);
const longLinkKeywords = ref([]);
const commentKeywords = ref([]);
const IPKeywords = ref([]);
const regionKeywords = ref([]);
const showTable = ref(true);
const provinces = ['安徽', '北京', '重庆', '福建', '甘肃', '广东', '广西', '贵州',
    '海南', '河北', '河南', '黑龙江', '湖北', '湖南', '吉林', '江苏', '江西', '辽宁',
    '内蒙古', '宁夏', '青海', '山东', '山西', '陕西', '上海', '四川', '台湾', '天津', '西藏', '新疆', '云南', '浙江',
    '香港', '澳门', '海外', '未知'];
const rangeTimeKeywords = ref([]);

function confirmAllFilter() {

}

function removeAllFilter() {
    shortLinkKeywords.value = [];
    longLinkKeywords.value = [];
    commentKeywords.value = [];
    IPKeywords.value = [];
    regionKeywords.value = [];
    rangeTimeKeywords.value = [];
}


function removeAllSort() {
    showTable.value = false;
    nextTick(() => {
        showTable.value = true;
    });
}

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Fieldset legend="筛选" :toggleable="true">
                    <div class="p-fluid lg:mr-8 lg:ml-8 " style="max-width: 100%">
                        <p>每项按回车确定，均可多选，留空为取消该条件，以下筛选条件均为“与”的关系。</p>
                        <h5>短链</h5>
                        <span style="padding:0">
              <Chips type="text" v-model="shortLinkKeywords" placeholder="短链..."/>
            </span>
                        <h5>长链</h5>
                        <span style="padding:0">
              <Chips type="text" v-model="longLinkKeywords" placeholder="长链..."/>
            </span>
                        <h5>备注</h5>
                        <span style="padding:0">
              <Chips type="text" v-model="commentKeywords" placeholder="备注..."/>
            </span>
                        <h5>IP</h5>
                        <span style="padding:0">
              <Chips type="text" v-model="IPKeywords" placeholder="使用x取代段 例如 113.60.43.x"/>
            </span>
                        <h5>区域</h5>
                        <span style="padding:0">
              <MultiSelect v-model="regionKeywords"
                           :options="provinces"
                           :option-label="(data)=>data"
                           display="comma" placeholder="选择区域..."
                           :max-selected-labels="5" selectedItemsLabel="{0}个区域已选择"
                           :filter="true" filterPlaceholder="搜索区域"
              >
                <template #footer>
                <div class="py-2 px-3">
                    <b>{{ regionKeywords.length }}</b>个区域已选择
                </div>
            </template>
              </MultiSelect>
            </span>

                        <h5>访问时间</h5>
                        <span style="padding:0">
              <Calendar v-model="rangeTimeKeywords"
                        showIcon placeholder="时间段..."
                        selection-mode="range" date-format="yymmdd"
                        :max-date="new Date(new Date().getTime() - 24 * 60 * 60 * 1000)"/>
            </span>
                        <p/>
                        <Button label="确认筛选" icon="pi pi-filter" class="p-button-success"
                                @click="confirmAllFilter"/>
                        <p/>
                        <Button label="清除筛选" icon="pi pi-filter-slash" class="p-button-danger"
                                @click="removeAllFilter"/>
                    </div>
                </Fieldset>
                <p></p>
                <!--表格-->
                <DataTable
                        v-if="showTable"
                        :value="useLinkStore().links" dataKey="shortLink"
                        :paginator="true" :rows="10" :rowsPerPageOptions="[10, 20, 50, 100]" paginator-position="top"
                        sortMode="multiple" removableSort
                        resizableColumns columnResizeMode="fit"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown "
                        currentPageReportTemplate="{totalRecords}条，当前 {first} 到 {last}"
                        responsiveLayout="scroll"
                >
                    <!--表头-->
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <div style="text-align:left">
                                <MultiSelect v-model="selectedColumns" :options="columns"
                                             :max-selected-labels="0" selectedItemsLabel="{0}/6个列已显示"
                                             display="comma" placeholder="选择列"/>
                            </div>
                            <div style="text-align:right">
                                <Button label="清除排序" icon="pi pi-sort-alt-slash" class="p-button-danger"
                                        @click="removeAllSort"/>
                            </div>
                        </div>
                    </template>
                    <!--无数据情况-->
                    <template #empty> 无数据</template>
                    <!--数据列-->

                    <Column v-if="showMap['短链']" field="shortLink" header="短链"
                            :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.shortLink }}
                        </template>
                    </Column>
                    <Column v-if="showMap['长链']" field="longLink" header="长链"
                            :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.longLink }}
                        </template>
                    </Column>
                    <Column v-if="showMap['链接备注']" field="comment" header="链接备注"
                            :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.comment }}
                        </template>
                    </Column>
                    <Column v-if="showMap['IP']" field="IP" header="IP"
                            :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.IP }}
                        </template>
                    </Column>
                    <Column v-if="showMap['区域']" field="region" header="区域"
                            :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.region }}
                        </template>
                    </Column>
                    <Column v-if="showMap['访问时间']" field="visitTime" header="访问时间"
                            :sortable="true">
                        <template #body="slotProps">
                            {{ slotProps.data.visitTime }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
</style>
