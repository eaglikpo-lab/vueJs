<!-- src/components/Header.vue -->
<template>
  <header class="sticky top-0 bg-white shadow p-4 flex justify-between items-center z-50">
    <h1 class="text-xl font-bold">Mon Blog</h1>

    <div class="flex items-center space-x-3">
      <!-- Si non connecté -->
      <button
        v-if="!isAuthenticated"
        @click="$emit('show-login')"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Connexion
      </button>

      <!-- Si connecté -->
      <div v-else class="flex items-center space-x-3">
        <div v-if="userAvatar" class="w-10 h-10 rounded-full overflow-hidden">
          <img :src="userAvatar" alt="Profil" />
        </div>
        <div
          v-else
          class="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold"
        >
          {{ userInitials }}
        </div>
        <button
          @click="handleLogout"
          class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Déconnexion
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const { isAuthenticated, logout, token } = useAuth()
const router = useRouter()

// Exemple d'initiales à partir du mail ou nom
const userInitials = computed(() => {
  if (!isAuthenticated.value) return ''
  const email = atob(token.value.split('.')[1]) // si JWT, sinon adapter
  return email[0]?.toUpperCase() || 'U'
})

const userAvatar = null // si tu veux gérer des avatars via API

function handleLogout() {
  logout()
  router.push('/')
}
</script>
 