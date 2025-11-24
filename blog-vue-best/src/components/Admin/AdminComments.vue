<template>
  <div class="admin-comments">
    <h2>Gestion des commentaires</h2>
    
    <!-- Sélection d'un article -->
    <div class="article-select">
      <label for="id"
        class="px-3 py-2 bg-blue-100 cursor-pointer border-amber-50 shadow rounded  text-center font-medium">Id le
        l'article à filtrer</label>
        <input name="id" v-model="articleId" type="number" placeholder="Entrez l'ID de l'article"
        class="bg-white-200 cursor-pointer border-amber-50 shadow rounded  text-center font-medium" />
        <button @click="fetchComments"
        class="px-3 py-2 cursor-pointer bg-blue-400 rounded shadow font-medium hover:bg-blue-700">Charger les
        commentaires</button>
      </div>
      
      <!-- Message d'erreur -->
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <!-- Liste des commentaires -->
    <div v-if="comments.length > 0" class="comments-list">
      <h3>Commentaires pour l'article #{{ articleId }}</h3>
      <ul>
        <li v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-content">
            <p><strong>{{ comment.user.name }}</strong> : {{ comment.contenu }}</p>
            <small>Posté le {{ new Date(comment.created_at).toLocaleString() }}</small>
          </div>

          <div class="comment-actions">
            <button @click="startEdit(comment)">✏ Modifier</button>
            <button @click="deleteComment(comment.id)" class="delete">🗑 Supprimer</button>
            <button @click="startReply(comment.id)">↩ Répondre</button>
          </div>

          <!-- Réponses -->
          <ul v-if="comment.replies && comment.replies.length > 0" class="replies">
            <li v-for="reply in comment.replies" :key="reply.id">
              <strong>{{ reply.user.name }}</strong> : {{ reply.contenu }}
              <div class="comment-actions">
                <button @click="startEdit(reply)">✏ Modifier</button>
                <button @click="deleteComment(reply.id)" class="delete">🗑 Supprimer</button>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- Formulaire d'ajout / réponse / édition -->
    <div v-if="mode" class="comment-form">
      <h3>
        {{ mode === "add" ? "Ajouter un commentaire" : mode === "reply" ? "Répondre au commentaire" : "Modifier le commentaire" }}
      </h3>
      <textarea v-model="contenu" placeholder="Écrire ici..."></textarea>
      <div class="form-actions">
        <button @click="submitComment">Envoyer</button>
        <button @click="cancelAction">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { API_URL } from "../../utils/contants";

const articleId = ref("");
const comments = ref([]);
const contenu = ref("");
const parentId = ref(null);
const mode = ref("add"); // "add", "reply", "edit"
const editId = ref(null);
const errorMessage = ref("");

const token = localStorage.getItem("authToken");

// Charger les commentaires d’un article
async function fetchComments() {
  if (!articleId.value) return (errorMessage.value = "Veuillez entrer un ID d'article !");
  try {
    const res = await axios.get(`${API_URL}/articles/${articleId.value}/comments`);

    console.log(res);
    if (res.status === 403) {
      errorMessage.value = "Accès refusé (erreur 403)";
      return;
    }

    // if (!res.status === 200) throw new Error("Erreur lors du chargement des commentaires");
    comments.value = await res.data;
    errorMessage.value = "";
  } catch (err) {
    errorMessage.value = err.message;
  }
}

// Supprimer un commentaire
async function deleteComment(id) {
  if (!confirm("Supprimer ce commentaire?")) return;
  try {
    const res = await fetch(`${API_URL}/comments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 403) {
      errorMessage.value = "Action non autorisée (403)";
      return;
    }

    if (!res.ok) throw new Error("Erreur de suppression");
    comments.value = comments.value.filter((c) => c.id !== id);
  } catch (err) {
    errorMessage.value = err.message;
  }
}

// Ajouter / Répondre / Modifier
async function submitComment() {
  if (!contenu.value.trim()) return (errorMessage.value = "Le contenu ne peut pas être vide !");
  try {
    let url = "";
    let method = "";
    let body = {};

    if (mode.value === "add" || mode.value === "reply") {
      url = `${API_URL}/articles/${articleId.value}/comments`;
      method = "POST";
      body = { contenu: contenu.value, parent_id: parentId.value };
    } else if (mode.value === "edit") {
      url = `${API_URL}/comments/${editId.value}`;
      method = "PUT";
      body = { contenu: contenu.value };
    }

    // const res = await fetch(url, {
    //   method,
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // });

    const res = await axios({
      url,
      method, // 'GET', 'POST', 'PUT', 'DELETE'
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: body, // Axios gère automatiquement la conversion JSON
    });


    if (res.status === 403) {
      errorMessage.value = "Non autorisé à effectuer cette action (403)";
      return;
    }

    contenu.value = "";
    parentId.value = null;
    mode.value = "";
    await fetchComments();
  } catch (err) {
    errorMessage.value = err.message;
  }
}

// Helpers UI
function startEdit(comment) {
  mode.value = "edit";
  editId.value = comment.id;
  console.log(editId.value);

  contenu.value = comment.contenu;
}
function startReply(id) {
  mode.value = "reply";
  parentId.value = id;
}
function cancelAction() {
  mode.value = "";
  contenu.value = "";
  parentId.value = null;
}
</script>

<style scoped>
.admin-comments {
  max-width: 800px;
  margin: 2rem auto;
}

.article-select {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.comments-list {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
}

.comment-item {
  border-bottom: 1px solid #ddd;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}

.comment-actions button {
  margin-right: 0.5rem;
  border: none;
  cursor: pointer;
}

.comment-actions .delete {
  color: red;
}

.error {
  color: red;
  font-weight: bold;
}

.comment-form textarea {
  width: 100%;
  height: 80px;
  margin: 0.5rem 0;
}

.form-actions button {
  margin-right: 0.5rem;
}
</style>











































































<!-- <template>
  <section class="p-6 bg-gray-50 min-h-screen">
    <h2 class="text-3xl font-bold text-blue-600 mb-6">Gestion des commentaires 💬</h2>

    <table class="min-w-full bg-white rounded-xl shadow-lg">
      <thead class="bg-blue-600 text-white">
        <tr>
          <th class="py-3 px-4 text-left">Auteur</th>
          <th class="py-3 px-4 text-left">Article</th>
          <th class="py-3 px-4 text-left">Commentaire</th>
          <th class="py-3 px-4 text-left">Statut</th>
          <th class="py-3 px-4 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comment in comments" :key="comment.id" class="border-b hover:bg-gray-100">
          <td class="py-3 px-4">{{ comment.user.name }}</td>
          <td class="py-3 px-4">{{ comment.article.title }}</td>
          <td class="py-3 px-4">{{ comment.content }}</td>
          <td class="py-3 px-4">
            <span
              :class="comment.status === 'approved'
                ? 'text-green-600 font-semibold'
                : 'text-yellow-600 font-semibold'"
            >
              {{ comment.status }}
            </span>
          </td>
          <td class="py-3 px-4 text-center space-x-2">
            <button
              v-if="comment.status !== 'approved'"
              @click="updateStatus(comment.id, 'approved')"
              class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition"
            >
              Approuver
            </button>
            <button
              @click="deleteComment(comment.id)"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
            >
              Supprimer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const comments = ref([])

const storedUser = localStorage.getItem('user')
const user = storedUser ? JSON.parse(storedUser) : null
const token = user?.token || ''

const fetchComments = async () => {
  const res = await axios.get('${API_URL}/admin/comments', {
    headers: { Authorization: `Bearer ${token}` }
  })
  comments.value = res.data
}

const updateStatus = async (id, status) => {
  await axios.put(`${API_URL}/admin/comments/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  fetchComments()
}

const deleteComment = async (id) => {
  await axios.delete(`${API_URL}/admin/comments/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  comments.value = comments.value.filter(c => c.id !== id)
}

onMounted(fetchComments)
</script> -->
