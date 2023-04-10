<script setup>
/**
 * Created by YuYoung on 2023/4/10
 * Description: 标题-数据 小片段 垂直
 */

import { defineProps, toRefs } from 'vue';
const props = defineProps(['title', 'data']);
const { title, data } = toRefs(props);
</script>

<template>
    <div>
        <div class="text-sm text-gray-700 -mb-1">{{ title }}</div>
        <div class="text-2xl">{{ data }}</div>
    </div>
</template>
