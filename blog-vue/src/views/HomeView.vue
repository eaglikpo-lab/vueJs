<template>
  <section
    class="relative min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100"
  >
    <!-- Conteneur principal -->
    <div
      class="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-10 text-center max-w-lg border border-blue-100"
    >
      <h2 class="text-4xl font-extrabold text-blue-600 mb-4">
        Bienvenue sur <span class="text-blue-500">Mon Blog</span>
      </h2>

      <!-- <p class="text-gray-700 text-lg mb-4">
        Découvrez, partagez et échangez autour des derniers articles publiés.
      </p> -->

      <p class="text-gray-600 text-md mb-8">
        Inscrivez-vous dès aujourd’hui pour rejoindre notre communauté.
      </p>

      <router-link
        to="/register"
        class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-300 shadow-md"
      >
        S'inscrire
      </router-link>

      <p class="text-gray-700 text-md mt-6">
        Déjà un compte ?
        <router-link
          to="/login"
          class="text-blue-600 hover:text-blue-800 font-medium transition"
        >
          Connectez-vous
        </router-link>
      </p>
    </div>
  </section>
</template>
