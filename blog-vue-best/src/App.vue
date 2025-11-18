<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
     <!-- <div>
      {{ userRole }}
     </div> -->
    <Header v-if="!userRole" />
    <UserHeader v-else-if="userRole === 'user'" /> 
    <AdminHeader v-else-if="userRole === 'admin'" />
    
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
import Header from './components/Header.vue'
import AdminHeader from './components/AdminHeader.vue'
import UserHeader from './components/UserHeader.vue'

import { storeToRefs } from 'pinia'
import { useUserStore } from './store/user'


const route = useRoute()


import { ref, onMounted } from 'vue'

const userStore = useUserStore()
const { userRole } = storeToRefs(userStore) // userRole est désormais une Ref réactive
console.log(userStore);


onMounted(() => {
  userStore.initFromLocalStorage();
  console.log(userRole.value);
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
