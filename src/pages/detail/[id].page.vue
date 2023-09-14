<template>
  <div class="w-full p-4 dark:text-slate-100 text-slate-900">
    <a-list
      :virtualListProps="{
        height: '90vh'
      }"
      :data="list"
    >
      <template #item="{ item }">
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
import { podcastDB } from '@/model/db'
import type { IPodcastItem } from '@/types'
import { Message } from '@arco-design/web-vue'
import { computed, ref } from 'vue'
import { formatDateTime } from '@/utils/data-format'
import { useRoute } from 'vue-router'
import { watchEffect } from 'vue'

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

watchEffect(() => {
  if (id.value) {
    fetchList()
  }
})

const list = ref<IPodcastItem[]>([])
//  podcastId =

// fetchList()
</script>

<style></style>
