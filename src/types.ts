export interface Feed {
  id?: number
  title: string
  link: string
  author: string
  rss: string
  extrInfo: {
    category: string
    language: string
  }
  description: string
  cover: string
  isPodcast: boolean
  remark: string
  createTime: string
  updateTime: string
}

export interface User {
  id?: number
  name: string
  readList: Array<{
    feedId: number
    storyId: string
    updateTime: string
  }>
  createTime: string
  updateTime: string
}

export interface UserNote {
  id?: number
  title: string
  content: string
  createTime: string
  updateTime: string

  // 关联
  itemId: string
}

export interface UserRead {
  id?: number //
  userId: number
  feedId: number
  storyId: string
  createTime: string
  updateTime: string
}

export interface StoryPodcast {
  id?: number
  title: string
  content: string
  pubDate: string
  link: string
  cover: string
  duration: string
  guid: string
  createTime?: string
  updateTime?: string
  isRead?: boolean

  media: {
    length: string
    type: string
    url: string
  }
  // relation
  feedId: number
}
