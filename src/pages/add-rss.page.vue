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
import { ref } from 'vue'
import axios from 'axios'
import { Message } from '@arco-design/web-vue'
import { blobToString, parseStringAsXML } from '@/utils/data-format'
import { addPodcast } from '@/model/model'

const defaultModel = () => ({
  url: '',
  category: ''
})

const addLoading = ref(false)

const formModel = ref(defaultModel())

const userCategoryList = ref<any[]>([])

const parseMain = () => {
  const url = formModel.value.url
  parseXMLByUrl(url)
}

const parseXMLByUrl = (url: string) => {
  // url not http return
  if (!url.startsWith('http')) {
    Message.error('url格式不正确')
    return
  }

  addLoading.value = true
  // 使用
  axios
    .request({
      url,
      method: 'get',
      responseType: 'blob',
      onDownloadProgress: function (progressEvent) {
        // console.log(2, progressEvent);
        console.log('已下载', progressEvent.loaded)
        if (!progressEvent.total) return
        // 计算下载进度
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log('下载进度：' + percentCompleted + '%')
      }
    })
    .then((res) => {
      // console.log("raw", res);
      return blobToString(res.data)
    })
    .then((data) => {
      // console.log(1, data);
      if (data) {
        // 解析
        return parseStringAsXML<{ rss: { channel: any } }>(data)
      } else {
        throw new Error('data is null')
      }
    })
    .then((res) => {
      console.log(2, res)

      handleJson(res.rss.channel)

      //  podcastList = res.rss.channel.item;
    })
    .catch((err) => {
      Message.error(err)
    })
    .finally(() => {
      addLoading.value = false
    })
}

const handleJson = (channel: any) => {
  addPodcast(channel)
}
</script>

<style></style>
