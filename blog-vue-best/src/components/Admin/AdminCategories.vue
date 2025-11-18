<template>
  <div>
    <div class="flex flex-col items-center justify-between mb-6">
      <h3 class="text-lg font-semibold">Ajouter une catégorie</h3>

      <!-- Formulaire rapide d'ajout -->
      <div class="w-full max-w-sm">
          <!-- <h3 class="text-lg font-semibold mb-6">Ajouter une catégorie</h3> -->
          
          <form @submit.prevent="createCategory" class="flex  gap-2">
          <input
            v-model="form.nom"
            type="text"
            placeholder="Nom"
            class="flex-1 border rounded px-3 py-2"
            :disabled="loading"
          />
          <input
            v-model="form.description"
            type="text"
            placeholder="Description"
            class=" border rounded px-3 py-2"
            :disabled="loading"
          />
          <button
            type="submit"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            :disabled="loading"
          >
           {{ loading ? 'En cours...' : 'Ajouter' }}
          </button>
        </form>
        <p v-if="errors.nom" class="text-red-500 text-sm mt-1">{{ errors.nom }}</p>
      </div>
    </div>

    <!-- Feedback -->
    <div v-if="message" :class="messageClass" class="p-3 rounded mb-4">
      {{ message }}
    </div>

    <!-- Liste -->
      <h3 class="text-lg font-semibold">Catégories</h3>

    <div class="grid gap-3">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="bg-white p-4 rounded shadow flex justify-between items-start"
      >
        <div>
            <!-- {{ cat.description }} -->
          <div class="font-semibold text-gray-800"> <span> {{ cat.id }}</span> - {{ cat.nom }}</div>
          <div class="text-gray-500 text-sm mt-1">{{ truncate(cat.description, 120) }}</div>
          <div class="text-xs text-gray-400 mt-2">Créée : {{ cat.created_at_formatted || cat.created_at }}</div>
        </div>

        <div class="flex flex-col gap-2 ml-4">
          <button @click="openEdit(cat)" class="text-blue-600 hover:underline text-sm">Éditer</button>
          <button @click="confirmDelete(cat)" class="text-red-600 hover:underline text-sm">Supprimer</button>
        </div>
      </div>
    </div>

    <!-- Pagination simple (si l'API supporte) -->
    <div v-if="meta && meta.total > meta.per_page" class="mt-4 flex justify-center gap-2">
      <button :disabled="!meta.prev_page_url" @click="fetchCategories(meta.prev_page_url)" class="px-3 py-1 border rounded">Préc</button>
      <button :disabled="!meta.next_page_url" @click="fetchCategories(meta.next_page_url)" class="px-3 py-1 border rounded">Suiv</button>
    </div>

    <!-- Modal édition -->
    <div v-if="editing" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h4 class="text-lg font-semibold mb-3">Modifier la catégorie</h4>
        <label class="block text-sm text-gray-600">Nom</label>
        <input v-model="editing.nom" class="w-full border rounded px-3 py-2 mb-3" />
        <label class="block text-sm text-gray-600">Description</label>
        <textarea v-model="editing.description" class="w-full border rounded px-3 py-2 mb-3"></textarea>

        <div class="flex justify-end gap-2">
          <button @click="closeEdit" class="px-4 py-2 border rounded">Annuler</button>
          <button @click="updateCategory" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Sauvegarder</button>
        </div>

        <p v-if="errors.general" class="text-red-500 text-sm mt-3">{{ errors.general }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { API_URL } from '../../utils/contants'

const categories = ref([])
const meta = ref(null) // pour pagination si existante
const form = ref({ nom: '', description: '' })
const errors = ref({})
const message = ref('')
const messageClass = ref('bg-green-50 text-green-700')
const editing = ref(null)


// Récupère token depuis localStorage
const token = localStorage.getItem('authToken') || ''

// utilitaire
const truncate = (text, len = 100) => {
  const s = (text === null || text === undefined) ? '' : String(text)
  return s.length > len ? s.slice(0, len) + '...' : s
}

// Fetch catégories (url optionnelle pour pagination)
async function fetchCategories(url = `${API_URL}/categories`) {
  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // si API renvoie pagination (data + meta) ou tableau direct
    if (res.data && Array.isArray(res.data.data)) {
      categories.value = res.data.data
      meta.value = {
        total: res.data.total,
        per_page: res.data.per_page,
        next_page_url: res.data.next_page_url,
        prev_page_url: res.data.prev_page_url
      }
    } else if (Array.isArray(res.data)) {
      categories.value = res.data
      meta.value = null
    } else {
      categories.value = res.data.data || []
    }
  } catch (err) {
    console.error('fetchCategories', err)
    message.value = 'Erreur chargement catégories.'
    messageClass.value = 'bg-red-50 text-red-700'
  }
}

// Création
async function createCategory() {
  errors.value = {}
  message.value = ''
  if (!form.value.nom.trim()) {
    errors.value.nom = 'Le nom est requis.'
    return
  }

  try {
    const res = await axios.post(`${API_URL}/admin/categories`, {
      nom: form.value.nom,
      description: form.value.description
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    // push en tête
    categories.value.unshift(res.data)
    form.value.nom = ''
    form.value.description = ''
    message.value = 'Catégorie créée avec succès.'
    messageClass.value = 'bg-green-50 text-green-700'
  } catch (err) {
    console.error('createCategory', err)
    if (err.response?.status === 422) {
      // validation errors
      const v = err.response.data.errors || err.response.data
      errors.value = Object.keys(v).reduce((acc, k) => {
        acc[k] = v[k][0] || v[k]
        return acc
      }, {})
    } else {
      message.value = 'Impossible de créer la catégorie.'
      messageClass.value = 'bg-red-50 text-red-700'
    }
  }
}

// Édition
function openEdit(cat) {
  editing.value = { ...cat } // clone
}

function closeEdit() {
  editing.value = null
  errors.value = {}
  message.value = ''
}

// Update
async function updateCategory() {
  if (!editing.value.nom?.trim()) {
    errors.value.general = 'Le nom est requis.'
    return
  }

  try {
    const res = await axios.put(`${API_URL}/admin/categories/${editing.value.id}`, {
      nom: editing.value.nom,
      description: editing.value.description
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    // mettre à jour localement
    const idx = categories.value.findIndex(c => c.id === editing.value.id)
    if (idx !== -1) categories.value[idx] = res.data

    message.value = 'Catégorie mise à jour.'
    messageClass.value = 'bg-green-50 text-green-700'
    editing.value = null
  } catch (err) {
    console.error('updateCategory', err)
    if (err.response?.status === 422) {
      const v = err.response.data.errors || err.response.data
      errors.value = Object.keys(v).reduce((acc, k) => {
        acc[k] = v[k][0] || v[k]
        return acc
      }, {})
    } else {
      errors.value.general = 'Erreur lors de la mise à jour.'
    }
  }
}

// Suppression
function confirmDelete(cat) {
  if (!confirm(`Supprimer la catégorie "${cat.nom}" ?`)) return
  deleteCategory(cat.id)
}

async function deleteCategory(id) {
  try {
    await axios.delete(`${API_URL}/admin/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    categories.value = categories.value.filter(c => c.id !== id)
    message.value = 'Catégorie supprimée.'
    messageClass.value = 'bg-green-50 text-green-700'
  } catch (err) {
    console.error('deleteCategory', err)
    message.value = 'Impossible de supprimer la catégorie.'
    messageClass.value = 'bg-red-50 text-red-700'
  }
}

// initial load
fetchCategories()
</script>

<style scoped>
/* styles mineurs pour modal */
</style>
