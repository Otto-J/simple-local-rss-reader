import type { IPodcastItem, Podcast } from '@/types'
import { podcastDB } from './db'
import { Message } from '@arco-design/web-vue'

// podcastDB;

export const handleRawRssJson = (channel: any) => {
  const podcastInfo: Podcast = {
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
    updateTime: String(+new Date())
  }

  const podcastList: IPodcastItem[] = []
  ;(channel.item as any[]).forEach((i: any) => {
    podcastList.push({
      title: i.title,
      content: i['content:encoded'] ?? i.description,
      pubDate: i.pubDate,
      link: i.link,
      guid: i.guid['#text'],
      cover: i['itunes:image']?.href ?? '',
      duration: i['itunes:duration'],
      media: {
        length: i.enclosure.length,
        type: i.enclosure.type,
        url: i.enclosure.url
      },
      updateTime: String(+new Date()),
      podcastId: -1
    })
  })
  return {
    podcastInfo,
    podcastList
  }
}

export const addPodcast = async (channel: any) => {
  const { podcastInfo, podcastList } = handleRawRssJson(channel)
  const res = await podcastDB.createPodcast({
    ...podcastInfo
  })
  console.log(1, res)
  Message.success('订阅添加成功')

  // podcastDB.items.clear()

  podcastList.forEach((i) => {
    i.podcastId = res as number
  })

  podcastDB.items.bulkAdd(podcastList)
  Message.success('列表添加成功')
}
