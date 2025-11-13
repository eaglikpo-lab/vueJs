<template>
  <section class="flex justify-center items-center h-screen bg-linear-to-br from-blue-50 to-blue-100">
    <div class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <h2 class="text-3xl font-bold text-center text-blue-600 mb-6">Connexion</h2>

      <form @submit.prevent="login" class="space-y-5">
        <div>
          <label class="block text-gray-700 mb-1">Email</label>
          <input v-model="email" type="email" required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Mot de passe

            <span class="text-right">
              <router-link to="/forgot" class="ml-37 text-blue-600 hover:underline text-sm transition">
                Mot de passe oublié?
              </router-link>
            </span>

          </label>
          <input v-model="password" type="password" required
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <button type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
          Se connecter
        </button>
      </form>

      <p class="text-gray-700 text-center text-md mt-6">
        Pas encore de compte ?
        <router-link to="/register" class="text-blue-600 hover:text-blue-800 font-medium transition cursor-pointer">
          Inscrivez-vous
        </router-link>
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Champs du formulaire
const email = ref('')
const password = ref('')

const router = useRouter()      // Pour la navigation après login

async function login() {        // Fonction login appelée lors du submit
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login', {
      email: email.value,
      password: password.value
    })

    // Laravel renvoie { token, role, message }
    const { token, user, message } = response.data
    console.log("token", token);
    console.log("user", user);
    console.log("message", message);

    //  Stocker tout dans le localStorage
    localStorage.setItem('authToken', token)
    localStorage.setItem('user', JSON.stringify(user)) // convertir en string JSON

    // ✅ Optionnel : si tu veux tout garder ensemble
    // localStorage.setItem('authData', JSON.stringify(response.data))

    // Message de succès
    console.log('Connexion réussie:', message)
    console.log('Utilisateur connecté:', user)

    const User = JSON.parse(localStorage.getItem('user'))

    // Redirection selon le rôle
    const role = User.role;
    if (role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/user')
    }
  } catch (error) {
    if (error.response) {
      console.log('Erreur:', error.response.data)
    } else {
      console.error('Erreur inconnue:', error)
    }

  }
}
</script>
