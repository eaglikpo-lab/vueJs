<template>
  <header class="bg-white shadow-md sticky top-0 z-10">
    <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold italic text-blue-600 cursor-pointer" @click="goHome">
        Mon Blog Vue
      </h1>

      <nav class="space-x-6 text-gray-600 font-medium flex items-center">
        <router-link to="/user" class="hover:text-blue-600 transition">Accueil</router-link>
        <router-link to="/about" class="hover:text-blue-600 transition">À propos</router-link>
        <router-link to="/help" class="hover:text-blue-600 transition">Aide</router-link>

        <div class="flex items-center space-x-2">
          <div
            class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold cursor-pointer"
          >
            {{ userInitials }}
          </div>
          <button
            @click="logout"
            class="text-sm text-red-600 hover:underline transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// import { useUserStore } from '@/stores/user'
// const userStore = useUserStore()

const user = JSON.parse(localStorage.getItem('user'))
console.log(user.role);

const userInitials = computed(() => {
  if (!user) return '?'
  const name = user.name || user.email
  return name.charAt(0).toUpperCase()
})

function goHome() {
  router.push('/user')
}

function logout() {
    // userStore.logout() // met à jour tout l'app et navigue vers '/'
  localStorage.removeItem('user');

  localStorage.removeItem('authToken');
  
  localStorage.clear();
  router.push('/')
  console.log("push vers Acceuil");
  // window.location.reload()
  // console.log("reload effectué");
  window.location.href = '/'   
  console.log(localStorage.getItem('authToken'));
  console.log(localStorage.getItem('user'));
  router.push('/')
  
}
</script>
