import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/summary',
      name: 'database-summary',
      component: () => import('./views/Summary.vue'),
      props: true
    },
    {
      path: '/query',
      name: 'gene-query',
      component: () => import('./views/Summary.vue'),
      props: true
    },
    {
      path: '/gene/:name',
      name: 'gene-details',
      component: () => import('./views/Gene.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/docs/api',
      name: 'api',
      component: () => import('./views/Api.vue')
    },
    {
      path: '/docs/tos',
      name: 'tos',
      component: () => import('./views/ToS.vue')
    },
    {
      path: '/docs/privacy',
      name: 'privacy',
      component: () => import('./views/Privacy.vue')
    },
    {
      path: '/redirect/:params',
      name: 'redirect',
      component: () => import('./views/Redirect.vue')
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
