<template>
  <div class=" "></div>
  <a-card>
    <div>{{ formModel }}</div>
    <a-form :model="formModel">
      <a-form-item label="rss" field="rss">
        <a-input v-model="formModel.rss" />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" @click="parseMain">开始解析</a-button>
      </a-form-item>
    </a-form>
  </a-card>
  <div>
    <a-space>
      <a-button @click="addPodcast">add podcast</a-button>
      <a-button type="primary" @click="loadList">存储</a-button>
      <a-button type="primary" @click="delPodcast(1)">del</a-button>
    </a-space>
  </div>
  <a-row :gutter="20">
    <a-col :span="12">
      <a-list
        :virtualListProps="{
          height: 560,
        }"
        :data="podcastInfo.podcastList"
      >
        <template #item="{ item, index }">
          <a-list-item :key="index" @click="goLink(item)">
            <a-list-item-meta
              :title="item['title']"
              :description="formatDate(item.pubDate)"
            >
              <!-- itunes:duration -->
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-col>
    <a-col :span="12">
      <div>detail</div>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
import { Message } from "@arco-design/web-vue";
import { ref } from "vue";
import axios from "axios";
import {
  blobToString,
  parseStringAsXML,
  formatDate,
} from "@/utils/data-format";
import { podcastDB } from "@/model/db";

const loadList = async () => {
  const list = await podcastDB.findPodcast({
    page: 1,
    size: 10,
  });
  console.log(44, list);
};

const addPodcast = async () => {
  const res = await podcastDB.createPodcast({
    title: "test",
  });
  console.log(1, res);
};

// https://feeds.simplecast.com/tOjNXec5

const testurl = "https://feed.xyzfm.space/rv449dl9kqka";

const formModel = ref({
  rss: testurl,
});

interface IPodcastItem {
  title: string;
  content: string;
  pubDate: string;
  link: string;
  cover: string;
  duration: string;
  guid: string;
  media: {
    length: string;
    type: string;
    url: string;
  };
}

const podcastInfo = ref({
  title: "",
  link: "",
  author: "",
  category: "",
  language: "",
  description: "",
  cover: "",
  isPodcast: false,
  podcastList: [] as IPodcastItem[],
});

const delPodcast = async (id = 1) => {
  podcastDB
    .deletePodcast(id)
    .then((res) => {
      console.log(44, res);
    })
    .catch((err) => {
      console.log(err);
    });
};

const transJsonToData = (info: any) => {
  const { title, link, language, description } = info;

  // podcasion
};

const podcastList = ref<any[]>([]);

const parseMain = () => {
  const url = formModel.value.rss;
  parseXMLByUrl(url);
};

const parseXMLByUrl = (url: string) => {
  // url not http return
  if (!url.startsWith("http")) {
    Message.error("url格式不正确");
    return;
  }

  // 使用
  axios
    .request({
      url,
      method: "get",
      responseType: "blob",
      onDownloadProgress: function (progressEvent) {
        // console.log(2, progressEvent);
        console.log("已下载", progressEvent.loaded);
        if (!progressEvent.total) return;
        // 计算下载进度
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log("下载进度：" + percentCompleted + "%");
      },
    })
    // axios.head(url)
    .then((res) => {
      console.log("raw", res);

      return blobToString(res.data);
    })
    .then((data) => {
      // console.log(1, data);
      if (data) {
        // 解析
        return parseStringAsXML<{ rss: { channel: any } }>(data);
      } else {
        throw new Error("data is null");
      }
    })
    .then((res) => {
      console.log(2, res.rss.channel);

      podcastInfo.value.podcastList = res.rss.channel.item;
    })
    .catch((err) => {
      Message.error(err);
    });
};

const storeData = () => {
  loadList();
};

const goLink = (item: any) => {
  // window.open(link);
  console.log(item);
};
</script>

<style></style>
./model/db
