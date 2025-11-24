<template>
  <section class="flex justify-center items-center h-screen bg-linear-to-br from-blue-50 to-blue-100">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">

       <!-- Fenêtre de connexion -->
      <LoginModal v-if="showModal" :show="showModal" @close="showModal = false" />

      <h2 class="text-3xl font-bold text-center text-blue-600 mb-6">Mot de passe oublié</h2>

      <p class="text-gray-600 text-center mb-6">
        Entrez votre adresse e-mail pour recevoir un code de réinitialisation.
      </p>

      <form @submit.prevent="sendResetCode" class="space-y-5">
        <div>
          <label class="block text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Envoyer le code
        </button>
      </form>

      <p v-if="message" class="text-green-600 text-center mt-4">{{ message }}</p>
      <p v-if="error" class="text-red-600 text-center mt-4">{{ error }}</p>

      <p class="cursor-pointer text-center text-md mt-6 text-blue-600 hover:text-blue-800 font-medium transition"
          @click="handleAction()"
      >
      Retour à la connexion
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import LoginModal from "../components/LoginModal.vue";
import api from '../libs/axios';


const email = ref('')
const message = ref('')
const error = ref('')
const router = useRouter()
const showModal = ref(false);


async function sendResetCode() {
  message.value = ''
  error.value = ''
  try {
    // const response = await axios.post('http://localhost:8000/api/forgot-password', {
    //   email: email.value
    // })

    const response = api.post('forgot-password', {
      email: email.value
    })

    message.value = response.data.message || 'Un code de réinitialisation vous a été envoyé.'
    // Rediriger vers la page de reset après 2s
    setTimeout(() => router.push('/reset-password'), 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erreur : impossible d’envoyer le code.'
  }
}

// Redirection selon authentification
const handleAction = () => {
  showModal.value = true; // ouvre la modale LoginModal
};
</script>
