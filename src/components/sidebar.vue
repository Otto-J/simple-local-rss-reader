<template>
  <div class="flex px-2 py-2 justify-between items-center">
    <RouterLink
      :to="{
        name: '/home'
      }"
    >
      <h1 class="m-0 text-lg text-gray-900 dark:text-gray-100">RSS Reader</h1>
    </RouterLink>
    <div class="space-x-2 flex">
      <CheckCircle :size="16" class="app_icon" />
      <PlusCircle :size="16" class="app_icon" @click="addNewRSS" />
      <!-- <IconMenu :size="16" class="app_icon" /> -->
      <SidebarMenu />
      <!-- <template> -->
      <a-tooltip content="刷新">
        <div>
          <RefreshCw :size="16" class="app_icon" v-show="true" />
          <RefreshCwOff v-show="false" />
        </div>
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
      height: '100%'
    }"
    :data="podcastList"
  >
    <template #item="{ item }">
      <a-dropdown trigger="contextMenu" alignPoint @select="onSelect($event, item)">
        <a-list-item class="hover:bg-slate-300 dark:hover:bg-slate-800" :key="item.id">
          <RouterLink
            :to="{
              path: '/detail/' + item.id
              // name: '/detail',
              // params: {
              //   id: item.id
              // }
            }"
          >
            <a-list-item-meta
              :title="item.title ?? '--'"
              :description="`上次更新${formatDate(item.updateTime) ?? '--'}`"
            >
              <!-- itunes:duration -->
            </a-list-item-meta>
          </RouterLink>
          <template #actions>
            <div @click="refreshPodcast(item.id)">
              <RefreshCw :size="12" class="app_icon"></RefreshCw>
            </div>

            <a-dropdown @select="onSelect($event, item)">
              <MoreVertical :size="12" class="app_icon" />
              <template #content>
                <a-doption v-for="item of itemOptions" :key="item.id" :value="item.value">
                  {{ item.label }}
                </a-doption>
              </template>
            </a-dropdown>
          </template>
        </a-list-item>
        <template #content>
          <a-doption v-for="item of itemOptions" :key="item.id" :value="item.value">
            {{ item.label }}
          </a-doption>
        </template>
      </a-dropdown>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
import { CheckCircle, PlusCircle, RefreshCw, RefreshCwOff, MoreVertical } from 'lucide-vue-next'
import { ref } from 'vue'
import SidebarMenu from '@/components/sidebar/menu.vue'
import { podcastDB } from '@/model/db'
import type { Podcast } from '@/types'
import { onMounted } from 'vue'
import { formatDate } from '@/utils/data-format'
import ToggleTheme from './sidebar/theme.vue'
import { useRouter } from 'vue-router/auto'
import { addPodcast, useParseRss } from '@/model/model'

const router = useRouter()

const addNewRSS = () => {
  // appStatus.value.detail.type = 'addNewRSS'
  router.push({
    name: '/add-rss'
  })
}

const itemOptions = [
  {
    id: 1,
    label: '刷新',
    value: 'refresh'
  },
  {
    id: 3,
    label: '添加备注',
    value: 'remark'
  },
  {
    id: 4,
    label: '查看详情',
    value: 'detail'
  },
  {
    id: 2,
    label: '删除',
    value: 'delete'
  }
]
const { parseXMLByUrl, addLoading } = useParseRss()

const refreshPodcast = (id: number) => {
  console.log('手动刷新', id)
  // 后面用事务
  podcastDB.podcasts.get(id).then((res) => {
    if (!res) {
      return
    }
    const link = res.rss
    return parseXMLByUrl(link)
  })
}

const onSelect = async (event: any, item: any) => {
  console.log('on select', event, item)
  if (event === 'delete') {
    Promise.all([podcastDB.deletePodcast(item.id), podcastDB.deleteItem(item.id)]).then(() => {
      fetchList()
    })
  }
}

const podcastList = ref<Podcast[]>([])

const fetchList = async () => {
  const list = await podcastDB.findPodcast({
    page: 1,
    size: 10
    // name:undefined
  })

  podcastList.value = list
}

onMounted(() => {
  fetchList()
})
</script>
