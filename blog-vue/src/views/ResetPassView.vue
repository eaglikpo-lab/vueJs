<!-- <template>
  <section>
    <h2>Espace Utilisateur</h2>
    <p>Bienvenue sur ton espace personnel !</p>
  </section>
</template> -->


<template>
  <section class="flex justify-center items-center h-screen bg-linear-to-br from-blue-50 to-blue-100">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-blue-600 mb-6">
        Réinitialiser le mot de passe
      </h2>

      <p class="text-gray-600 text-center mb-6">
        Entrez vos informations pour la réinitialisation
      </p>
      <form @submit.prevent="resetPassword" class="space-y-5">
        <div>
          <label class="block text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Code de vérification</label>
          <input
            v-model="code"
            type="text"
            required
            placeholder="Code reçu par email"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Nouveau mot de passe</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Confirmation</label>
          <input
            v-model="password_confirmation"
            type="password"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Réinitialiser le mot de passe
        </button>
      </form>

      <!-- Fenêtre de connexion -->
      <LoginModal v-if="showModal" :show="showModal" @close="showModal = false" />


      <p v-if="message" class="text-green-600 text-center mt-4">{{ message }}</p>
      <p v-if="error" class="text-red-600 text-center mt-4">{{ error }}</p>

      <p class="text-center text-md mt-6 text-blue-600 hover:text-blue-800 font-medium transition cursor-pointer"
          @click="handleAction()"
      >
        Retour à la connexion
        <!-- <router-link to="/login" class="text-blue-600 hover:text-blue-800 font-medium transition cursor-pointer">
        </router-link> -->
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import LoginModal from "../components/LoginModal.vue";


const email = ref('')
const code = ref('')
const password = ref('')
const password_confirmation = ref('')
const message = ref('')
const error = ref('')
const router = useRouter()
const showModal = ref(false);


const handleAction = () => {
  showModal.value = true; // ouvre la modale LoginModal
}

async function resetPassword() {
  message.value = ''
  error.value = ''
  try {
    const response = await axios.post('http://localhost:8000/api/reset-password', {
      email: email.value,
      code: code.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    })

    message.value = response.data.message || 'Mot de passe réinitialisé avec succès !'

    // Redirection vers la page de login après 2 secondes
    setTimeout(() => router.push('/login'), 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur : vérifiez vos informations.'
  }
}
</script>
