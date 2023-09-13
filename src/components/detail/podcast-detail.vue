<template>
  <div class="w-full p-4 dark:text-slate-100 text-slate-900">
    <a-list
      :virtualListProps="{
        height: '90vh',
      }"
      :data="list"
    >
      <template #item="{ item, index }">
        <a-list-item :key="item.id" class="hover:bg-slate-800">
          <a-list-item-meta :title="item.title" :description="item.description">
            <!-- <template #avatar>
            <a-avatar shape="square">
              A
            </a-avatar>
          </template> -->
          </a-list-item-meta>
          <template #actions>
            <span>{{ formatDateTime(item.pubDate) }}</span>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>
<script lang="ts" setup>
import { podcastDB } from "@/model/db";
import { defaultStatus } from "@/store";
import type { IPodcastItem } from "@/types";
import { Message } from "@arco-design/web-vue";
import { computed, inject, onMounted, ref } from "vue";
const appStatus = inject("appStatus", ref(defaultStatus()));
import { formatDate, formatDateTime } from "@/utils/data-format";

const id = computed(() => appStatus.value.detail.id);

const list = ref<IPodcastItem[]>([]);
//  podcastId =

onMounted(async () => {
  if (id.value) {
    podcastDB.items
      .where("podcastId")
      .equals(id.value)
      .toArray()
      .then((res) => {
        console.log(55, res);
        list.value = res;
      })
      .catch((err) => {
        Message.error(err);
      });
  }
  // list.value = await podcastDB.items
  //   .where("")
  //   //.where('name').equals
  //   .toArray();
});
</script>

<style></style>
