<template>
  <div
    id="audio-player"
    class="w-full h-16 text-slate-200 bg-slate-700 flex items-center justify-between rounded-md px-4"
  >
    <video ref="videoRef" :src="props.url" class="hidden" :controls="false"></video>
    <div class="flex items-center">
      <div class="w-12 h-12 bg-slate-400 rounded-md mr-2">
        <img v-if="props.cover" class="w-full block max-w-full m-0" :src="props.cover" alt="" />
      </div>
      <div class="sm:block hidden">
        <p style="width: 10em" class="truncate m-0">
          <span>
            {{ props.title }}
          </span>
        </p>

        <p class="text-sm m-0 text-slate-200 truncate" style="max-width: 10em">
          {{ props.author }}
        </p>
      </div>
    </div>
    <div class="flex items-center lg:space-x-4 space-x-2">
      <button class="" @click="forward(-5)">
        <Undo v-bind="iconSetting" />
      </button>
      <button @click="togglePlay" class="">
        <PlayCircle v-show="!videoPlayStatus" v-bind="iconSetting" />
        <PauseCircle v-show="videoPlayStatus" v-bind="iconSetting" />
      </button>
      <button class="" @click="forward(5)">
        <Redo v-bind="iconSetting" />
      </button>
    </div>
    <div class="flex items-center space-x-4">
      <div>{{ secondsToHMS(currentTime) }} / {{ durationFinal }}</div>
      <div class="cursor-pointer text-sm hover:text-slate-400" @click="videoSpeed">
        {{ currentSpeed }}x
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { PlayCircle, PauseCircle, Undo, Redo, Gauge } from 'lucide-vue-next'
import { usePlayer, secondsToHMS } from './audio-player/model'
import { Regex } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    url: string
    duration: string | number
    title: string
    author: string
    cover: string
  }>(),
  {
    url: '',
    duration: '00:00:00',
    title: 'Title',
    author: 'Author',
    cover: ''
  }
)

const durationFinal = computed(() => {
  const num = String(props.duration)

  // 123 00:00 00:00:00

  const exp1 = new RegExp(/^\d{2}:\d{2}$/)
  const exp2 = new RegExp(/^\d+$/)
  const exp3 = new RegExp(/^\d+:\d{2}:\d{2}$/)

  if (exp1.test(num)) {
    return `00:${num}`
  } else if (exp2.test(num)) {
    return secondsToHMS(Number(num))
  } else if (exp3.test(num)) {
    return num
  } else {
    Message.error('解析音频时长失败:' + num)
  }
})

const {
  videoRef,
  videoPlayStatus,
  togglePlay: _togglePlay,
  forward: _forward,
  jumpTime,
  videoSpeed: _videoSpeed,
  currentTime,
  showTime,
  videoSpeedNumber
} = usePlayer()

const forward = (second: number) => {
  _forward(second)
  showTime()
}

let currentSpeed = ref('1.0')

const videoSpeed = () => {
  _videoSpeed()
  setCurrentSpeed()
}

const setCurrentSpeed = () => {
  function formatNumber(num: number) {
    if (Number.isInteger(num)) {
      return num.toFixed(1)
    } else {
      return num.toString()
    }
  }
  const r = videoRef.value?.playbackRate
  currentSpeed.value = formatNumber(r ?? 1)
}

let showTimeTimer: number

const startTimer = () => {
  showTimeTimer = setInterval(showTime, 1000)
}
const stopTimer = () => {
  if (showTimeTimer) {
    clearInterval(showTimeTimer)
  }
}

const togglePlay = () => {
  _togglePlay()
  if (videoPlayStatus.value) {
    startTimer()
  } else {
    stopTimer()
  }
}

const iconSetting = {
  size: 28
}
</script>

<style>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-100%);
  }
}

.marquee {
  animation: marquee 10s linear infinite;
}
</style>
