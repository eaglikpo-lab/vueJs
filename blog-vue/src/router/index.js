import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UserDashboard from '../views/UserDashboard.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgotView from '../views/ForgotView.vue'
import ResetPassView from '../views/ResetPassView.vue'
import Acceuil from '../views/Acceuil.vue'

const routes = [
  // { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/admin', component: AdminDashboard },
  { path: '/user', component: UserDashboard },
  { path: '/register', component: RegisterView },
  { path: '/forgot', component: ForgotView },
  { path: '/reset-password', component: ResetPassView },
  { path: '/', component: Acceuil },
  {
    path: '/articles/:id',
    name: 'ArticleView',
    component: () => import('../views/Article.vue'),
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
