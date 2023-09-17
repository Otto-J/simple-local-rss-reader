<template>
  <div id="detail-id" class="w-full h-screen flex flex-col">
    <div class="mb-4 text-lg flex-shrink-0 flex justify-between items-center">
      <span class="style-text-feedback">{{ title }}</span>
      <CheckCheck @click="setReadAll" class="style-text-feedback cursor-pointer" />
    </div>
    <div class="flex-grow h-full">
      <a-list
        :virtualListProps="{
          height: '90vh'
          // height: 'content-fit'
        }"
        :data="list"
      >
        <template #item="{ item }">
          <router-link
            :to="{
              name: '/story/[storyId]',
              params: {
                storyId: `${item.feedId}__${item.guid}`
              }
            }"
          >
            <a-list-item
              :key="item.id"
              class="hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-700 hover:text-slate-900"
            >
              <a-list-item-meta :description="item.description">
                <template #title>
                  <div class="flex items-center space-x-2">
                    <a-badge v-if="!item.isRead" color="red" />
                    <a-badge v-else color="transparent" />
                    <div class="">
                      <span v-if="!item.isRead" class="font-bold"> {{ item.title }}</span>
                      <span v-else> {{ item.title }}</span>
                    </div>
                  </div>
                </template>
              </a-list-item-meta>
              <template #actions>
                <span>{{ formatDateTime(item.pubDate) }}</span>
              </template>
            </a-list-item>
          </router-link>
        </template>
      </a-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { podcastDB } from '@/model/db'
import { getUserId } from '@/model/model'
import type { StoryPodcast } from '@/types'
import { formatDateTime } from '@/utils/data-format'
import { CheckCheck } from 'lucide-vue-next'

const route = useRoute()

const id = computed(() => {
  const _id = (route.params as any).feedId as string

  return Number(_id)
})

// 进入列表，有可能按照时间排序，也可以按照未读排序，这里默认按照时间排序

const fetchList = async () => {
  const userId = await getUserId()
  if (userId === -1) {
    return
  }
  const feedId = id.value

  if (feedId) {
    const userReadListByFeed = await podcastDB.userRead
      .where({
        userId: userId,
        feedId: feedId
      })
      .toArray()

    podcastDB.items
      .where({ feedId: feedId })
      .toArray()
      .then((res) => {
        // console.log(55, res)
        // debugger
        list.value = res.map((item) => {
          return {
            ...item,
            isRead: userReadListByFeed.some((i) => i.storyId === item.guid)
          }
        })
      })
      .catch((err) => {
        Message.error(err)
      })
  }
}

const title = ref('')

const basicInfo = async () => {
  if (id.value) {
    const res = await podcastDB.feeds.where('id').equals(id.value).first()
    console.log('basic', res)
    title.value = res?.title ?? ''
  }
}

watch(
  () => id.value,
  () => {
    console.log('id changed')
    fetchList()
    basicInfo()
  },
  {
    immediate: true
  }
)

const list = ref<StoryPodcast[]>([])

const setReadAll = async () => {
  // const userId = getUserId()
  const unreadList = list.value.filter((item) => !item.isRead).map((item) => item.guid)
  console.log(unreadList)

  const userId = await getUserId()
  if (userId === -1) {
    return
  }
  const feedId = id.value

  await podcastDB.markStoryRead(userId, feedId, unreadList)

  fetchList()
}
</script>

<style></style>
