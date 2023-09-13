<template>
  <div>
    <AddNewRss v-if="isAddNewStatus" />
    <!-- isPodcastDetail -->
    <PodcastDetail v-else-if="isPodcastDetail" />
    <Blank v-else>blank else</Blank>
  </div>
</template>
<script lang="ts" setup>
import AddNewRss from "@/components/detail/add-new-rss.vue";
import Blank from "@/components/detail/blank.vue";
import { defaultStatus } from "@/store/index";
import { computed } from "vue";
import { inject, watchEffect, ref, watch } from "vue";
import PodcastDetail from "./detail/podcast-detail.vue";

const status = inject("appStatus", ref(defaultStatus()));

watch(
  () => status.value.detail.type,
  (val) => {
    console.log(val);
  }
);

const isAddNewStatus = computed(() => status.value.detail.type === "addNewRSS");
const isPodcastDetail = computed(() => status.value.detail.type === "detail");
</script>

<style></style>
