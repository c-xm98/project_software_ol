import { createRouter, createWebHistory } from 'vue-router'
//左右两边
import Home from '@/views/Home/HomeIndex.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
