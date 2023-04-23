<script setup>
/**
 * Created by YuYoung on 2023/3/20
 * Description: AppSidebar传入一项数据, 这里进行渲染, 渲染为sidebar里的菜单项
 */
import { defineProps, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { useLayout } from '@/layout/layout';

const route = useRoute();

const { layoutState, onMenuToggle } = useLayout();
const props = defineProps(['item', 'root']);
const { item, root } = toRefs(props);

const itemClick = () => {
    const { overlayMenuActive, staticMenuMobileActive } = layoutState;
    // 小屏模式下, 点击菜单项进入后, 关闭菜单, 此处确认是要跳转链接, 且是小屏模式下
    if (staticMenuMobileActive.value || overlayMenuActive.value) {
        onMenuToggle();
    }
};
</script>

<template>
    <li :class="{ 'layout-root-menuitem': root }">
        <!--label-->
        <div v-if="root" class="layout-menuitem-root-text">{{ item.label }}</div>

        <!--跳转到其他页面, 非注册在 / 下, 没有to, 通过url跳转, 由于标签不同<a>和<router-link>不同, 必须区分-->
        <a v-if="!item.to" :href="item.url" @click="item.click">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
        </a>

        <!--跳转显示各个路由, 有to-->
        <!--class用来匹配当前URL和所有侧边栏选项, 若匹配设置颜色-->
        <router-link
            v-if="item.to"
            @click="itemClick()"
            :class="{ 'active-route': route.path === item.to }"
            :to="item.to"
        >
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
        </router-link>

        <!--存在子级, 递归调用-->
        <Transition v-if="item.items" name="layout-submenu">
            <ul class="layout-submenu">
                <app-menu-item v-for="child in item.items" :key="child" :item="child" :root="false"></app-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style lang="scss" scoped></style>
