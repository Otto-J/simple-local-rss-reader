// db.ts
import Dexie, { type Table } from 'dexie'
import type { IPodcastItem, Podcast, User, UserNote } from '../types'

/**
 * 数据库 PodcastDB
 * 表设计 podcasts 栏目基础信息维护
 * 表设计 items 栏目 rss 内容，数量较大，无状态，通过 podcasts.id 关联
 * 表设计 users 用户默认 root 已读状态关联 items.uuid
 * 表设计 userNotes 用户评论、笔记文本，关联 users.id items.id
 */

const DBName = 'PodcastDB'

const TablePodcasts = 'podcasts'
const TableItems = 'items'
const TableUsers = 'users'
const TableUserNotes = 'userNotes'

export class PodcastDB extends Dexie {
  // podcast info table
  [TablePodcasts]!: Table<Podcast>;
  // podcastItem info table
  [TableItems]!: Table<IPodcastItem>;
  // user info table
  [TableUsers]!: Table<User>;
  // user note info table
  [TableUserNotes]!: Table<UserNote>

  constructor() {
    super(DBName)
    // 设定索引
    this.version(1).stores({
      [TablePodcasts]: '++id, title,rss',
      [TableItems]: '++id, title, podcastId',
      [TableUsers]: '++id, name',
      [TableUserNotes]: '++id,title'
    })
  }

  createPodcast(info: any) {
    if (!info.createTime) {
      info.createTime = String(+new Date())
    }
    info.updateTime = String(+new Date())

    return this[TablePodcasts].add(info)
  }

  refreshPodcast(id: number) {
    this.transaction('rw', this[TablePodcasts], this[TableItems], async (tx) => {
      // 清空 podcastId 对应的 items
      await this[TableItems].where('podcastId').equals(id).delete()
      // 重新获取
    })
  }

  findPodcast({ page = 1, size = 10 }) {
    return this[TablePodcasts].offset((page - 1) * size)
      .limit(size)
      .toArray()
  }

  deletePodcast(id: number) {
    return this[TablePodcasts].where('id').equals(id).delete()
  }
  deleteItem(podcastId: number) {
    return this[TableItems].where({
      podcastId: podcastId
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

  markRead(userId: number, podcastId: number, itemId: string | string[]) {
    if (!Array.isArray(itemId)) {
      // 单个设置已读
      // 放入 user 表
      this[TableUsers].where('id')
        .equals(userId)
        .modify((x) => {
          x.readList.push({
            podcastId: podcastId,
            infoId: itemId,
            updateTime: String(+new Date())
          })
        })
    } else {
      // 批量设置已读
    }
  }
}

export const podcastDB = new PodcastDB()
