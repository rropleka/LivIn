import './assets/main.css'
import './index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import store from './stores/auth/store.js'

const app = createApp(App)


app.use(createPinia())
app.use(router)
app.use(store)

app.mount('#app')