<template>
  <a-tooltip content="明亮、暗黑模式切换">
    <MoonStar
      :size="16"
      class="app_icon"
      v-if="!isDark"
      @click="setTheme('dark')"
    />
    <Sun :size="16" class="app_icon" v-else @click="setTheme('light')" />
  </a-tooltip>
</template>
<script lang="ts" setup>
import { MoonStar, Sun } from "lucide-vue-next";

import { onMounted, onUnmounted, ref, watch, watchEffect } from "vue";

const isDark = ref(false);

// 监听 prefers-color-scheme
onMounted(() => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      setTheme(e.matches ? "dark" : "light");
    });

  setTheme("auto");
});

onUnmounted(() => {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .removeEventListener("change", (e) => {
      setTheme(e.matches ? "dark" : "light");
    });
});

watch(
  () => isDark,
  (val) => {
    setTheme(val ? "dark" : "light");
  }
);

const setTheme = (mode: "dark" | "light" | "auto") => {
  // debugger;

  if (mode === "auto") {
    const isPresetDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isPresetDark) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
    // return;
  } else if (mode === "dark") {
    document.documentElement.classList.add(mode);
    isDark.value = true;
    localStorage.setItem("theme", mode);
    document.body.setAttribute("arco-theme", mode);
  } else {
    document.documentElement.classList.remove("dark");
    isDark.value = false;
    localStorage.setItem("theme", "light");
    document.body.setAttribute("arco-theme", "light");
  }
};
</script>

<style></style>
