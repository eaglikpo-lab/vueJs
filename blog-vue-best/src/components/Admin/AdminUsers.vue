<template>
    <section class="p-6 bg-gray-50 min-h-screen">
        <h2 class="text-3xl font-bold text-blue-600 mb-8">Gestion des utilisateurs 👥</h2>

        <!-- Message de succès -->
        <p v-if="successMessage" class="mb-4 text-green-600 font-semibold">
            {{ successMessage }}
        </p>

        <!-- ⚠️ Message d’erreur -->
        <div v-if="errorMessage" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"> <strong class="font-bold">Erreur :</strong>
            <span class="block sm:inline">{{ errorMessage }}</span>
            <button class="absolute top-0 bottom-0 right-0 px-4 py-3" @click="errorMessage = ''">
                ✖
            </button>
        </div>

        <!-- Liste des utilisateurs -->
        <div v-if="users.length" class="overflow-x-auto">
            <table class="min-w-full bg-white rounded-xl shadow-lg">
                <thead class="bg-blue-600 text-white">
                    <tr>
                        <th class="py-3 px-4 text-left">Id</th>
                        <th class="py-3 px-4 text-left">Nom</th>
                        <th class="py-3 px-4 text-left">Email</th>
                        <th class="py-3 px-4 text-left">Rôle</th>
                        <th class="py-3 px-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users" :key="user.id" class="border-b hover:bg-gray-100 transition">
                        <td class="py-3 px-4">{{ index + 1 }}</td>
                        <td class="py-3 px-4 font-medium">{{ user.name }}</td>
                        <td class="py-3 px-4 text-gray-600">{{ user.email }}</td>
                        <td class="py-3 px-4">
                            <span :class="[
                                'px-2 py-1 rounded-full text-sm font-semibold',
                                user.role === 'admin'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-200 text-gray-700'
                            ]">
                                {{ user.role }}
                            </span>
                        </td>

                        <td class="py-3 px-4 text-center space-x-2">
                            <!-- Modifier le rôle -->
                            <button @click="toggleRole(user)"
                                class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg transition">
                                {{ user.role === 'admin' ? 'Rétrograder' : 'Promouvoir' }}
                            </button>

                            <!-- Supprimer -->
                            <button @click="deleteUser(user.id)"
                                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition">
                                Supprimer
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-else class="text-gray-600 italic text-center mt-10">
            Aucun utilisateur trouvé.
        </p>
    </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { API_URL } from "../../utils/contants";

// --- Variables
const users = ref([]);
const successMessage = ref("");
const errorMessage = ref("");

// Récupération du token
const storedUser = localStorage.getItem("user");
console.log(storedUser);

const user = storedUser ? JSON.parse(storedUser) : null;
const token = localStorage.getItem("authToken");

// --- Charger la liste des utilisateurs
const fetchUsers = async () => {
    console.log(token);

    try {
        const res = await axios.get(`${API_URL}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        users.value = res.data;
    } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
    }
};

// --- Supprimer un utilisateur
const deleteUser = async (userId) => {
    if (!confirm("Voulez-vous vraiment supprimer l'utilisateur " + userId + "?")) return;
    try {
        await axios.delete(`${API_URL}/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        users.value = users.value.filter((u) => u.id !== userId);
        successMessage.value = "Utilisateur supprimé avec succès ✅";
    } catch (error) {
        // console.error("Erreur lors de la suppression :", error);
        handleError(error, "Erreur lors de la suppression.");
    }
};

// --- Changer le rôle (promouvoir/rétrograder)
const toggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
        const res = await axios.put(
            `${API_URL}/admin/users/${user.id}/role`,
            { role: newRole },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        user.role = newRole; // mise à jour locale immédiate
        successMessage.value = res.data.message;
    } catch (error) {
        // console.error("Erreur lors du changement de rôle :", error);
        handleError(error, "Erreur lors de la suppression.");
    }
};


// --- Gestion des erreurs (dont 403)
function handleError(error, defaultMessage) {
  if (error.response) {
    const status = error.response.status;
    if (status === 403) {
      errorMessage.value = "⛔ Accès refusé : vous n’avez pas les permissions nécessaires.";
    } else if (status === 401) {
      errorMessage.value = "🔒 Votre session a expiré. Veuillez vous reconnecter.";
    } else {
      errorMessage.value = error.response.data.message || defaultMessage;
    }
  } else {
    errorMessage.value = "Erreur réseau ou serveur injoignable.";
  }
  successMessage.value = ""; // on efface les messages de succès
}

// --- Chargement initial
onMounted(fetchUsers);
</script>
