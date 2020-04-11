import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { LOGINAUTHTOKEN } from '../utils/constants'

import layout from '@/pages/layout'
import home from '@/pages/home'
import login from '@/pages/login'
import notFound from '@/pages/404'
const permissionTree = () => import('@/pages/system/permissionTree');
const userList = () => import('@/pages/system/userList');
const roleList = () => import('@/pages/system/roleList');
const departmentList = () => import('@/pages/system/departmentList');

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  try {
    return originalPush.call(this, location).catch(err => err)
  } catch (error) {
    console.log('router original push', error)
  }
}

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      name: 'noFound',
      component: notFound
    },
    { path: '/home', redirect: '/' },
    { path: '/index', redirect: '/' },
    { path: '/index.html', redirect: '/' },
    {
      path: '/login',
      name: '登录',
      component: login
    },
    {
      path: '/',
      component: layout,
      children: [
        {
          path: '/',
          name: '首页',
          component: home
        },
        {
          path: '/permissionTree',
          name: '权限管理',
          component: permissionTree
        },
        {
          path: '/userList',
          name: '用户管理',
          component: userList
        },
        {
          path: '/roleList',
          name: '角色管理',
          component: roleList
        },
        {
          path: '/departmentList',
          name: '部门管理',
          component: departmentList
        },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let login = window.localStorage.getItem(LOGINAUTHTOKEN)
  if (to.matched.some(record => record.meta.requiresAuth) && (!login)) {
    store.commit('SET_INFO', null)
    store.commit('SET_LOGIN_STATE', null)
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
