import { createRouter, createWebHistory } from 'vue-router'
//左右两边
import Home from '@/views/Home/HomeIndex.vue'
import Preprocessing from '@/views/Preprocessing/PreprocessingIndex.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/Preprocessing',
        name: 'Preprocessing',
        component: Preprocessing,
        redirect: '/preprocessing/file-input',
        children: [
          {
            
            path: 'file-input',
            name: 'FileInput',
            component: () => import('@/views/Preprocessing/FileInput.vue'),
          },
          {
            path: 'data-clearing',
            name: 'DataCleaning',
            component: () => import('@/views/Preprocessing/DataCleaning.vue'),
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
