<script setup>

import {useLayout} from '@/layout/layout';

const {onMenuToggle} = useLayout();

</script>

<template>
  <div class="layout-topbar">

    <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
      <i class="pi pi-bars"></i>
    </button>

  </div>
</template>

<style lang="scss" scoped></style>
