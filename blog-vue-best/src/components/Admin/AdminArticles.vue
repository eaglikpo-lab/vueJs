<template>
  <section class="space-y-6 mt-6 ml-10 mr-10">

<!-- Liste des catégories en grille -->
<div v-if="categories.length" class="bg-white p-4 rounded shadow-md">
  
  <div class="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-4 gap-3 items-center">
    <span class="text-lg text-center  px-3 py-2 bg-blue-100 font-semibold text-gray-800 ">Catégories existantes :</span>
    <div 
      v-for="categorie in categories" 
      :key="categorie.id"
      class="flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 rounded hover:bg-amber-200 transition"
    >
      <span class="font-bold text-amber-800">{{ categorie.id }}</span>
      <span class="text-gray-700">{{ categorie.nom }}</span>
    </div>
  </div>
</div>




    <h2 class="text-xl font-semibold  mt-6 mb-4">📰 Gérer les articles</h2>
    <!-- ✅ Formulaire d’ajout / modification -->
    <form @submit.prevent="handleSubmit" class="bg-white p-4 rounded shadow-md space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <input v-model="form.title" type="text" placeholder="Titre" class="border p-2 rounded w-full" required />
        <input v-model="form.keywords" type="text" placeholder="Mots-clés" class="border p-2 rounded w-full" />
      </div>

      <textarea v-model="form.description" placeholder="Description" class="border p-2 rounded w-full"></textarea>
      <input v-model="form.categorie_id" type="number" placeholder="ID Catégorie" class="border p-2 rounded w-full" />
      <input type="file" @change="handleFileChange" class="border p-2 rounded w-full" />

      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {{ isEditing ? 'Mettre à jour' : 'Ajouter' }} l’article
      </button>
    </form>

    <!-- ✅ Liste des articles -->
    <div v-if="articles.length" class="bg-white p-4 rounded shadow-md">
      <h3 class="text-lg font-semibold mb-4">Liste des articles</h3>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="p-2 border">ID</th>
            <th class="p-2 border">Titre</th>
            <th class="p-2 border w-[40%]">Description</th>
            <!-- <th class="p-2 border">Mots-clés</th> -->
            <!-- <th class="p-2 border">Image</th> -->
            <th class="p-2 border">Catégorie</th>
            <th class="p-2 border">Créé le</th>
            <th class="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="article in articles" :key="article.id">
            <!-- {{ article }} -->

            <td class="border p-2">{{ article.id }}</td>
            <td class="border p-2">{{ article.title }}</td>
            <td class="border p-2">{{ article.description }}</td>
            <!-- <td class="border p-2">{{ article.keywords }}</td> -->
            <!-- <td class="border p-2">{{ article.image }}</td> -->
            <td class="border p-2 items-center justify-center">{{ article.categorie }}</td>
            <td class="border p-2">{{ article.created_at_formatted }}</td>
            <td class="border p-2 text-center space-x-2 ">
              <div class="flex flex-col gap-4 items-center">

              <div class="flex gap-1">
                <button @click="editArticle(article)" class="bg-yellow-400 text-white  rounded">✏️</button>
                <button @click="deleteArticle(article.id)" class="bg-red-500 text-white  rounded">🗑️</button>
              </div>
                <button @click="previewArticle(article.id)"
                  class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  Aperçu
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else class="text-gray-500">Aucun article trouvé.</p>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { API_URL } from '../../utils/contants';

const router = useRouter();

const token = localStorage.getItem('authToken')
const articles = ref([])
const categories = ref([])
const isEditing = ref(false)
const currentId = ref(null)
const form = ref({
  title: '',
  description: '',
  keywords: '',
  categorie_id: '',
  image: null
})

const previewArticle = (id) => {
  router.push(`/preview/article/${id}`);
};

// ✅ Charger tous les articles
async function fetchArticles() {
  try {
    const res = await axios.get(`${API_URL}/articles`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    articles.value = res.data.data
  } catch (e) {
    console.error('Erreur de chargement des articles', e)
  }
}


// Fetch catégories (url optionnelle pour pagination)
async function fetchCategories(url = `${API_URL}/categories`) {
  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      categories.value = res.data.data || res.data
  } catch (err) {
    console.error('fetchCategories', err)
    message.value = 'Erreur chargement catégories.'
    messageClass.value = 'bg-red-50 text-red-700'
  }
}

// ✅ Ajouter / Modifier un article
async function handleSubmit() {
  try {
    const formData = new FormData()
    formData.append('titre', form.value.title)
    formData.append('contenu', form.value.description)
    formData.append('mots_cles', form.value.keywords)
    formData.append('categorie_id', form.value.categorie_id)
    if (form.value.image) formData.append('image', form.value.image)

    if (isEditing.value) {
      await axios.post(`${API_URL}/admin/articles/${currentId.value}?_method=PUT`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
    } else {
      console.log(token);

      await axios.post(`${API_URL}/admin/articles`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }

    await fetchArticles()
    resetForm()
  } catch (err) {
    console.error('Erreur ajout/modification article', err)
  }
}

// ✅ Supprimer un article
async function deleteArticle(id) {
  if (!confirm('Supprimer cet article ?')) return
  try {
    await axios.delete(`${API_URL}/articles/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchArticles()
  } catch (err) {
    console.error('Erreur suppression article', err)
  }
}

// ✅ Édition
function editArticle(article) {
  isEditing.value = true
  currentId.value = article.id
  form.value = {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    categorie_id: article.categorie_id,
    image: null
  }
}

// ✅ Gestion du fichier
function handleFileChange(e) {
  form.value.image = e.target.files[0]
}

// ✅ Reset
function resetForm() {
  form.value = { title: '', description: '', keywords: '', categorie_id: '', image: null }
  isEditing.value = false
  currentId.value = null
}

onMounted(() => {
  fetchArticles()
  fetchCategories()

})
</script>
