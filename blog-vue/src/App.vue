<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50 text-gray-800">
    <!-- 🧭 Header -->
    <header class="bg-white shadow-md sticky top-0 z-10">
      <div class="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold italic text-blue-600">Mon Blog Vue</h1>

        <nav class="space-x-6 text-gray-600 font-medium">
          <router-link to="/" class="hover:text-blue-600 transition">Accueil</router-link>
          <router-link to="/about" class="hover:text-blue-600 transition">À propos</router-link>
          <router-link to="/help" class="hover:text-blue-600 transition">Aide</router-link>
          <router-link to="/login" class="text-blue-600 hover:underline">Connexion</router-link>
        </nav>
      </div>
    </header> 

    <!-- <Header @show-login="showLoginModal = true" /-->

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

<!-- <script setup>
  import Header from "./components/Header.vue";
</script> -->

<!-- <template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template> -->

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
