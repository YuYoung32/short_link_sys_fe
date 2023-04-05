<script setup>
/**
 * Created by YuYoung on 2023/3/23
 * Description: 短链管理
 */
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useLinkStore } from '@/store/link';
import { storeToRefs } from 'pinia';
import { unixTimeToString } from '@/service/utils';

const linkStore = useLinkStore();
const toast = useToast(); // 弹窗实例
const { links, amountTotal } = storeToRefs(linkStore); // DataTable数据

const currentPageReportTemplateStr = ref(`总计${amountTotal.value}条的最新{totalRecords}条，当前 {first} 到 {last} `);
watch(amountTotal, (val) => {
    currentPageReportTemplateStr.value = `显示${val}条的最新{totalRecords}条，当前 {first} 到 {last} `;
});

//region 编辑/新建Dialog
const newLinkDefault = {
    longLink: '',
    comment: ''
};
const newLink = ref(newLinkDefault); // 暂存单个信息编辑/新增时使用
const editDialogSubmitType = ref(''); // 提交类型: add-新增, update-更新
const submitted = ref(false); // 表单是否提交, 用于编辑链接时验证
const editDialogHeader = ref('新增链接');
const editDialogVisible = ref(false);
const openEditDialog = (linkItem) => {
    if (linkItem && linkItem.shortLink) {
        // 更新
        editDialogHeader.value = '更新链接';
        newLink.value = { ...linkItem };
        editDialogSubmitType.value = 'update';
    } else {
        // 新增
        editDialogHeader.value = '新增链接';
        newLink.value = newLinkDefault;
        editDialogSubmitType.value = 'add';
    }
    submitted.value = false; //防止重复点击
    editDialogVisible.value = true; //显示Dialog
};
// 编辑/新建Dialog-取消
const cancelEditDialog = () => {
    editDialogVisible.value = false;
    submitted.value = false;
};
// 编辑/新建Dialog-确认
const confirmEditDialog = () => {
    submitted.value = true;

    // 更新
    if (editDialogSubmitType.value === 'update') {
        linkStore.updateLink(newLink.value).then((res) => {
            if (res === true) {
                linkStore.fetchLinks();
                toast.add({ severity: 'success', summary: '成功', detail: '链接更新成功', life: 3000 });
            } else {
                toast.add({ severity: 'error', summary: '失败', detail: '链接更新失败', life: 3000 });
            }
        });
    } else {
        // 新增
        linkStore
            .addLink([
                {
                    longLink: newLink.value.longLink,
                    comment: newLink.value.comment
                }
            ])
            .then((res) => {
                if (res === true) {
                    linkStore.fetchLinks();
                    toast.add({ severity: 'success', summary: '成功', detail: '链接创建成功', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: '失败', detail: '链接创建失败', life: 3000 });
                }
            });
    }

    editDialogVisible.value = false;
    newLink.value = newLinkDefault;
};
//endregion

//region 删除Dialog
const toDeleteLinks = ref([]); // 存储待删除链接的shortLink
const selectedLinks = ref(null); // 选中的数据
const deleteSelectButtonStyle = ref('background-color: #AA3F3FFF;border: 1px solid #AA3F3FFF;');
const deleteDialogVisible = ref(false);
watch(selectedLinks, (val) => {
    if (val && val.length > 0) {
        deleteSelectButtonStyle.value = 'background-color: #EF4444;border: 1px solid #EF4444;';
    } else {
        deleteSelectButtonStyle.value = 'background-color: #AA3F3FFF;border: 1px solid #AA3F3FFF;';
    }
});
const openDeleteDialog = (linkItem) => {
    if (linkItem) {
        toDeleteLinks.value = [linkItem];
        deleteDialogVisible.value = true;
    } else if (selectedLinks.value && selectedLinks.value.length > 0) {
        toDeleteLinks.value = links.value.filter((val) => selectedLinks.value.includes(val));
        deleteDialogVisible.value = true;
    } else {
        toast.add({ severity: 'error', summary: '失败', detail: '请选择要删除的链接', life: 3000 });
    }
};
// 删除Dialog-取消
const cancelDeleteDialog = () => {
    deleteDialogVisible.value = false;
};
// 删除Dialog-确认
const confirmDeleteLink = () => {
    deleteDialogVisible.value = false;
    linkStore.deleteLink(toDeleteLinks.value).then((res) => {
        if (res === true) {
            linkStore.fetchLinks();
            toast.add({ severity: 'success', summary: '成功', detail: '链接删除成功', life: 3000 });
        } else {
            toast.add({ severity: 'error', summary: '失败', detail: '链接删除失败', life: 3000 });
        }
    });
};
//endregion

//region 从文件新增Dialog
const addLinkFromFileDialogVisible = ref(false);
const newLinks = ref([]);
const openAddFromFileDialog = (event) => {
    // 读取文件并存储到newLinks
    const reader = new FileReader();
    reader.readAsText(event.files[0]);
    reader.onload = () => {
        const lines = reader.result.split(/\r?\n/);
        newLinks.value = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() === '') {
                continue;
            }
            const index = lines[i].indexOf(',');
            if (index !== -1) {
                newLinks.value.push({
                    longLink: lines[i].substring(0, index).trim(),
                    comment: lines[i].substring(index + 1).trim()
                });
            } else {
                newLinks.value = [];
                toast.add({ severity: 'error', summary: '失败', detail: '文件格式错误', life: 3000 });
                return;
            }
        }
        // 打开Dialog
        addLinkFromFileDialogVisible.value = true;
    };
};
// 从文件新增Dialog-取消
const cancelAddFromFileDialog = () => {
    addLinkFromFileDialogVisible.value = false;
};
// 从文件新增Dialog-确认
const confirmAddFromFileDialog = async () => {
    addLinkFromFileDialogVisible.value = false;
    linkStore.addLink(newLinks.value).then((res) => {
        if (res === true) {
            linkStore.fetchLinks();
            toast.add({ severity: 'success', summary: '成功', detail: '链接创建成功', life: 3000 });
        } else {
            toast.add({ severity: 'error', summary: '失败', detail: '链接创建失败', life: 3000 });
        }
    });
};
//endregion

//region search
const searchKeyword = ref('');
const search = () => {
    if (searchKeyword.value === '') {
        linkStore.fetchLinks();
        return;
    }
    linkStore.fetchLinks(
        {
            longLink: searchKeyword.value,
            shortLink: searchKeyword.value,
            comment: searchKeyword.value
        },
        -1
    );
};
//endregion

linkStore.fetchLinks();
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <!--头部按钮 新增 删除 文件上传 说明-->
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button
                                label="新增"
                                icon="pi pi-plus"
                                class="p-button-success mr-2"
                                @click="openEditDialog()"
                            />
                            <Button
                                label="删除"
                                icon="pi pi-trash"
                                class="p-button-danger"
                                @click="openDeleteDialog()"
                                :style="deleteSelectButtonStyle"
                            />
                        </div>
                    </template>
                    <template v-slot:end>
                        <FileUpload
                            id="fileUpload"
                            mode="basic"
                            :auto="true"
                            :maxFileSize="1000000"
                            chooseLabel="从文件新增"
                            customUpload
                            @uploader="openAddFromFileDialog($event)"
                        />
                    </template>
                </Toolbar>

                <!--表格-->
                <DataTable
                    :value="links"
                    v-model:selection="selectedLinks"
                    dataKey="shortLink"
                    resizableColumns
                    columnResizeMode="fit"
                    :paginator="true"
                    :rows="10"
                    :rowsPerPageOptions="[10, 20, 50]"
                    paginatorPosition="bottom"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    :currentPageReportTemplate="currentPageReportTemplateStr"
                    responsiveLayout="scroll"
                >
                    <!--表头-->
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">管理链接</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search" />
                                <InputText
                                    v-model="searchKeyword"
                                    placeholder="搜索全部链接..."
                                    @keyup.enter="search"
                                />
                            </span>
                        </div>
                    </template>
                    <template #empty>无数据</template>
                    <!--选择列-->
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

                    <!--数据列-->
                    <Column field="shortLink" header="短链" headerStyle="width:14%; min-width:5rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.shortLink }}
                        </template>
                    </Column>
                    <Column field="longLink" header="长链" headerStyle="width:14%; min-width:4rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.longLink }}
                        </template>
                    </Column>
                    <Column field="comment" header="备注" headerStyle="width:14%; min-width:4rem;">
                        <template #body="slotProps">
                            {{ slotProps.data.comment }}
                        </template>
                    </Column>
                    <Column field="createTime" header="创建时间" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            {{ unixTimeToString(slotProps.data.createTime) }}
                        </template>
                    </Column>

                    <!--操作列-->
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-success mr-2"
                                @click="openEditDialog(slotProps.data)"
                            />
                            <Button
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-danger mt-2"
                                @click="openDeleteDialog(slotProps.data)"
                            />
                        </template>
                    </Column>
                </DataTable>

                <!--EditDialog-->
                <Dialog
                    v-model:visible="editDialogVisible"
                    :style="{ width: '450px' }"
                    :header="editDialogHeader"
                    :modal="true"
                    class="p-fluid"
                >
                    <div class="field">
                        <label for="editLongLink">长链</label>
                        <InputText
                            id="editLongLink"
                            v-model.trim="newLink.longLink"
                            required="true"
                            :placeholder="newLink.longLink"
                            autofocus
                            :class="{ 'p-invalid': submitted && !newLink.longLink }"
                        />
                    </div>
                    <div class="field">
                        <label for="editLongLink">备注</label>
                        <InputText
                            id="editComment"
                            v-model.trim="newLink.comment"
                            required="false"
                            :placeholder="newLink.comment"
                            autofocus
                        />
                    </div>
                    <template #footer>
                        <Button label="取消" icon="pi pi-times" class="p-button-text" @click="cancelEditDialog" />
                        <Button label="确认" icon="pi pi-check" class="p-button-text" @click="confirmEditDialog" />
                    </template>
                </Dialog>

                <!--DeleteDialog-->
                <Dialog
                    v-model:visible="deleteDialogVisible"
                    :style="{ width: '450px' }"
                    header="确认删除"
                    :modal="true"
                >
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="toDeleteLinks" style="width: 100%"
                            >确认删除以下{{ toDeleteLinks.length }}个链接</span
                        >
                    </div>
                    <p></p>
                    <p class="mb-5">
                        <DataTable :value="toDeleteLinks" tableStyle="">
                            <Column field="shortLink" header="短链"></Column>
                            <Column field="comment" header="备注"></Column>
                        </DataTable>
                    </p>
                    <template #footer>
                        <Button
                            label="取消"
                            icon="pi pi-times"
                            class="p-button-text"
                            @click="cancelDeleteDialog"
                            autofocus
                        />
                        <Button label="确认" icon="pi pi-check" class="p-button-text" @click="confirmDeleteLink" />
                    </template>
                </Dialog>

                <!--AddLinksFromFileDialog-->
                <Dialog
                    v-model:visible="addLinkFromFileDialogVisible"
                    :style="{ width: '450px' }"
                    header="确认添加"
                    :modal="true"
                >
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="newLinks" style="width: 100%">确认添加以下{{ newLinks.length }}个链接</span>
                    </div>
                    <p></p>
                    <p class="mb-5">
                        <DataTable :value="newLinks" tableStyle="">
                            <Column field="longLink" header="长链"></Column>
                            <Column field="comment" header="备注"></Column>
                        </DataTable>
                    </p>

                    <template #footer>
                        <Button
                            label="取消"
                            icon="pi pi-times"
                            class="p-button-text"
                            @click="cancelAddFromFileDialog"
                        />
                        <Button
                            label="确认"
                            icon="pi pi-check"
                            class="p-button-text"
                            @click="confirmAddFromFileDialog"
                            autofocus
                        />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
#fileUpload {
    position: relative;

    &:hover {
        &:before {
            margin: 2px;
            width: 100%;
            content: '格式: csv无表头,共两列\a长链,备注'; // 悬浮框里面的内容
            position: absolute;
            top: 100%; // 与按钮底部对齐
            left: 50%; // 横向居中
            transform: translateX(-50%); // 居中
            padding: 4px;
            background-color: #6f6f6f;
            color: #fff;
            border-radius: 4px;
            font-size: 5px;
            white-space: pre;
        }
    }
}
</style>
