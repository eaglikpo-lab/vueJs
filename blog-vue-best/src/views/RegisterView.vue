<template>
    <section class="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100">
        <div class="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-md border border-blue-100">
            <h2 class="text-3xl font-bold text-blue-700 mb-6 text-center">
                Créez votre compte
            </h2>

            <form @submit="handleRegister" class="space-y-5">
                <div>
                    <label for="name" class="block text-gray-700 font-medium mb-1">Nom</label>
                    <input v-model="name" type="text" id="name"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        required />
                </div>

                <div>
                    <label for="email" class="block text-gray-700 font-medium mb-1">Email</label>
                    <input v-model="email" type="email" id="email"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        required />
                </div>

                <div>
                    <label for="password" class="block text-gray-700 font-medium mb-1">Mot de passe</label>
                    <input v-model="password" type="password" id="password"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        required />
                </div>

                <div>
                    <label for="password_confirmation" class="block text-gray-700 font-medium mb-1">Confirmation du mot
                        de passe</label>
                    <input v-model="password_confirmation" type="password" id="password_confirmation"
                        class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                        required />
                </div>

                <button type="submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition cursor-pointer">
                    S'inscrire
                </button>
            </form>

            <p class="text-center text-gray-700 text-md mt-6">
                Déjà un compte ?
                <router-link to="/login" class="text-blue-600 hover:text-blue-800 font-medium transition">
                    Connectez-vous
                </router-link>
            </p>

            <p v-if="message" class="mt-6 text-center text-sm font-medium"
                :class="message.includes('✅') ? 'text-green-600' : 'text-red-600'">
                {{ message }}
            </p>
        </div>
    </section>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { ref } from "vue";
import { API_URL } from '../utils/contants';

const router = useRouter()

const name = ref("");
const email = ref("");
const password = ref("");
const password_confirmation = ref("");
const message = ref("");

const handleRegister = async (e) => {
    e.preventDefault();
    message.value = "";

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value,
                password_confirmation: password_confirmation.value,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            message.value =
                "✅ Inscription réussie ! Vous pouvez maintenant vous connecter.";
            name.value = "";
            email.value = "";
            password.value = "";
            password_confirmation.value = "";
            // Rediriger vers la page de reset après 2s
            setTimeout(() => router.push('/login'), 2000)
        } else {
            message.value = data.message || "❌ Une erreur est survenue.";
        }
    } catch (error) {
        message.value = "Erreur réseau. Vérifiez la connexion au serveur Laravel.";
    }
};
</script>
