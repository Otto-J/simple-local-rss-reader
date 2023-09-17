# rss list local

纯本地的 rss 阅读器、播客阅读器。

## 当前阶段

wip，草稿阶段，验证想法。

- [x] 填写 url 实时拉取、解析列表
- [x] 数据持久化到 indexedDB 中
- [x] 实现列表页，多 rss 源
- [ ] 已读标记
- [ ] optional ai 总结 description 内容
- [ ] 美化样式
- [ ] 区分文章、播客
- [ ] 账号系统 online 备份，cloudflare d1/mysql

## 亮点

- 纯网页，自由托管，不依赖后端
- 导出自由，协议开放

## 技术实现

- `bun` 超快的 runtime
- `vue3` 响应式
- `arco-design` 基础组件
- `dexie` 管理 indexedDB
- `fast-xml-parser` 解析 xml 为 json

## 路由设计

layout 分成左右两列，只有右边变化

- `/ -> home` init
  - `home` blank page
  - `list` a podcast list
  - `add-feed` add new rss
  - `export-and-import` export/import
  - `settings`

## 表设计

- 数据库 PodcastDB

  - 表设计 podcasts 栏目基础信息维护
  - 表设计 items 栏目 rss 内容，数量较大，无状态，通过 podcasts.id 关联
  - 表设计 users 用户默认 root 已读状态关联 items.uuid
  - 表设计 userNotes 用户评论、笔记文本，关联 users.id items.id

- users []
  - readList: number[]
  - username:string
  - avatar: string
  - createTime
  - updateTime
