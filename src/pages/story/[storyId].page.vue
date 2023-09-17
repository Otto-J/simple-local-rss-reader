<template>
  <div id="info-id" class="p-4 h-full flex flex-col">
    <div class="flex justify-start items-center space-x-2 mb-4">
      <ArrowLeft :size="18" class="cursor-pointer style-text-feedback" @click="$router.back" />
      <span class="text-slate-900 style-text-feedback">RSS 详情</span>
    </div>
    <a-descriptions title="" layout="inline-horizontal">
      <a-descriptions-item label="from"> {{ feedInfo?.title }} </a-descriptions-item>
    </a-descriptions>
    <div class="mt-4 flex-auto">
      <article class="prose prose-slate dark:prose-invert w-full max-w-full">
        <h1 class="m-0">{{ storyInfo?.title }}</h1>
        <p>update: {{ formatDateTime(storyInfo?.pubDate ?? '') }}</p>
        <div class="max-w-2xl mx-auto">
          <audioPlayer
            :url="storyInfo?.media.url"
            :duration="storyInfo?.duration"
            :title="storyInfo?.title"
            :author="feedInfo?.author"
            :cover="feedInfo?.cover"
          />
        </div>
        <div v-html="storyInfo?.content"></div>
      </article>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { podcastDB } from '@/model/db'
import type { Feed, StoryPodcast } from '@/types'
import { formatDateTime } from '@/utils/data-format'
import { ArrowLeft } from 'lucide-vue-next'

import audioPlayer from '@/components/audio-player.vue'
import { getUserId } from '@/model/model'

definePage({
  props: true
})

const feedInfo = ref<Feed | null>(null)
const storyInfo = ref<StoryPodcast | null>(null)

const props = withDefaults(
  defineProps<{
    storyId?: string
  }>(),
  {
    storyId: ''
  }
)

const postInfo = computed(() => {
  const [feedId, ...rest] = props.storyId.split('__')
  return {
    feedId,
    storyId: rest.join('')
  }
})

onMounted(() => {
  markRead()
})

// 进入页面立刻设置已读
const markRead = async () => {
  let userId = null
  const user = await podcastDB.users
    .where({
      // 用户身份验证
      name: 'root'
    })
    .first()
  if (!user) {
    return
  }

  userId = user.id as number

  await podcastDB.markStoryRead(userId, Number(postInfo.value.feedId), postInfo.value.storyId)
}

const parseInfo = (feedId: string) => {
  podcastDB.feeds
    .get({
      id: Number(feedId)
    })
    .then((res) => {
      // console.log('1info', res)
      feedInfo.value = res ?? null
    })
}

const parseStory = async (feedId: number, guid: string) => {
  const userId = await getUserId()
  if (userId === -1) {
    Message.error('未找到用户')
    return
  }

  const storyDetail = await podcastDB.items
    .where({
      feedId,
      guid
    })
    .first()

  storyInfo.value = storyDetail ?? null
}

// 有点奇怪
// const getReadList = () =>
watchEffect(() => {
  if (postInfo.value.feedId && postInfo.value.storyId) {
    parseInfo(postInfo.value.feedId)
    parseStory(Number(postInfo.value.feedId), postInfo.value.storyId)
  }
})
</script>

<style></style>
