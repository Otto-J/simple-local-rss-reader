<template>
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
  <a-list
    :style="{ width: `600px` }"
    :virtualListProps="{
      height: 560,
    }"
    :data="podcastList"
  >
    <template #item="{ item, index }">
      <a-list-item :key="index" @click="goLink(item.link)">
        <a-list-item-meta
          :title="item['title']"
          :description="formatDate(item.pubDate)"
        >
          <!-- itunes:duration -->
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
import { Message } from "@arco-design/web-vue";
import { ref } from "vue";
import axios from "redaxios";
import { XMLParser } from "fast-xml-parser";

// node only
// import { transform } from "camaro";

// https://feeds.simplecast.com/tOjNXec5

const testurl = "https://feed.xyzfm.space/rv449dl9kqka";

const formModel = ref({
  rss: testurl,
});

const podcastList = ref<any[]>([]);

const parseMain = () => {
  parseXMLByUrl(formModel.value.rss);
};

const parseStringAsXML = async (str = "") => {
  const parser = new XMLParser();
  let jObj = parser.parse(str);
  console.log(jObj);

  // return items
  podcastList.value = jObj.rss.channel.item;
};

// Fri, 08 Sep 2023 00:00:00 GMT
const formatDate = (date: string) => {
  const str = new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(date));
  return str;
};

const parseXMLByUrl = (url: string) => {
  // url not http return
  if (!url.startsWith("http")) {
    Message.error("url格式不正确");
    return;
  }

  // 使用
  axios.get(url).then((res) => {
    console.log(res.headers, res.headers["content-type"]);
    // 检查 res 的 header 是否是 xml 格式
    // if (res.headers["content-type"] !== "application/xml") {
    //   Message.error("url格式不正确");
    //   return;
    // }
    // 现在进度console

    // 解析
    parseStringAsXML(res.data);
  });
};

const goLink = (link: string) => {
  window.open(link);
};
</script>

<style></style>
