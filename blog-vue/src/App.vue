<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50 text-gray-800">

    <!-- ✅ Header visible seulement si on n’est PAS sur les routes admin/user -->
    <!-- <Header v-if="!hideHeader" /> -->

    <UserHeader v-if="userHeader && userRole=== 'user'"/>
    <!-- <AdminHeader v-else-if="adminHeader && userRole=== 'admin'"/> -->
    <Header v-else-if="!userHeader && !adminHeader"/>


    <!-- Header selon le rôle -->
    <!-- <Header v-if="!userRole" />
    <AdminHeader v-else-if="userRole === 'admin'" />
    <UserHeader v-else-if="userRole === 'user'" />  -->
    
    <!-- 🧩 Page container -->
    <main class="flex-1 px-6 py-10">
      <router-view />
    </main>

    <!-- ⚓ Footer -->
    <footer class="bg-white shadow-inner py-4 text-center text-sm text-gray-500">
      © 2025 Mon Blog Vue. Tous droits réservés.
    </footer>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue' 
import Header from './components/Header.vue'
import AdminHeader from './components/AdminHeader.vue'
import UserHeader from './components/UserHeader.vue'

const route = useRoute()
const userHeader = computed(() => {
  return route.path.startsWith('/user')
});

const adminHeader = computed(() => { return route.path.startsWith('/admin') })

const hideHeader = computed(() => {     // Header caché sur certaines routes
  return route.path.startsWith('/admin') || route.path.startsWith('/user')
})

import { ref, onMounted } from 'vue'

const userRole = ref(null)

// import { useUserStore } from '@/stores/user'
// const userStore = useUserStore()
// onMounted(() => {
//   userStore.initFromLocalStorage()
// })

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user?.role) {
    console.log(user.role);
    userRole.value = user.role
  }
})
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
