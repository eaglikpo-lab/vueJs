<template>
  <section class="min-h-screen bg-blue-100 flex flex-col justify-center px-12 py-16 relative overflow-hidden">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      <!-- Bloc À propos -->
       <div>

      <div class="space-y-8  px-3 py-3">
        <h1 class="text-4xl font-bold text-gray-800">À propos</h1>
        <p class="text-gray-600 leading-relaxed ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil officia sunt nesciunt eveniet illum magnam dolore suscipit exercitationem inventore et placeat, reiciendis quos amet. Porro vitae voluptatum officiis. Quo, debitis.
        </p>

        <!-- Bouton contactez-nous -->
        <button
          @click="toggleForm"
          class="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 shadow text-white px-5 py-2 rounded-lg transition cursor-pointer"
        >
          <span>📞  Contactez-nous</span>
        </button>
       </div>
      </div>

      <!-- Formulaire latéral -->
      <transition name="slide-fade">
        <div
          v-if="showForm"
          class="bg-white shadow-lg rounded-2xl p-6 relative max-w-md w-full border border-gray-200"
        >
          <!-- Bouton fermer -->
          <button
            @click="toggleForm"
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Contactez-nous
          </h2>

          <form class="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Votre nom"
              class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Votre email"
              class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <textarea
              rows="4"
              placeholder="Votre message..."
              class="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            ></textarea>
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 transition font-medium"
            >
              Envoyer
            </button>
          </form>
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const showForm = ref(false);

function toggleForm() {
  showForm.value = !showForm.value;
}
</script>

<style scoped>
/* Animation d'apparition fluide */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
