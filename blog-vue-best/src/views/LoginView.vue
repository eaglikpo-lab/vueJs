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
import { useUserStore } from '../store/user';
import { AuthService } from '../services/auth';

const userStore = useUserStore()
const router = useRouter()      // Pour la navigation après login

const authService = new AuthService();

// Champs du formulaire
const email = ref('')
const password = ref('')
const error = ref(null)

async function login() {
    try {
        await authService.login(email.value, password.value)
      // await userStore.login(email.value, password.value)

      userStore.setUserAndToken(authService.user, authService.token);

      // Redirection selon le rôle
      if (authService.user.role === "admin") {
        router.push("/admin");
      } else if (authService.user.role === "user") {
        router.push("/user");
      } else {
        router.push("/");
      }
    } catch (err) {
        error.value = err.response?.data.message || 'Erreur inconnue'
    }

}

</script>
