import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  // 设置模式
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: '登录',
      component: () => import('../views/login/index.vue'),
    },
    {
      path: '/',
      name: 'layout',
      redirect: '/home',
      component: () => import('@/layout/index.vue'),
      children: [
        {
          path: '/content/category',
          name: '分类',
          component: () => import('@/views/content/category/index.vue'),
        },
        {
          path: '/content/question',
          name: '问题',
          component: () => import('@/views/content/question/index.vue'),
        },
        {
          path: '/home',
          name: '首页',
          component: () => import('@/views/home/index.vue'),
        },
        {
          path: '/setting/menu',
          component: () => import('@/views/setting/menu/index.vue'),
        }
      ]
    },
  ],
})

export default router
