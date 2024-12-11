import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'
import './styles/main.css'

const pinia = createPinia()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  extendRoutes: routes => setupLayouts(routes),
})

router.push({
  path: 'ss',
  query: {

  },
})
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
