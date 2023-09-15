<template>
  <div class="p-4">
    <div class="flex justify-start items-center space-x-2 mb-4">
      <ArrowLeft :size="18" class="cursor-pointer style-text-feedback" @click="$router.back" />
      <span class="text-slate-900 style-text-feedback">RSS 详情</span>
    </div>
    <a-descriptions title="" layout="inline-horizontal">
      <a-descriptions-item label="from"> {{ podcastInfo?.title }} </a-descriptions-item>
    </a-descriptions>
    <div class="mt-4">
      <article class="prose prose-slate dark:prose-invert w-full max-w-full">
        <h1 class="m-0">{{ postDetail?.title }}</h1>
        <p>update: {{ formatDateTime(postDetail?.pubDate ?? '') }}</p>
        <div class="max-w-2xl mx-auto">
          <audioPlayer
            :url="postDetail?.media.url"
            :duration="postDetail?.duration"
            :title="postDetail?.title"
            :author="podcastInfo?.author"
            :cover="podcastInfo?.cover"
          />
        </div>
        <div v-html="postDetail?.content"></div>
      </article>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { podcastDB } from '@/model/db'
import type { IPodcastItem, Podcast } from '@/types'
import { formatDateTime } from '@/utils/data-format'
import { ArrowLeft } from 'lucide-vue-next'

import audioPlayer from '@/components/audio-player.vue'

definePage({
  props: true
})

const podcastInfo = ref<Podcast | null>(null)
const postDetail = ref<IPodcastItem | null>(null)

const props = withDefaults(
  defineProps<{
    id?: string
  }>(),
  {
    id: ''
  }
)

const postInfo = computed(() => {
  const [podcastId, ...rest] = props.id.split('__')
  return {
    podcastId,
    postId: rest.join('')
  }
})

const parseInfo = (podcastId: string) => {
  podcastDB.podcasts
    .get({
      id: Number(podcastId)
    })
    .then((res) => {
      // console.log('1info', res)
      podcastInfo.value = res ?? null
    })
}

const parseList = (podcastId: string, infoId: string) => {
  podcastDB.items
    .get({
      podcastId: Number(podcastId),
      guid: infoId
    })

    .then((res) => {
      // console.log('2info', res)
      postDetail.value = res ?? null
    })
}

watchEffect(() => {
  if (postInfo.value.podcastId && postInfo.value.postId) {
    parseInfo(postInfo.value.podcastId)
    parseList(postInfo.value.podcastId, postInfo.value.postId)
  }
})
</script>

<style></style>
