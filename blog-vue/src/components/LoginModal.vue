<!-- components/LoginModal.vue -->
<template>
  <div v-if="show" class="overlay">
    <div class="modal">
      <!-- Croix de fermeture -->
      <button
        @click="emit('close')"
        class="absolute top-[23%] right-[37%] text-gray-500 hover:text-gray-700 text-lg font-bold"
      >
        &times;
      </button>

      <h2 class="text-xl text-center font-bold text-blue-600 mb-4">Connexion requise</h2>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <input
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Se connecter
        </button>

        <!-- Mot de passe oublié : rapproché -->
        <div class="text-center mt-1">
          <router-link
            to="/forgot"
            class="text-blue-600 text-sm hover:underline"
            @click="emit('close')"
          >
            Mot de passe oublié ?
          </router-link>
        </div>
      </form>

      <!-- Séparateur avec "ou" -->
      <div class="flex items-center my-6">
        <hr class="grow border-gray-300" />
        <span class="mx-3 text-gray-500 text-sm font-medium">ou</span>
        <hr class="grow border-gray-300" />
      </div>

      <!-- Bouton d'inscription -->
      <div class="text-center">
        <router-link
          to="/register"
          class="inline-block bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition font-semibold shadow-md"
          @click="emit('close')"
        >
          Inscrivez-vous
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(["close"]);

const router = useRouter();
const email = ref("");
const password = ref("");

async function login() {
  try {
    const response = await axios.post("http://localhost:8000/api/login", {
      email: email.value,
      password: password.value,
    });

    const { token, role } = response.data;
    localStorage.setItem("authToken", token);

    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/user");
    }

    emit("close");
  } catch (error) {
    // alert("Email ou mot de passe incorrect");
    if (error.response) {
      console.log('Erreur:', error.response.data)
    } else {
      console.error('Erreur inconnue:', error)
    }
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 25px 30px;
  width: 360px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
