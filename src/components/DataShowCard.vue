<script setup>
/**
 * Created by YuYoung on 2023/3/24
 * Description: 通用标题-消息展示卡片
 * Uses:
 * @prop.title(必须) 标题
 * @prop.msg(必须) 内容
 * @prop.custom(可选) 是否自定义内容, true为自定义内容, 在slot中自定义内容
 */

import { defineProps } from 'vue';

const props = defineProps(['title', 'msg', 'custom']);
</script>

<template>
    <div class="col-12 lg:col-6 xl:col-3">
        <div class="card mb-0">
            <div class="flex justify-content-between mb-3 h-4rem">
                <div>
                    <span class="block text-700 font-medium mb-3">{{ props.title }}</span>
                    <span v-if="!(props.custom === 'true')">
                        <span class="text-900 font-semibold text-xl">{{ props.msg }}</span>
                    </span>
                    <span v-if="props.custom === 'true'">
                        <slot></slot>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
