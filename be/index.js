import { createServer } from 'node:http'
import process from 'node:process'
import { XMLBuilder } from 'fast-xml-parser'

import { createApp, eventHandler, toNodeListener, createRouter } from 'h3'
import { setHeaders } from 'h3'

const getMinsList = () => {
  // 获取当前分钟数，组成一个数组
  const now = new Date()
  const mins = now.getMinutes()
  const minsList = []
  for (let i = 0; i < mins; i++) {
    minsList.push({
      title: '第' + i + '分钟',
      link: '',

      author: 'xx',
      description: '第' + i + '分钟',
      guid: i,
      cover: '',
      category: {
        text: 'x'
      },
      enclosure: {
        length: 1,
        type: 'audio/mpeg',
        url: 'https://www.baidu.com'
      }
    })
  }
  return minsList
}

const app = createApp()
const router = createRouter()
  .get(
    '/',
    eventHandler((event) => {
      const builder = new XMLBuilder()
      const xmlContent = builder.build({
        rss: {
          channel: {
            title: 'test',
            // 'itunes:author': 'xx',
            author: 'xx',
            language: 'zh-cn',

            item: getMinsList()
          }
        }
      })
      // console.log(xmlContent)

      setHeaders(event, {
        'Content-Type': 'application/xml',
        // cors
        'Access-Control-Allow-Origin': '*'
      })
      return xmlContent
    })
  )
  .get(
    '/hello/:name',
    eventHandler((event) => `Hello ${event.context.params.name}!`)
  )

app.use(router)

createServer(toNodeListener(app)).listen(process.env.PORT || 3000)
