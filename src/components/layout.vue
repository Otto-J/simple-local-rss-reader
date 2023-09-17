<template>
  <div id="layout" class="w-full flex py-2 px-4 space-x-4 h-full">
    <div class="w-2/12 sm:w-4/12 h-full overflow-auto">
      <slot name="sidebar" />
    </div>
    <div class="w-10/12 lg:w-8/12 h-full overflow-auto">
      <slot name="detail"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup></script>

<style></style>
