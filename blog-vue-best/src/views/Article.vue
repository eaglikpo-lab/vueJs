<template>
    <div v-if="previewMode" class="bg-yellow-100 text-yellow-800 text-center py-2 mb-4 font-semibold">
        🔍 Vous êtes en mode aperçu administrateur
    </div>

    <div class="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
        <button @click="$router.back()" class="text-blue-600 hover:underline mb-4 inline-flex items-center">
            ← Retour
        </button>

        <div v-if="article">
            <!-- Header : image à gauche, texte à droite -->
            <div class="flex gap-6 mb-6 items-start p-5">
                <img v-if="article.image" :src="article.image" alt="Image de l'article"
                    class="w-60 h-60 object-cover rounded-lg shrink-0" />
                <div class="flex-1">
                    <h1 class="text-3xl font-bold mb-2">{{ article.title }}</h1>
                    <p class="text-gray-500 text-sm mb-4">Publié {{ timeAgo(article.created_at) }}</p>
                    <p class="text-gray-700 leading-relaxed">{{ article.description }}</p>
                </div>
            </div>

            <!-- COMMENTAIRES -->
            <section>
                <h2 class="text-2xl font-semibold mb-4">Commentaires ({{ comments.length }})</h2>

                <!-- Formulaire d'ajout -->
                <div class="mb-6" v-if="isAuthenticated">
                    <textarea v-model="newComment" placeholder="Ajouter un commentaire..."
                        class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    <div class="flex gap-2 mt-2">
                        <button @click="addComment"
                            class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                            Publier
                        </button>
                        <button @click="clearNewComment" class="text-gray-600 px-4 py-2 rounded-lg">Annuler</button>
                    </div>
                </div>

                <!-- <div v-else class="text-gray-500 italic mb-6">
                    Connectez-vous pour commenter cet article.
                </div> -->

                <!-- Liste des commentaires -->
                <div v-if="comments.length" class="space-y-4">

                    <!-- parent template -->
                    <CommentItem v-for="c in comments" :key="c.id" :comment="c" :userId="userId" @reply="handleReply"
                        @updated="handleUpdated" @deleted="handleDelete" />

                </div>


                <p v-else class="text-gray-500 italic">Aucun commentaire pour le moment.</p>

            </section>
        </div>

        <div v-else>
            <p class="text-gray-500 italic">Chargement de l’article...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import axios from "axios"
import CommentItem from "../components/CommentItem.vue"
import { useUserStore } from "../store/user"
import { API_URL } from "../utils/contants";
import api from "../libs/axios"

const userStore = useUserStore()
const userState = userStore.$state

const route = useRoute()
const article = ref(null)
const comments = ref([])
const newComment = ref("")
const previewMode = ref(false);

const token = userState.token
const isAuthenticated = !!token

const user = userState ? userState.user : null
// console.log(user);

const uId = ref(user ? user.id : null) // Accéder à l'email
// console.log(userId.value);

const userId = Number(uId.value) // s'assurer number
console.log(userId);


function handleUpdated(updated) {
    // recherche récursive pour mettre à jour le commentaire dans comments (comme before)
    const updateRecursively = (arr) => {
        for (const c of arr) {
            if (c.id === updated.id) {
                c.content = updated.content
                return true
            }
            if (c.replies) {
                if (updateRecursively(c.replies)) return true
            }
        }
        return false
    }
    updateRecursively(comments.value)
}


// UTIL: normaliser un commentaire serveur -> structure front attendue
function normalizeComment(server) {
    // server peut être { comment: {...} } ou directement l'objet
    const s = server.comment ? server.comment : server
    return {
        id: s.id,
        content: s.content ?? s.contenu ?? "",       // normaliser content
        user_id: s.user_id ?? s.user?.id ?? null,
        user: s.user ?? (s.user_id ? { id: s.user_id, name: s.user_name ?? null } : undefined),
        created_at: s.created_at ?? s.created_at,    // utilise la valeur si présente
        updated_at: s.updated_at ?? s.updated_at,
        replies: (s.replies ?? []).map(normalizeComment)
    }
}

// Charger article + commentaires
onMounted(async () => {
    const id = route.params.id
    console.log(id);
    try {
        const [articleRes, commentRes] = await Promise.all([

            // axios.get(`http://localhost:8000/api/articles/${id}`),
            // axios.get(`http://localhost:8000/api/articles/${id}/comments`)
            await api.get(`/articles/${id}`),
            await api.get(`/articles/${id}/comments`)
        ])

        // articleRes.data peut contenir directement l'article ou { article: ... }
        article.value = articleRes.data.article ?? articleRes.data

        // normaliser la liste des commentaires
        const serverComments = commentRes.data.comments ?? commentRes.data
        comments.value = Array.isArray(serverComments) ? serverComments.map(normalizeComment) : []

    } catch (err) {
        console.error(err)
    }
})

// Ajouter un commentaire
async function addComment() {
    if (!newComment.value.trim()) return
    try {
        // const res = await axios.post(
        //     `http://localhost:8000/api/articles/${article.value.id}/comments`,
        //     { contenu: newComment.value }, 
        //     { headers: { Authorization: `Bearer ${token}` } }
        // )

        // const res = await api.post(`/articles/${article.value.id}/comments`, {
        //     contenu: newComment.value
        // })

        const res = await axios.post(
            `${API_URL}/articles/${article.value.id}/comments`,
            { contenu: newComment.value },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // la réponse peut être { message: ..., comment: {...} }
        const serverComment = res.data.comment ?? res.data
        comments.value.push(normalizeComment(serverComment))
        newComment.value = ""
        return;

    } catch (err) {
        console.error(err)
        if (err.response && err.response.status === 422) {
            const errors = err.response.data.errors ?? err.response.data
            const firstField = Object.keys(errors)[0]
            alert(errors[firstField][0] ?? "Erreur de validation")
        } else {
            alert("Erreur lors de l'envoi du commentaire.")
        }
    }
}

function clearNewComment() {
    newComment.value = ""
}

// Supprimer un commentaire
async function handleDelete(id) {
    if (!confirm("Supprimer ce commentaire ?")) return
    try {
        // await axios.delete(`http://localhost:8000/api/comments/${id}`, {
        //     headers: { Authorization: `Bearer ${token}` }
        // })

        await api.delete(`/comments/${id}`)
        const removeRecursively = (arr) =>
            arr.filter((c) => {
                if (c.replies) c.replies = removeRecursively(c.replies)
                return c.id !== id
            })
        comments.value = removeRecursively(comments.value)
    } catch (err) {
        console.error(err)
        alert("Erreur lors de la suppression.")
    }
}

async function handleReply({ parentId, content }) {
    try {
        // const res = await axios.post(
        //     `http://localhost:8000/api/articles/${article.value.id}/comments`,
        //     { contenu: content, parent_id: parentId },
        //     { headers: { Authorization: `Bearer ${token}` } }
        // )

        const res = await api.post(`/articles/${article.value.id}/comments`, {
            contenu: content,
            parent_id: parentId
        })

        const newReply = normalizeComment(res.data.comment ?? res.data)

        // fonction récursive pour insérer la réponse au bon endroit
        const insertReply = (arr) => {
            for (const c of arr) {
                if (c.id === parentId) {
                    c.replies = c.replies || []
                    c.replies.push(newReply)
                    return true
                }
                if (c.replies && insertReply(c.replies)) return true
            }
            return false
        }

        insertReply(comments.value)
    } catch (err) {
        if (err.status === 401) {
            console.error(err)
            alert("Connectez vous pour commentez cet article")
        } else {
            alert("Erreur lors de la publication de la réponse.")
        }
    }
}

// timeAgo util simple (tu peux remplacer par dayjs)
function timeAgo(dateString) {
    if (!dateString) return "il y a un moment"
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now - date) / 1000)

    const intervals = {
        an: 31536000,
        mois: 2592000,
        semaine: 604800,
        jour: 86400,
        heure: 3600,
        minute: 60,
    }

    for (const [unit, value] of Object.entries(intervals)) {
        const count = Math.floor(seconds / value)
        if (count >= 1) {
            return `il y a ${count} ${unit}${count > 1 ? "s" : ""}`
        }
    }
    return "à l'instant"
}
</script>
