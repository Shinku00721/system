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
          path: '/home',
          name: '首页',
          component: () => import('@/views/home/index.vue'),
        },
        {
          path: '/setting/menu',
          component: () => import('@/views/setting/menu/index.vue'),
        }, {
          path: '/setting/role',
          component: () => import('@/views/setting/role/index.vue')
        }, {
          path: '/setting/user',
          component: () => import('@/views/setting/user/index.vue')
        }
      ]
    },


    {
      path: '/content',
      name: '内容管理',
      component: () => import('@/layout/index.vue'),
      children: [
        {
          path: '/content/category',
          name: '分类管理',
          component: () => import('@/views/content/category/index.vue'),
        },
        {
          path: '/content/question',
          name: '八股文管理',
          component: () => import('@/views/content/question/index.vue'),
        },
        {
          path: '/content/exam',
          name: '题库管理',
          component: () => import('@/views/content/exam/index.vue'),
        },
        {
          path: '/content/share',
          name: '经验分享',
          component: () => import('@/views/content/share/index.vue'),
        }
      ]
    },
    {
      path: '/app',
      name: 'app',
      component: () => import('@/layout/index.vue'),
      children: [
        {
          path: '/app/user',
          name: '用户管理',
          component: () => import('@/views/app/user/index.vue')
        },
        {
          path: '/app/userDevice',
          name: '设备管理',
          component: () => import('@/views/app/userDevice/index.vue')
        },
        {
          path: '/app/carouselList',
          name: '轮播图管理',
          component: () => import('@/views/app/carouselList/index.vue')
        },
        {
          path: '/app/feedbackList',
          name: '问题反馈',
          component: () => import('@/views/app/feedbackList/index.vue')
        }, {
          path: '/app/updateList',
          name: '版本更新',
          component: () => import('@/views/app/updateList/index.vue')
        }
      ]
    }
  ],
})

export default router
