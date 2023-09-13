<template>
  <div>
    <div class="flex px-2 py-2 justify-between items-center">
      <h1 class="m-0 text-lg text-gray-900 dark:text-gray-100">RSS Reader</h1>
      <div class="space-x-2 flex">
        <CheckCircle :size="16" class="app_icon" />
        <PlusCircle :size="16" class="app_icon" @click="addNewRSS" />
        <!-- <IconMenu :size="16" class="app_icon" /> -->
        <SidebarMenu />
        <!-- <template> -->
        <a-tooltip content="刷新">
          <RefreshCw :size="16" class="app_icon" v-show="true" />
          <RefreshCwOff v-show="false" />
        </a-tooltip>
        <!-- </template> -->

        <!-- <a-tooltip content="明亮、暗黑模式切换"> -->
        <ToggleTheme />
        <!-- </a-tooltip> -->
      </div>
    </div>
    <!-- 左侧分栏内容 -->

    <a-list
      :virtualListProps="{
        height: '100%',
      }"
      :data="podcastList"
    >
      <template #item="{ item }">
        <a-dropdown
          trigger="contextMenu"
          alignPoint
          @select="onSelect($event, item)"
        >
          <a-list-item
            class="hover:bg-slate-300 dark:hover:bg-slate-800"
            :key="item.id"
            @click="goLink(item)"
          >
            <a-list-item-meta
              :title="item.title ?? '--'"
              :description="`上次更新${formatDate(item.updateTime) ?? '--'}`"
            >
              <!-- itunes:duration -->
            </a-list-item-meta>
            <template #actions>
              <RefreshCw :size="12" class="app_icon"></RefreshCw>

              <a-dropdown @select="onSelect($event, item)">
                <MoreVertical :size="12" class="app_icon" />
                <template #content>
                  <a-doption
                    v-for="item of itemOptions"
                    :key="item.id"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-doption>
                </template>
              </a-dropdown>
            </template>
          </a-list-item>
          <template #content>
            <a-doption
              v-for="item of itemOptions"
              :key="item.id"
              :value="item.value"
            >
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </template>
    </a-list>
  </div>
</template>
<script lang="ts" setup>
import {
  CheckCircle,
  PlusCircle,
  Menu as IconMenu,
  RefreshCw,
  RefreshCwOff,
  MoreVertical,
} from "lucide-vue-next";
import { ref } from "vue";
import SidebarMenu from "@/components/sidebar/menu.vue";
import { inject } from "vue";
import { defaultStatus } from "@/store/index";
import { podcastDB } from "@/model/db";
import type { Podcast } from "@/types";
import { onMounted } from "vue";
import { formatDate } from "@/utils/data-format";
import ToggleTheme from "./sidebar/theme.vue";

const appStatus = inject("appStatus", ref(defaultStatus()));

const addNewRSS = () => {
  appStatus.value.detail.type = "addNewRSS";
};

const itemOptions = [
  {
    id: 1,
    label: "刷新",
    value: "refresh",
  },
  {
    id: 3,
    label: "添加备注",
    value: "remark",
  },
  {
    id: 4,
    label: "查看详情",
    value: "detail",
  },
  {
    id: 2,
    label: "删除",
    value: "delete",
  },
];

const onSelect = async (event: any, item: any) => {
  console.log("on select", event, item);
  if (event === "delete") {
    await podcastDB.deletePodcast(item.id);
    await fetchList();
  }
};

const podcastList = ref<Podcast[]>([]);

const fetchList = async () => {
  const list = await podcastDB.findPodcast({
    page: 1,
    size: 10,
    // name:undefined
  });

  podcastList.value = list;
};

const goLink = (item: any) => {
  // window.open(link);
  console.log(item);
  appStatus.value.detail.type = "detail";
  appStatus.value.detail.id = item.id;
};

onMounted(() => {
  fetchList();
});
</script>

<style>
.app_icon {
  @apply text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 cursor-pointer;
}
</style>
