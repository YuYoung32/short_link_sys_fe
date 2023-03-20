<script setup>
/**
 * Created by YuYoung on 2023/3/20
 * Description: 主页侧边栏
 */
import {ref} from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
  {
    items: [{label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'}]
  },
  {
    label: '短链',
    items: [
      {label: '短链显示', icon: 'pi pi-fw pi-id-card', to: '/'},
      {label: '短链管理', icon: 'pi pi-fw pi-id-card', to: '/'}
    ]
  },
  {
    label: '访问数据',
    items: [
      {label: '访问详情', icon: 'pi pi-fw pi-eye', to: '/'},
      {label: '访问分析', icon: 'pi pi-fw pi-eye', to: '/'}
    ]
  },
  {
    label: '性能',
    items: [
      {label: '性能监控', icon: 'pi pi-fw pi-prime', to: '/'},
      {label: '性能测试', icon: 'pi pi-fw pi-prime', to: '/'},
    ]
  },
  {
    label: '设置',
    items: [
      {label: '用户', icon: 'pi pi-fw pi-prime', to: '/'},
      {label: '退出登录', icon: 'pi pi-fw pi-desktop', target: '_blank'}
    ]
  }
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
