<template>
  <div class="w-full flex space-x-4 bg-gray-100 dark:bg-gray-900">
    <div class="w-4/12 md:block hidden h-screen overflow-auto">
      <slot name="sidebar" />
    </div>
    <div class="lg:w-8/12 w-full h-screen overflow-auto">
      <slot name="detail"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup></script>

<style></style>
