import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '../views/IndexView.vue'
import MainView from '../views/MainView.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: IndexView
  },
  {
    path: '/main/:code',
    name: 'main',
    component: MainView
  },
  {
    path: '/main/',
    name: 'mainEmpty',
    component: IndexView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
