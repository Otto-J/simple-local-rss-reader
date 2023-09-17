import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

import App from './App.vue'
import { podcastDB } from './model/db'

const app = createApp(App)

app.use(createPinia())
app.use(router)

podcastDB.initUser()

app.mount('#app')
