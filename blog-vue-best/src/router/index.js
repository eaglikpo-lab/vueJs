// import { createRouter, createWebHistory } from 'vue-router'
import { createWebHashHistory, createRouter } from 'vue-router'

import Accueil from '../views/Accueil.vue'
import RegisterView from '../views/RegisterView.vue'
import ResetPassView from '../views/ResetPassView.vue'
import ForgotView from '../views/ForgotView.vue'
import LoginView from '../views/LoginView.vue'
import UserDashboard from '../views/UserDashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import About from '../views/About.vue'
import Help from '../views/Help.vue'
import AdminCategories from '../components/Admin/AdminCategories.vue'
import AdminArticles from '../components/Admin/AdminArticles.vue'
import AdminUsers from '../components/Admin/AdminUsers.vue'

const routes = [
  { path: '/', component: Accueil },
  {path: '/register', component: RegisterView},
  { path: '/forgot', component: ForgotView },
  { path: '/reset-password', component: ResetPassView },
  { path: '/login', component: LoginView },
  { path: '/user', component: UserDashboard },
  { path: '/admin', component: AdminDashboard },
  {path: '/about', component: About},
  { path: '/help', component: Help },
  { path: '/admin/categories', component: AdminCategories },
  { path: '/admin/articles', component: AdminArticles },
  { path: '/admin/users', component: AdminUsers },

  
  {
    path: '/articles/:id',
    name: 'ArticleView',
    component: () => import('../views/Article.vue'),
    props: true
  },

  {
  path: "/preview/article/:id",
  name: "article-preview",
  component: () => import("../views/Article.vue"),
  // component: () => import("../views/UserDashboard.vue"),
  meta: { preview: true }
}

]

const router = createRouter({
  history: createWebHashHistory(), // <-- hash mode
  // history: createWebHistory(),
  routes,
})

export default router
