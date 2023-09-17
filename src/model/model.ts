import type { StoryPodcast, Feed } from '@/types'
import { podcastDB } from './db'
import { Message } from '@arco-design/web-vue'
import { blobToString, parseStringAsXML } from '@/utils/data-format'

// podcastDB;

export const handleRawRssJson = (channel: any, rss: string) => {
  const podcastInfo: Feed = {
    title: channel.title,
    link: channel.link,
    author: channel['itunes:author'],
    extrInfo: {
      category: channel?.['itunes:category']?.text ?? '',
      language: channel.language ?? ''
    },
    description: channel.description,
    cover: channel['itunes:image']?.href ?? '',
    isPodcast: true,
    remark: '',
    createTime: String(+new Date()),
    updateTime: String(+new Date()),
    rss
  }

  const podcastList: StoryPodcast[] = []

  ;(channel.item as any[]).forEach((i: any) => {
    // debugger
    podcastList.push({
      title: i.title,
      content: i['content:encoded'] ?? i.description,
      pubDate: i.pubDate,
      link: i.link,
      guid: String(i.guid?.['#text']),
      cover: i['itunes:image']?.href ?? '',
      duration: i['itunes:duration'],
      media: {
        length: i.enclosure.length,
        type: i.enclosure.type,
        url: i.enclosure.url
      },
      updateTime: String(+new Date()),
      feedId: -1
    })
  })
  return {
    podcastInfo,
    podcastList
  }
}

export const addPodcast = async (channel: any, rss: string) => {
  try {
    const { podcastInfo, podcastList } = handleRawRssJson(channel, rss)

    const isExist = await podcastDB.feeds.where('rss').equals(rss).first()

    if (isExist && isExist.id) {
      // 清除原有数据
      podcastDB.items.where('feedId').equals(isExist.id).delete()

      podcastDB.feeds.where('id').equals(isExist.id).delete()

      Message.success('订阅清理成功')
    }
    // 增加
    const res = await podcastDB.createPodcast({
      ...podcastInfo
    })
    console.log(1, res)
    Message.success('订阅添加成功')

    // podcastDB.items.clear()

    podcastList.forEach((i) => {
      i.feedId = res as number
    })

    podcastDB.items.bulkAdd(podcastList)
    Message.success('列表添加成功')
  } catch (error: any) {
    Message.error(error.message)
  }
}

// parse rss by url
export const useParseRss = () => {
  const addLoading = ref(false)

  const downloadRssByUrl = (url: string) => {
    // url not http return
    if (!url.startsWith('http')) {
      Message.error('url格式不正确')
      return Promise.reject(null)
    }
    addLoading.value = true
    // 使用
    return axios
      .request({
        url,
        method: 'get',
        responseType: 'blob',
        onDownloadProgress: function (progressEvent) {
          // console.log(2, progressEvent);
          console.log('已下载', progressEvent.loaded)
          if (!progressEvent.total) return
          // 计算下载进度
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log('下载进度：' + percentCompleted + '%')
        }
      })
      .then((res) => {
        // console.log("raw", res);
        return blobToString(res.data)
      })
      .catch((err) => {
        Message.error(err)
        return null
      })
  }

  const parseXMLByUrl = (url: string) => {
    downloadRssByUrl(url)
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

        return addPodcast(res.rss.channel, url)

        //  podcastList = res.rss.channel.item;
      })
      .catch((err) => {
        Message.error(err)
      })
      .finally(() => {
        addLoading.value = false
      })
  }
  return {
    parseXMLByUrl,
    addLoading
  }
}

export const getUserId = async () => {
  const user = 'root'
  let id: number = -1
  const userInfo = await podcastDB.users.where({ name: user }).first()
  if (userInfo?.id) {
    id = userInfo.id
  } else {
    Message.error('用户不存在')
  }
  return id
}
