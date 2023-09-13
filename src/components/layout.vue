<template>
  <div class="w-full flex space-x-4 bg-gray-100 dark:bg-gray-900">
    <div class="w-4/12 h-screen">
      <slot name="sidebar" />
    </div>
    <div class="w-8/12 h-screen">
      <!-- 右侧分栏内容 -->
      <!-- <div class="p-4">
        <h2 class="text-xl font-bold mb-4">文章标题</h2>
        <p class="text-gray-700">文章内容...</p>
      </div> -->
      <slot name="detail"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup></script>

<style></style>
