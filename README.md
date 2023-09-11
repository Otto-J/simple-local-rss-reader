# rss list local

纯本地的 rss 阅读器、播客阅读器。

## 当前阶段

wip，草稿阶段，验证想法。

- [x] 填写 url 实时拉取、解析列表
- [ ] 数据持久化到 indexedDB 中
- [ ] 实现列表页，多 rss 源
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
