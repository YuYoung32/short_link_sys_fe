<script setup>
/**
 * Created by YuYoung on 2023/4/10
 * Description: 标题-数据 小片段 水平
 */
import { defineProps, toRefs } from 'vue';
const props = defineProps(['title', 'data']);
const { title, data } = toRefs(props);
</script>

<template>
    <div class="text-sm">
        <span class="text-gray-700">{{ title }}</span>
        <span class="text-800">{{ data }}</span>
    </div>
</template>
