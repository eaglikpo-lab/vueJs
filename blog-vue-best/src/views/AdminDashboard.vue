<template>
  <div class="flex h-screen bg-gray-100">
    <!-- ✅ SIDEBAR -->
    <aside class="w-64 bg-blue-700 text-white flex flex-col">
      <div class="p-4 text-2xl font-bold text-center border-b border-blue-500">
        Admin Dashboard
      </div>
      <nav class="flex-1 p-4 space-y-3">
        <button v-for="item in menuItems" :key="item.key" @click="activeSection = item.key" :class="[
          'w-full text-left py-2 px-3 rounded-md transition',
          activeSection === item.key ? 'bg-blue-500' : 'hover:bg-blue-600'
        ]">
          {{ item.label }}
        </button>
      </nav>
      <button @click="logout" class="m-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white cursor-pointer">
        Déconnexion
      </button>
    </aside>

    <!-- ✅ MAIN CONTENT -->
    <main class="flex-1 p-6 overflow-y-auto">
      <header class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-700">
          {{ currentTitle }}
        </h1>
        <div class="flex items-center gap-3">
          <div class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {{ user.name }}
          </div>
          <div class="text-gray-500">{{ user.email }}</div>
        </div>
      </header>

      <!-- ✅ Sections dynamiques -->
      <section v-if="activeSection === 'dashboard'">
        <h2 class="text-xl font-semibold mb-4">Vue d’ensemble</h2>
        <p>Statistiques globales, dernières activités, etc.</p>
      </section>

      <section v-else-if="activeSection === 'categories'">
        <h2 class="text-xl font-semibold mb-4">Gérer les catégories</h2>
        <p>Liste, ajout, modification et suppression des catégories ici.</p>
        <AdminCategories />
      </section>

      <section v-else-if="activeSection === 'articles'">
        <h2 class="text-xl font-semibold mb-4">Gérer les articles</h2>
        <p>Créer, éditer, supprimer et approuver les articles ici.</p>
        <AdminArticles />
      </section>

      <section v-else-if="activeSection === 'users'">
        <h2 class="text-xl font-semibold mb-4">Gérer les utilisateurs</h2>
        <p>Liste des utilisateurs, rôles et permissions.</p>
        <AdminUsers />
      </section>

      <section v-else-if="activeSection === 'comments'">
        <h2 class="text-xl font-semibold mb-4">Gérer les commentaires</h2>
        <AdminComments />
      </section>

      <section v-else-if="activeSection === 'stats'">
        <h2 class="text-xl font-semibold mb-4">Voir les statistiques</h2>
        <p>Graphiques et données d’analyse à venir.</p>
      </section>
    </main>
  </div>
</template>



<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
const userStore = useUserStore()

import AdminCategories from '../components/Admin/AdminCategories.vue'
import AdminArticles from '../components/Admin/AdminArticles.vue'
import AdminUsers from '../components/Admin/AdminUsers.vue'
import AdminComments from '../components/Admin/AdminComments.vue'

const route = useRouter()

// 🔐 Récupération des infos admin depuis le localStorage
const userState = userStore.$state
const user = userState.user

// 🔹 Sections du tableau de bord
const menuItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'categories', label: 'Gérer les catégories' },
  { key: 'articles', label: 'Gérer les articles' },
  { key: 'users', label: 'Gérer les utilisateurs' },
  { key: 'comments', label: 'Gérer les commentaires' },
  { key: 'stats', label: 'Voir les statistiques' },
]

const activeSection = ref('dashboard')

const currentTitle = computed(() => {
  const current = menuItems.find(i => i.key === activeSection.value)
  return current ? current.label : ''
});


// 🚪 Déconnexion
function logout() {
 userStore.logout()
}
</script>

<style scoped>
main header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  padding-bottom: 1rem;
}
</style>
