<script setup>
/**
 * Created by YuYoung on 2023/4/10
 * Description: 在Monitor view里显示的数据卡片
 */
</script>

<template>
    <div class="col-12 xl:col-6">
        <div class="card">
            <!--标题, 插入-->
            <slot name="title" />
            <!--单位和最大值, 插入-->
            <slot name="unit-and-max" />
            <!--图表, 插入-->
            <slot name="chart" />
            <div class="flex justify-content-between text-gray-600 text-xs">
                <span>60秒</span>
                <span>30秒</span>
                <span>0</span>
            </div>
            <div class="flex justify-content-between h-auto xl:h-10rem">
                <!--实时数据, 插入-->
                <slot name="real-time-info" />
                <!--静态数据, 插入-->
                <slot name="static-info" />
            </div>
        </div>
    </div>
</template>
