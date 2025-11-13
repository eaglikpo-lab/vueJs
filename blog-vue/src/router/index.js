import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UserDashboard from '../views/UserDashboard.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgotView from '../views/ForgotView.vue'
import ResetPassView from '../views/ResetPassView.vue'
import Acceuil from '../views/Acceuil.vue'
import About from '../views/About.vue'
import Help from '../views/Help.vue'

const routes = [
  // { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/admin', component: AdminDashboard },
  { path: '/user', component: UserDashboard },
  { path: '/register', component: RegisterView },
  { path: '/forgot', component: ForgotView },
  { path: '/reset-password', component: ResetPassView },
  { path: '/', component: Acceuil },
  {path: '/about', component: About},
  {path: '/help', component: Help},
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
  history: createWebHistory(),
  routes,
})

export default router
