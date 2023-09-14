<template>
  <div class="w-full h-screen flex flex-col p-4 dark:text-slate-100 text-slate-900">
    <div class="mb-4 text-lg flex-shrink-0">{{ title }}</div>
    <div class="flex-grow h-full">
      <a-list
        :virtualListProps="{
          height: '90vh'
        }"
        :data="list"
      >
        <template #item="{ item }">
          <router-link
            :to="{
              name: '/info/[id]',
              params: {
                id: `${item.podcastId}__${item.guid}`
              }
            }"
          >
            <a-list-item :key="item.id" class="hover:bg-slate-200 dark:hover:bg-slate-800">
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
          </router-link>
        </template>
      </a-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { podcastDB } from '@/model/db'
import type { IPodcastItem } from '@/types'
import { formatDateTime } from '@/utils/data-format'

const route = useRoute()

const id = computed(() => {
  const _id = (route.params as any).id as string
  if (typeof Number(_id) === 'number') {
    return Number(_id)
  }
  return _id
})

const fetchList = async () => {
  if (id.value) {
    podcastDB.items
      .where('podcastId')
      .equals(id.value)
      .toArray()
      .then((res) => {
        console.log(55, res)
        list.value = res
      })
      .catch((err) => {
        Message.error(err)
      })
  }
  // list.value = await podcastDB.items
  //   .where("")
  //   //.where('name').equals
  //   .toArray();
}

const title = ref('')

const basicInfo = async () => {
  if (id.value) {
    const res = await podcastDB.podcasts.where('id').equals(id.value).first()
    console.log('basic', res)
    title.value = res?.title ?? ''
  }
}

watchEffect(() => {
  if (id.value) {
    fetchList()
    basicInfo()
  }
})

const list = ref<IPodcastItem[]>([])
//  podcastId =

// fetchList()
</script>

<style></style>
