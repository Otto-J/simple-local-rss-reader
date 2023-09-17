// db.ts
import Dexie, { type Table } from 'dexie'
import type { StoryPodcast, Feed, User, UserNote, UserRead } from '../types'

/**
 * 数据库 PodcastDB
 * 表设计 podcasts 栏目基础信息维护
 * 表设计 items 栏目 rss 内容，数量较大，无状态，通过 podcasts.id 关联
 * 表设计 users 用户默认 root 已读状态关联 items.uuid
 * 表设计 userNotes 用户评论、笔记文本，关联 users.id items.id
 */

const DBName = 'PodcastDB'

const TableFeed = 'feeds'
const TableItems = 'items'
const TableUsers = 'users'
const TableUserNotes = 'userNotes'
const TableUserRead = 'userRead'

export class PodcastDB extends Dexie {
  // podcast info table
  [TableFeed]!: Table<Feed>;
  // podcastItem info table
  [TableItems]!: Table<StoryPodcast>;
  // user info table
  [TableUsers]!: Table<User>;
  // user note info table
  [TableUserNotes]!: Table<UserNote>;
  // user read info table
  [TableUserRead]!: Table<UserRead>

  constructor() {
    super(DBName)
    // 设定索引
    this.version(1).stores({
      [TableFeed]: '++id, title,rss',
      [TableItems]: '++id, title, feedId,[feedId+guid]',
      [TableUsers]: '++id, name,[feedId+storyId]',
      [TableUserNotes]: '++id,title',
      [TableUserRead]: '++id,userId,feedId,storyId,[userId+feedId+storyId]'
    })
  }

  createPodcast(info: any) {
    if (!info.createTime) {
      info.createTime = String(+new Date())
    }
    info.updateTime = String(+new Date())

    return this[TableFeed].add(info)
  }

  refreshPodcast(id: number) {
    this.transaction('rw', this[TableFeed], this[TableItems], async (tx) => {
      // 清空 对应的 items
      await this[TableItems].where('feedId').equals(id).delete()
      // 重新获取
    })
  }

  findPodcast({ page = 1, size = 10 }) {
    return this[TableFeed].offset((page - 1) * size)
      .limit(size)
      .toArray()
  }

  deletePodcast(id: number) {
    return this[TableFeed].where('id').equals(id).delete()
  }
  deleteItem(feedId: number) {
    return this[TableItems].where({
      feedId: feedId
    }).delete()
  }

  async initUser() {
    //  考虑纯单机版实现
    const isExists = await this[TableUsers].count()
    if (isExists > 0) {
      // 已存在
      console.log('已存在 不需要初始化')
    } else {
      // 不存在
      this[TableUsers].add({
        name: 'root',
        readList: [],
        createTime: String(+new Date()),
        updateTime: String(+new Date())
      })
    }
  }

  markStoryRead(userId: number, feedId: number, storyId: string | string[]) {
    if (!Array.isArray(storyId)) {
      // 单个设置已读
      this[TableUserRead].where({
        userId,
        storyId,
        feedId
      })
        .first()
        .then((res) => {
          if (res) {
            // 已存在
          } else {
            // 不存在
            this[TableUserRead].add({
              userId,
              storyId,
              feedId,
              createTime: String(+new Date()),
              updateTime: String(+new Date())
            })
          }
        })
    } else {
      // 批量设置已读
      const list = storyId.map((id) => {
        return {
          userId,
          storyId: id,
          feedId,
          createTime: String(+new Date()),
          updateTime: String(+new Date())
        }
      })

      return this[TableUserRead].bulkAdd(list)
    }
  }
}

export const podcastDB = new PodcastDB()
