<script setup>
import { useLayout } from '@/layout/layout';
import { useServerStore } from '@/store/server';
import { storeToRefs } from 'pinia/dist/pinia';
import { ref, watch } from 'vue';

const serverStore = useServerStore();
const { isOnline } = storeToRefs(serverStore);
serverStore.fetchRealtimeServerInfo();

const tipColor = ref('black');
const tipMsg = ref('');
watch(
    isOnline,
    (newVal) => {
        if (newVal) {
            tipColor.value = 'green';
            tipMsg.value = '服务器已在线';
        } else {
            tipColor.value = 'red';
            tipMsg.value = '服务器已离线';
        }
    },
    { immediate: true }
);

const currentTime = ref('');
setInterval(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    currentTime.value = year + '年' + month + '月' + day + '日 ' + hours + ':' + minutes + ':' + seconds;
}, 1000);

const { onMenuToggle } = useLayout();
</script>

<template>
    <div class="layout-topbar">
        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>
        <div class="layout-topbar-menu">
            <ul :style="{ 'list-style-type': 'none' }" class="text-lg">
                <li>{{ currentTime }}</li>
            </ul>
            <ul :style="{ color: tipColor }" class="text-lg">
                <li>&nbsp;{{ tipMsg }}</li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
