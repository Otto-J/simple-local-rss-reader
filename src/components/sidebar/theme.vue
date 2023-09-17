<template>
  <a-tooltip content="明亮、暗黑模式切换">
    <MoonStar :size="16" class="app_icon" v-if="!isDark" @click="toggleDark(true)" />
    <Sun :size="16" class="app_icon" v-else @click="toggleDark(false)" />
  </a-tooltip>
</template>
<script lang="ts" setup>
import { MoonStar, Sun } from 'lucide-vue-next'
import { useDark, useToggle, useEventListener } from '@vueuse/core'
import { watchEffect } from 'vue'

const isDark = useDark({
  selector: 'html'
})

useEventListener(
  window.matchMedia('(prefers-color-scheme: dark)'),
  'change',
  (e: MediaQueryListEvent) => {
    isDark.value = !!e.matches
  }
)

watchEffect(() => {
  document.body.setAttribute('arco-theme', isDark.value ? 'dark' : 'light')
})

const toggleDark = useToggle(isDark)
</script>

<style></style>
