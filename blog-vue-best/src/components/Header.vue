<template>
  <header class="bg-white shadow-md sticky top-0 z-10">
    <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold italic text-blue-600 cursor-pointer" @click="goHome">
        Mon Blog Vue
      </h1>

      <nav class="space-x-6 text-gray-600 font-medium">
        <router-link to="/" class="hover:text-blue-600 transition">Accueil</router-link>
        <router-link to="/about" class="hover:text-blue-600 transition">À propos</router-link>
        <router-link to="/help" class="hover:text-blue-600 transition">Aide</router-link>
        <router-link to="/login" class="text-blue-600 hover:underline">Connexion</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<style scoped>
header {
  font-family: 'Poppins', sans-serif;
}
</style>
