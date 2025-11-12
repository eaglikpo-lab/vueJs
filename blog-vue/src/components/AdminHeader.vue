<template>
  <header class="bg-gray-900 text-white shadow-md sticky top-0 z-10">
    <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-blue-400 cursor-pointer" @click="goDashboard">
        Admin Panel
      </h1>

      <nav class="space-x-6 text-gray-300 font-medium flex items-center">
        <router-link to="/admin" class="hover:text-blue-400 transition">Dashboard</router-link>
        <router-link to="/admin/categories" class="hover:text-blue-400 transition">Catégories</router-link>
        <router-link to="/admin/articles" class="hover:text-blue-400 transition">Articles</router-link>
        <router-link to="/admin/users" class="hover:text-blue-400 transition">Utilisateurs</router-link>
        <router-link to="/admin/stats" class="hover:text-blue-400 transition">Statistiques</router-link>

        <button
          @click="logout"
          class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white transition"
        >
          Déconnexion
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goDashboard() {
  router.push('/admin')
}

function logout() {
  localStorage.removeItem('user')
  localStorage.removeItem('authToken')
  router.push('/')
  window.location.reload()
}
</script>
