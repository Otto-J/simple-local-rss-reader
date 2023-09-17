<template>
  <div class="w-full h-screen flex flex-col p-4">
    <div class="mb-4 text-lg flex-shrink-0 flex justify-between items-center">
      <span class="style-text-feedback">{{ title }}</span>
      <CheckCheck class="style-text-feedback cursor-pointer" />
    </div>
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
            <a-list-item :key="item.id" class="hover:bg-slate-300 dark:hover:bg-slate-800">
              <a-list-item-meta :description="item.description">
                <template #title>
                  <div class="flex items-center space-x-2">
                    <a-badge color="red" />
                    <span class="font-bold"> {{ item.title }}</span>
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
import type { IPodcastItem } from '@/types'
import { formatDateTime } from '@/utils/data-format'
import { CheckCheck } from 'lucide-vue-next'

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
