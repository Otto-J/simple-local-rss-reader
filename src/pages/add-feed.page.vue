<template>
  <div class="w-full p-4">
    <h2>添加新订阅</h2>

    <a-form :model="formModel">
      <a-form-item field="url" label="url">
        <a-input v-model="formModel.url" />
      </a-form-item>
      <a-form-item field="category" label="分组">
        <a-select v-model="formModel.category" allow-create placeholder="可以创建新的分组">
          <a-option v-for="item of userCategoryList" :key="item.id"></a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" :loading="addLoading" @click="parseMain"> 添加 </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { useParseRss } from '@/model/model'

const defaultModel = () => ({
  url: '',
  category: ''
})

const formModel = ref(defaultModel())

const { parseXMLByUrl, addLoading } = useParseRss()

const userCategoryList = ref<any[]>([])

const parseMain = () => {
  const url = formModel.value.url
  parseXMLByUrl(url)
}
</script>

<style></style>
