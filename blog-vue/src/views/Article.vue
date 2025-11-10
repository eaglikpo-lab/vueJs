<template>
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

                <div v-else class="text-gray-500 italic mb-6">
                    Connectez-vous pour commenter cet article.
                </div>

                <!-- Liste des commentaires -->
                <div v-if="comments.length > 0" class="space-y-4">
                    <div v-for="comment in comments" :key="comment.id" class="p-4 border rounded-lg bg-gray-50">
                        <div class="flex items-start gap-4">
                            <!-- avatar placeholder -->
                            <div class="shrink-0">
                                <div
                                    class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
                                    {{ (comment.user && comment.user.name ? comment.user.name[0] : 'U').toUpperCase() }}
                                </div>
                            </div>

                            <div class="flex-1">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <p class="font-semibold text-gray-800">
                                            {{ (comment.user && comment.user.name) || ('Utilisateur #' +
                                            (comment.user_id ?? '')) }}
                                        </p>
                                        <p class="text-xs text-gray-500">il y a {{ timeAgo(comment.created_at) }}</p>
                                    </div>

                                    <div class="text-right">
                                        <span>{{ comment }}</span>
                                        <div v-if="isAuthor(comment)" class="flex items-center gap-2">
                                            <button @click="startEdit(comment)"
                                                class="text-sm text-blue-500">Modifier</button>
                                            <button @click="deleteComment(comment.id)"
                                                class="text-sm text-red-500">Supprimer</button>
                                        </div>
                                    </div>
                                </div>

                                <p class="mt-3 text-gray-700 whitespace-pre-line">{{ comment.content }}</p>

                                <!-- edit form inline -->
                                <div v-if="editingComment && editingComment.id === comment.id" class="mt-3">
                                    <textarea v-model="editingComment.content"
                                        class="w-full border rounded-lg p-2"></textarea>
                                    <div class="mt-2 flex gap-2">
                                        <button @click="updateComment"
                                            class="bg-green-500 text-white px-3 py-1 rounded-lg">Sauvegarder</button>
                                        <button @click="cancelEdit"
                                            class="text-gray-600 px-3 py-1 rounded-lg">Annuler</button>
                                    </div>
                                </div>

                                <!-- reply toggle -->
                                <div class="mt-3">
                                    <button @click="toggleReply(comment.id)"
                                        class="text-sm text-blue-600 hover:underline">Répondre</button>
                                    <div v-if="replyTo === comment.id" class="mt-2">
                                        <textarea v-model="replyContent" placeholder="Votre réponse..."
                                            class="w-full border rounded-lg p-2"></textarea>
                                        <div class="mt-2 flex gap-2">
                                            <button @click="addReply(comment.id)"
                                                class="bg-blue-500 text-white px-3 py-1 rounded-lg">Publier la
                                                réponse</button>
                                            <button @click="cancelReply"
                                                class="text-gray-600 px-3 py-1 rounded-lg">Annuler</button>
                                        </div>
                                    </div>
                                </div>

                                <!-- replies -->
                                <div v-if="comment.replies && comment.replies.length" class="mt-4 border-l pl-4">
                                    <div v-for="reply in comment.replies" :key="reply.id" class="mb-3">
                                        <div class="flex justify-between">
                                            <div>
                                                <p class="font-semibold text-gray-800">{{ (reply.user &&
                                                    reply.user.name) || ('Utilisateur #' + (reply.user_id ?? '')) }}</p>
                                                <p class="text-xs text-gray-500">il y a {{ timeAgo(reply.created_at) }}
                                                </p>
                                            </div>
                                            <div v-if="isAuthor(reply)">
                                                <button @click="startEdit(reply)"
                                                    class="text-sm text-blue-500 mr-2">Modifier</button>
                                                <button @click="deleteComment(reply.id)"
                                                    class="text-sm text-red-500">Supprimer</button>
                                            </div>
                                        </div>
                                        <p class="text-gray-700 mt-1">{{ reply.content }}</p>

                                        <!-- reply toggle -->
                                        <div class="mt-3">
                                            <button @click="toggleReply(comment.id)"
                                                class="text-sm text-blue-600 hover:underline">Répondre</button>
                                            <div v-if="replyTo === comment.id" class="mt-2">
                                                <textarea v-model="replyContent" placeholder="Votre réponse..."
                                                    class="w-full border rounded-lg p-2"></textarea>
                                                <div class="mt-2 flex gap-2">
                                                    <button @click="addReply(comment.id)"
                                                        class="bg-blue-500 text-white px-3 py-1 rounded-lg">Publier la
                                                        réponse</button>
                                                    <button @click="cancelReply"
                                                        class="text-gray-600 px-3 py-1 rounded-lg">Annuler</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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

const route = useRoute()
const article = ref(null)
const comments = ref([])
const newComment = ref("")
const replyContent = ref("")
const replyTo = ref(null)
const editingComment = ref(null)

const token = localStorage.getItem("authToken")
const isAuthenticated = !!token
const userId = Number(localStorage.getItem("userId")) // s'assurer number

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
    try {
        const [articleRes, commentRes] = await Promise.all([
            axios.get(`http://localhost:8000/api/articles/${id}`),
            axios.get(`http://localhost:8000/api/articles/${id}/comments`)
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
        const res = await axios.post(
            `http://localhost:8000/api/articles/${article.value.id}/comments`,
            { contenu: newComment.value }, // ton backend attend 'contenu'
            { headers: { Authorization: `Bearer ${token}` } }
        )

        // la réponse peut être { message: ..., comment: {...} }
        const serverComment = res.data.comment ?? res.data
        comments.value.push(normalizeComment(serverComment))
        newComment.value = ""
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

// Ajouter une réponse
async function addReply(parentId) {
    if (!replyContent.value.trim()) return
    try {
        const res = await axios.post(
            `http://localhost:8000/api/articles/${article.value.id}/comments`,
            { contenu: replyContent.value, parent_id: parentId },
            { headers: { Authorization: `Bearer ${token}` } }
        )

        const serverComment = res.data.comment ?? res.data
        const mapped = normalizeComment(serverComment)
        const parent = comments.value.find(c => c.id === parentId)
        if (parent) {
            parent.replies = parent.replies || []
            parent.replies.push(mapped)
        } else {
            // si parent non trouvé (rare), push top-level
            comments.value.push(mapped)
        }
        replyTo.value = null
        replyContent.value = ""
    } catch (err) {
        console.error(err)
        alert("Erreur lors de l'ajout de la réponse.")
    }
}

function cancelReply() {
    replyContent.value = ""
    replyTo.value = null
}

// Modifier un commentaire
function startEdit(comment) {
    editingComment.value = { id: comment.id, content: comment.content }
}

function cancelEdit() {
    editingComment.value = null
}

async function updateComment() {
    if (!editingComment.value || !editingComment.value.content.trim()) return
    try {
        const res = await axios.put(
            `http://localhost:8000/api/comments/${editingComment.value.id}`,
            { contenu: editingComment.value.content },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        const serverUpdated = res.data.comment ?? res.data
        const updated = normalizeComment(serverUpdated)

        // mettre à jour récursivement
        const updateRecursively = (arr) => {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === updated.id) {
                    arr[i].content = updated.content
                    return true
                }
                if (arr[i].replies && arr[i].replies.length) {
                    if (updateRecursively(arr[i].replies)) return true
                }
            }
            return false
        }
        updateRecursively(comments.value)
        editingComment.value = null
    } catch (err) {
        console.error(err)
        alert("Erreur lors de la mise à jour.")
    }
}

// Supprimer un commentaire
async function deleteComment(id) {
    if (!confirm("Supprimer ce commentaire ?")) return
    try {
        await axios.delete(`http://localhost:8000/api/comments/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
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

function toggleReply(commentId) {
    replyTo.value = replyTo.value === commentId ? null : commentId
}

function isAuthor(comment) {
    console.log(userId);
    const estAutheur = Number(comment.user_id) === Number(userId);
    console.log(estAutheur);
    return Number(comment.user_id) === Number(userId)
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
