<script setup>
/**
 * Created by YuYoung on 2023/3/23
 * Description: 短链管理
 */
import {FilterMatchMode} from 'primevue/api';
import {onBeforeMount, ref, watch} from 'vue';
import {useToast} from 'primevue/usetoast';
import {useLinkStore} from '@/store/link';
import {storeToRefs} from "pinia";
import {getArrIndexByEle} from "@/service/utils";

const linkStore = useLinkStore();
const toast = useToast();
const {links} = storeToRefs(linkStore); // DataTable数据
const dt = ref(null); // 引用整个数据表格，用于导出

const link = ref({}); // 暂存单个信息编辑/新增时使用
const editDialogSubmitType = ref(''); // 提交类型: add-新增, update-更新
const submitted = ref(false); // 表单是否提交, 避免重复点击

const toDeleteLinks = ref([]); // 存储待删除链接的shortLink
const selectedLinks = ref(null); // 选中的数据
const filters = ref({});

onBeforeMount(() => {
  initFilters();
});

linkStore.fetchLinks(50);

//region 编辑/新建Dialog
const editDialogVisible = ref(false);
const openEditDialog = (linkItem) => {
  if (linkItem) {
    // 更新
    link.value = {...linkItem};
    editDialogSubmitType.value = 'update';
  } else {
    // 新增
    link.value = {};
    editDialogSubmitType.value = 'add';
  }
  submitted.value = false;
  editDialogVisible.value = true;
};
// 编辑/新建Dialog-取消
const cancelEditDialog = () => {
  editDialogVisible.value = false;
  submitted.value = false;
};
// 编辑/新建Dialog-确认
const confirmEditDialog = () => {
  submitted.value = true;
  if (link.value.longLink.trim() && link.value.comment.trim()) {
    if (editDialogSubmitType.value === 'update') {
      links.value[getArrIndexByEle(link.value.shortLink, links.value, 'shortLink')] = link.value;
      linkStore.updateLink(link.value).then(res => {
        if (res === true) {
          toast.add({severity: 'success', summary: '成功', detail: '链接更新成功', life: 3000});
        } else {
          toast.add({severity: 'error', summary: '失败', detail: '链接更新失败', life: 3000});
        }
      });
    } else {
      linkStore.addLink(link.value).then(res => {
        if (res === true) {
          linkStore.fetchLinks(50);
          toast.add({severity: 'success', summary: '成功', detail: '链接创建成功', life: 3000});
        } else {
          toast.add({severity: 'error', summary: '失败', detail: '链接创建失败', life: 3000});
        }
      });
    }

    editDialogVisible.value = false;
    link.value = {};
  }
};
//endregion

//region 删除Dialog
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
    console.log(selectedLinks.value);
    toDeleteLinks.value = links.value.filter((val) => selectedLinks.value.includes(val));
    deleteDialogVisible.value = true;
  } else {
    toast.add({severity: 'error', summary: '失败', detail: '请选择要删除的链接', life: 3000});
  }
};
// 删除Dialog-取消
const cancelDeleteDialog = () => {
  deleteDialogVisible.value = false;
};
// 删除Dialog-确认
const confirmDeleteLink = () => {
  deleteDialogVisible.value = false;
  linkStore.deleteLink(toDeleteLinks.value).then(res => {
    if (res === true) {
      linkStore.fetchLinks(50);
      toast.add({severity: 'success', summary: '成功', detail: '链接删除成功', life: 3000});
    } else {
      toast.add({severity: 'error', summary: '失败', detail: '链接删除失败', life: 3000});
    }
  });
};
//endregion

const exportCSV = () => {
  dt.value.exportCSV();
};

const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS}
  };
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast/>
        <!--头部按钮 新增 删除 文件上传 导出-->
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="新增" icon="pi pi-plus" class="p-button-success mr-2" @click="openEditDialog"/>
              <Button label="删除" icon="pi pi-trash" class="p-button-danger" @click="openDeleteDialog()"
                      :style="deleteSelectButtonStyle"/>
            </div>
          </template>
          <template v-slot:end>
            <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="从文件新建" chooseLabel="从文件新增"
                        class="mr-2 inline-block"/>
            <Button label="导出" icon="pi pi-file-export" class="p-button-help" @click="exportCSV($event)"/>
          </template>
        </Toolbar>

        <!--表格-->
        <DataTable
            ref="dt"
            :value="links"
            v-model:selection="selectedLinks"
            dataKey="shortLink"
            :paginator="true"
            :rows="10"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="总计 {totalRecords} 个链接的 {first} - {last} "
            responsiveLayout="scroll"
        >
          <!--表头-->
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">管理链接</h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search"/>
                <InputText v-model="filters['global'].value" placeholder="搜索..."/>
              </span>
            </div>
          </template>

          <!--选择列-->
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>

          <!--数据列-->
          <Column field="shortLink" header="短链" headerStyle="width:14%; min-width:5rem;">
            <template #body="slotProps">
              <span class="p-column-title">短链</span>
              {{ slotProps.data.shortLink }}
            </template>
          </Column>
          <Column field="longLink" header="长链" headerStyle="width:14%; min-width:4rem;">
            <template #body="slotProps">
              <span class="p-column-title">长链</span>
              {{ slotProps.data.longLink }}
            </template>
          </Column>
          <Column field="comment" header="备注" headerStyle="width:14%; min-width:4rem;">
            <template #body="slotProps">
              <span class="p-column-title">备注</span>
              {{ slotProps.data.comment }}
            </template>
          </Column>
          <Column field="createTime" header="创建时间" headerStyle="width:14%; min-width:4rem;">
            <template #body="slotProps">
              <span class="p-column-title">备注</span>
              {{ slotProps.data.createTime }}
            </template>
          </Column>
          <!--操作列-->
          <Column headerStyle="min-width:10rem;">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
                      @click="openEditDialog(slotProps.data)"/>
              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mt-2"
                      @click="openDeleteDialog(slotProps.data)"/>
            </template>
          </Column>
        </DataTable>

        <!--EditDialog-->
        <Dialog v-model:visible="editDialogVisible" :style="{ width: '450px' }" header="修改链接" :modal="true"
                class="p-fluid">
          <div class="field">
            <label for="editLongLink">长链</label>
            <InputText id="editLongLink" v-model.trim="link.longLink" required="true" :placeholder="link.longLink"
                       autofocus
                       :class="{ 'p-invalid': submitted && !link.longLink }"/>
          </div>
          <div class="field">
            <label for="editLongLink">备注</label>
            <InputText id="editComment" v-model.trim="link.comment" required="false" :placeholder="link.comment"
                       autofocus/>
          </div>
          <template #footer>
            <Button label="取消" icon="pi pi-times" class="p-button-text" @click="cancelEditDialog"/>
            <Button label="确认" icon="pi pi-check" class="p-button-text" @click="confirmEditDialog"/>
          </template>
        </Dialog>

        <!--DeleteDialog-->
        <Dialog v-model:visible="deleteDialogVisible" :style="{ width: '450px'}" header="确认删除"
                :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
            <span v-if="toDeleteLinks" style="width: 100%">确认删除以下{{ toDeleteLinks.length }}个链接</span>
          </div>
          <p></p>
          <p class="mb-5">

            <DataTable :value="toDeleteLinks" tableStyle="">
              <Column field="shortLink" header="短链"></Column>
              <Column field="comment" header="备注"></Column>
            </DataTable>
          </p>


          <template #footer>
            <Button label="取消" icon="pi pi-times" class="p-button-text" @click="cancelDeleteDialog" onfocus/>
            <Button label="确认" icon="pi pi-check" class="p-button-text" @click="confirmDeleteLink"/>
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
