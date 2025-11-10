<template>
  <section class="bg-gray-50 min-h-screen py-12 px-6">
    <!-- En-tête -->
    <div class="text-center mb-10">
      <h2 class="text-4xl font-bold text-blue-600 mb-4">
        Bienvenue sur notre Blog
      </h2>
      <p class="text-gray-600 text-lg">
        Découvrez les derniers articles classés par catégories ✨
      </p>
    </div>

    <!-- Fenêtre de connexion -->
    <LoginModal v-if="showModal" :show="showModal" @close="showModal = false" />

    <!-- Catégories -->
    <div class="flex flex-wrap justify-center gap-3 mb-10">
      <button
        class="px-4 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
        @click="filterByCategory('Tous')"
      >
        Tous
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        class="px-4 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
        @click="filterByCategory(cat.nom)"
      >
        {{ cat.nom }}
      </button>
    </div>

    <!-- Articles -->
    <div
      v-if="filteredArticles.length"
      class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
    >
      <article
        v-for="article in filteredArticles"
        :key="article.id"
        class="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col"
      >
        <img
          :src="article.image"
          alt="Image de l'article"
          class="w-full h-55 object-cover rounded-lg mb-4"
        />
        <h3 class="text-xl font-semibold text-gray-800 mb-2 h-8 overflow-hidden">
          {{ article.title }}   
        </h3>
        <p class="text-gray-500 text-sm mb-3">
          Catégorie :
          <span class="font-medium text-blue-500">
            {{ article.categorie }}
          </span>
        </p>
        <p class="text-gray-700 mb-4 grow">
          {{ truncate(article.description, 100) }}
        </p>
        <button
          @click="handleAction(article.id)"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Lire plus →
        </button>
      </article>
    </div>

    <p v-else class="text-center text-gray-600">
      Aucun article disponible
    </p>

  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import LoginModal from "../components/LoginModal.vue";


const router = useRouter();

const categories = ref([]);
const articles = ref([]);
const filteredArticles = ref([]);
const isAuthenticated = ref(false);
const showModal = ref(false);

// Charger les catégories
const fetchCategories = async () => {
  const res = await fetch("http://localhost:8000/api/categories");
  categories.value = await res.json();
};

// Charger les articles
const fetchArticles = async () => {
  const res = await fetch("http://localhost:8000/api/articles");
  const data = await res.json();

  if (Array.isArray(data.data)) {
    articles.value = data.data;
    filteredArticles.value = data.data;
  } else {
    console.warn("Format inattendu pour les articles :", data);
    articles.value = [];
  }
};

// Filtrer par catégorie
const filterByCategory = (categoryName) => {
  if (categoryName === "Tous") {
    filteredArticles.value = articles.value;
    console.log(filteredArticles);
  } else {
    console.log(categoryName);
    
    filteredArticles.value = articles.value.filter(
      (a) => a.categorie === categoryName
    );
    console.log(filteredArticles);
  }
};

// Redirection selon authentification
const handleAction = (articleId) => {
  if (!isAuthenticated.value) {
    // router.push("/login");
    showModal.value = true; // ouvre la modale LoginModal
  } else {
    router.push(`/articles/${articleId}`);
  }
};

// Tronquer le texte
const truncate = (text, length) => {
  if (!text) return "";
  return text.length > length ? text.substring(0, length) + "..." : text;
};

// Chargement initial
onMounted(() => {
  fetchCategories();
  fetchArticles();

   // Laisse l’utilisateur explorer pendant 60 secondes
  setTimeout(() => {
    showModal.value = true;
  }, 15000); // 30 000 ms = 0.5 minute
});

</script>
