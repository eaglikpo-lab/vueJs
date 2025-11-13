<template>
  <section class="bg-gray-50 min-h-screen py-12 px-6"> <!-- ✅ Bouton de retour -->
    <div v-if="$route.path.includes('/preview')" class="mb-6">
      <button
        @click="$router.push('/admin')"
        class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
      >
        ⬅ Retour au Dashboard Admin
      </button>
    </div>


    <!-- Header avec profil -->
    <!-- <UserHeader /> -->
    <div class="flex justify-between items-center mb-10 max-w-6xl mx-auto">
      <div>
        <h2 class="text-4xl font-bold text-blue-600 mb-1">Bienvenue sur votre Dashboard</h2>
        <p class="text-gray-600 text-lg">Derniers articles classés par catégories ✨</p>
      </div>
      <!-- Profil -->
      <!-- <div class="flex items-center space-x-3">
        <div
          v-if="userAvatar"
          class="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500"
        >
          <img :src="userAvatar" alt="Profil" class="w-full h-full object-cover" />
        </div>
        <div
          v-else
          class="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg"
        >
          {{ userInitials }}
        </div>
      </div> -->
    </div>

    <!-- Catégories -->
    <div class="flex flex-wrap justify-center gap-3 mb-10 max-w-6xl mx-auto">
      <button
        class="px-4 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
        @click="filterByCategory('Tous')">
        Tous
      </button>
      <button v-for="cat in categories" :key="cat.id"
        class="px-4 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
        @click="filterByCategory(cat.nom)">
        {{ cat.nom }}
      </button>
    </div>

    <!-- Articles -->
    <div v-if="filteredArticles.length" class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <article v-for="article in filteredArticles" :key="article.id"
        class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col">

        <img :src="article.image" alt="Image de l'article" class="w-full h-55 object-cover rounded-lg mb-4" />

        <h3 class="text-xl font-semibold text-gray-800 mb-2 h-8 overflow-hidden">
          {{ article.title }}
        </h3>

        <p class="text-gray-500 text-sm mb-3">
          Catégorie :
          <span class="font-medium text-blue-500">{{ article.categorie }}</span>
        </p>

        <p class="text-gray-700 mb-4 grow">
          {{ truncate(article.description, 120) }}
        </p>

        <router-link :to="`/articles/${article.id}`"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition text-center">
          Lire plus →
        </router-link>
      </article>
    </div>

    <p v-else class="text-center text-gray-600">
      Aucun article disponible
    </p>


  </section>
</template>



<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRoute } from 'vue-router'
import UserHeader from "../components/UserHeader.vue";

const route = useRoute();

const previewMode = ref(false);
const categories = ref([]);
const articles = ref([]);
const filteredArticles = ref([]);
const loading = ref(false);

console.log("User credentials in localStorage");


// Récupérer la chaîne JSON depuis localStorage
const storedUser = localStorage.getItem("user")   // toutes les infos sur le user connecté
// console.log(storedUser)

const user = ref(storedUser ? JSON.parse(storedUser) : null)
console.log(user);

const userEmail = ref(user.value ? user.value.email : null) // Accéder à l'email
const userId = ref(user.value ? user.value.id : null) // Accéder à l'email
const userInitials = ref(userEmail.value[0].toUpperCase());


console.log(userEmail.value);
console.log(userId.value);


// Charger les catégories
const fetchCategories = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/categories");
    categories.value = res.data;
  } catch (err) {
    console.error('fetchCategories error', err);
    categories.value = [];
  }
};

// Charger les articles
const fetchArticles = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/articles");
    if (Array.isArray(res.data.data)) {
      articles.value = res.data.data;
      filteredArticles.value = res.data.data;
    }
  } catch {
    console.error('fetchArticles error', err);
    articles.value = [];
    filteredArticles.value = [];
  }
};

// Filtrer par catégorie
const filterByCategory = (categoryName) => {
  if (categoryName === "Tous") {
    filteredArticles.value = articles.value;
  } else {
    filteredArticles.value = articles.value.filter(
      (a) => a.categorie === categoryName
    );
  }
};

// Tronquer le texte
const truncate = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

// --- Mode aperçu (afficher un seul article si /preview/article/:id) ---
onMounted(async () => {
  loading.value = true;
  await fetchCategories();
  await fetchArticles();

  const articleId = route.params.id;
  console.log("after route.params.id", articleId);

  if (articleId) {
    previewMode.value = true;
    filteredArticles.value = articles.value.filter(
      (a) => a.id === Number(articleId[1])
      //         console.log(a.id)
      // console.log(Number(articleId[1]));
    );
    console.log('✅ filteredArticles:', filteredArticles.value)
  }
    loading.value = false;

})
</script>
