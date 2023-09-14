import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueRouter from 'unplugin-vue-router/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      /* options */
      routesFolder: 'src/pages',
      extensions: ['.page.vue'],
      dts: './typed-router.d.ts',
      routeBlockLang: 'json5'
    }),
    VueDevTools(),
    vue(),
    vueJsx(),
    vitePluginForArco({
      style: 'css'
    }),
    AutoImport({
      /* options */
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: [
        'vue',
        {
          'vue-router/auto': ['useRouter', 'useRoute', 'definePage']
        },
        {
          '@arco-design/web-vue': ['Message']
        },
        {
          axios: [
            // default imports
            ['default', 'axios'] // import { default as axios } from 'axios',
          ]
        }
        // {
        //   from: 'vue-router/auto',
        //   imports: ['RouteLocationRaw'],
        //   type: true
        // }
      ],
      dts: './auto-imports.d.ts',
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
