<template>
  <Layout>
    <template #sidebar>
      <Sidebar />
    </template>

    <template #detail>
      <Detail />
    </template>
  </Layout>
</template>
<script lang="ts" setup>
import Layout from "@/components/layout.vue";
import Sidebar from "@/components/sidebar.vue";
import Detail from "@/components/detail.vue";
import { provide, ref } from "vue";
import { defaultStatus } from "@/store/index";

const appStatus = ref(defaultStatus());

provide("appStatus", appStatus);
</script>

<style>
html,
body {
  @apply dark:bg-slate-900;
}
</style>
