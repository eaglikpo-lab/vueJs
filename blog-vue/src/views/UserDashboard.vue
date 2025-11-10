<!-- <template>
  <section>
    <h2>Espace Utilisateur</h2>
    <p>Bienvenue sur ton espace personnel !</p>
  </section>
</template> -->


<template>
  <section class="bg-gray-50 min-h-screen py-12 px-6">
    <!-- Header avec profil -->
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
          <span class="font-medium text-blue-500">{{ article.categorie }}</span>
        </p>
        <p class="text-gray-700 mb-4 grow">
          {{ truncate(article.description, 120) }}
        </p>
        <router-link
          :to="`/articles/${article.id}`"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition text-center"
        >
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

const categories = ref([]);
const articles = ref([]);
const filteredArticles = ref([]);

// Exemple : récupérer les infos utilisateur depuis localStorage ou API
const userEmail = ref(localStorage.getItem("userEmail") || "user@example.com");
const userAvatar = ref(""); // si tu as une image
const userInitials = ref(userEmail.value[0].toUpperCase());

// Charger les catégories
const fetchCategories = async () => {
  const res = await axios.get("http://localhost:8000/api/categories");
  categories.value = res.data;
};

// Charger les articles
const fetchArticles = async () => {
  const res = await axios.get("http://localhost:8000/api/articles");
  if (Array.isArray(res.data.data)) {
    articles.value = res.data.data;
    filteredArticles.value = res.data.data;
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

// Chargement initial
onMounted(() => {
  fetchCategories();
  fetchArticles();
  console.log(userEmail);
  console.log(userInitials);
});
</script>
