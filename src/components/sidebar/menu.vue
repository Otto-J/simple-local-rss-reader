<template>
  <a-dropdown>
    <IconMenu :size="16" class="app_icon" />

    <template #content>
      <a-doption v-for="item of optionList" :key="item.id">{{
        item.label
      }}</a-doption>
    </template>
  </a-dropdown>
</template>
<script lang="ts" setup>
import { Menu as IconMenu } from "lucide-vue-next";
import { ref } from "vue";

const optionList = [
  {
    id: 1,
    label: "整理订阅",
  },
  {
    id: 2,
    label: "查看帮助",
  },
];

// const props = withDefaults(
//   defineProps<{
//     visible?: boolean;
//   }>(),
//   {
//     visible: false,
//   }
// );

// const emits = defineEmits(["update:visible"]);
</script>

<style></style>
