<template>
    <div class="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
        <button @click="$router.back()" class="text-blue-600 hover:underline mb-4 inline-flex items-center">
            ← Retour
        </button>

        <div v-if="article">
            <h1 class="text-3xl font-bold mb-4">{{ article.title }}</h1>
            <img v-if="article.image" :src="article.image" alt="Image de l'article" class="w-full rounded-lg mb-4" />
            <p class="text-gray-700 leading-relaxed mb-8">{{ article.description }}</p>

            <!-- COMMENTAIRES -->
            <section>
                <h2 class="text-2xl font-semibold mb-4">Commentaires</h2>

                <!-- Formulaire d'ajout -->
                <div class="mb-6" v-if="isAuthenticated">
                    <textarea v-model="newComment" placeholder="Ajouter un commentaire..."
                        class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    <button @click="addComment"
                        class="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
                        Publier
                    </button>
                </div>
                <div v-else class="text-gray-500 italic">
                    Connectez-vous pour commenter cet article.
                </div>

                <!-- Liste des commentaires -->
                <div v-if="comments.length > 0">
                    <div v-for="comment in comments" :key="comment.id" class="mb-6 border-b pb-4">
                        <!-- Commentaire principal -->
                        <div class="flex justify-between bg-amber-900">
                            <div class="flex flex-col bg-amber-300 w-[70%]">
                                <div class="flex justify-between gap-x-[40%] bg-amber-100">
                                    <!-- <span>{{ comment}}</span> -->
                                    <p class="font-semibold text-gray-800">
                                        @{{ comment.user || "Utilisateur" }}
                                    </p>
                                    <p> {{ timeAgo(comment.created_at) }} </p>
                                </div>
                                <p class="text-gray-700">{{ comment.contenu }}</p>
                            </div>

                            <!-- Actions si auteur -->
                            <div v-if="isAuthor(comment)">
                                <button @click="startEdit(comment)" class="text-sm text-blue-500 mr-2">
                                    Modifier
                                </button>
                                <button @click="deleteComment(comment.id)" class="text-sm text-red-500">
                                    Supprimer
                                </button>
                            </div>
                        </div>

                        <!-- Formulaire de modification -->
                        <div v-if="editingComment && editingComment.id === comment.id" class="mt-2">
                            <textarea v-model="editingComment.content" class="w-full border rounded-lg p-2"></textarea>
                            <button @click="updateComment" class="bg-green-500 text-white px-3 py-1 rounded-lg mt-2">
                                Sauvegarder
                            </button>
                            <button @click="cancelEdit" class="ml-2 text-gray-600 text-sm">
                                Annuler
                            </button>
                        </div>

                        <!-- Réponse -->
                        <div class="mt-3" v-if="isAuthenticated">
                            <button @click="toggleReply(comment.id)" class="text-sm text-blue-600 hover:underline">
                                Répondre
                            </button>

                            <div v-if="replyTo === comment.id" class="mt-2">
                                <textarea v-model="replyContent" placeholder="Votre réponse..."
                                    class="w-full border rounded-lg p-2"></textarea>
                                <button @click="addReply(comment.id)"
                                    class="bg-blue-500 text-white px-3 py-1 rounded-lg mt-2">
                                    Publier la réponse
                                </button>
                            </div>
                        </div>

                        <!-- Sous-commentaires -->
                        <div v-if="comment.replies && comment.replies.length" class="ml-6 mt-3 border-l pl-4">
                            <div v-for="reply in comment.replies" :key="reply.id" class="mb-2">
                                <p class="font-semibold text-gray-800">
                                    {{ reply.user.name || "Utilisateur" }}
                                </p>
                                <p class="text-gray-700">{{ reply.contenu }}</p>
                                <p>il y a {{ comment.created_at }}</p>


                                <div v-if="isAuthor(reply)">
                                    <button @click="startEdit(reply)" class="text-sm text-blue-500 mr-2">
                                        Modifier
                                    </button>
                                    <p>il y a {{ comment.updated_at }}</p>

                                    <button @click="deleteComment(reply.id)" class="text-sm text-red-500">
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p v-else class="text-gray-500 italic">
                    Aucun commentaire pour le moment.
                </p>
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

const userId = localStorage.getItem("userId") // optionnel si tu le stockes

// Charger article + commentaires
// onMounted(async () => {
//     const id = route.params.id

//     try {
//         const [articleRes, commentRes] = await Promise.all([
//             fetch(`http://localhost:8000/api/articles/${id}`),
//             fetch(`http://localhost:8000/api/articles/${id}/comments`)
//         ])

//         article.value = await articleRes.json()
//         comments.value = await commentRes.json()
//         console.log(article.value);
//         console.log(comments.value);

//     } catch (err) {
//         console.error(err)
//     }
// })

onMounted(async () => {
    const id = route.params.id;
    try {
        const [articleRes, commentRes] = await Promise.all([
            axios.get(`http://localhost:8000/api/articles/${id}`),
            axios.get(`http://localhost:8000/api/articles/${id}/comments`)
        ]);
        article.value = articleRes.data;
        comments.value = commentRes.data;
    } catch (err) {
        console.error(err);
        // gestion d'erreur : alert, toast ou redirection
    }
});


// Ajouter un commentaire
// async function addComment() {
//     if (!newComment.value.trim()) return
//     try {
//         const res = await fetch(
//           `http://localhost:8000/api/articles/${article.value.id}/comments`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`
//             },
//             body: JSON.stringify({ content: newComment.value })
//           }
//         )

//         const data = await res.json()
//         comments.value.push(data)
//         newComment.value = ""
//     } catch (err) {
//         console.error(err)
//     }
// }

async function addComment() {
    if (!newComment.value.trim()) return;
    try {
        const { data } = await axios.post(
            `http://localhost:8000/api/articles/${article.value.id}/comments`,
            { contenu: newComment.value },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        comments.value.push(data);
        newComment.value = "";
    } catch (err) {
        if (err.response) {
            const errors = err.response.data.errors || err.response.data;
            console.log('Status:', err.response.status);           // ex: 422
            console.log('Response data:', err.response.data);     // l'objet d'erreur de Laravel
            console.warn('Validation errors:', errors);
        } else {
            console.error(err);
        }
    }
}


async function addReply(parentId) {
    if (!replyContent.value.trim()) return
    try {
        const { data } = await axios.post(
            `http://localhost:8000/api/articles/${article.value.id}/comments`,
            { contenu: newComment.value },
            { parent_id: parentId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const parent = comments.value.find((c) => c.id === parentId)
        parent.replies = parent.replies || []
        parent.replies.push(data)
        replyTo.value = null
        replyContent.value = ""
    } catch (err) {
        console.error(err)
    }
}

// Ajouter une réponse
// async function addReply(parentId) {
//     if (!replyContent.value.trim()) return
//     try {
//         const res = await fetch(
//             `http://localhost:8000/api/articles/${article.value.id}/comments`,
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     content: replyContent.value,
//                     parent_id: parentId
//                 })
//             }
//         )
//         const data = await res.json()
//         const parent = comments.value.find((c) => c.id === parentId)
//         parent.replies = parent.replies || []
//         parent.replies.push(data)
//         replyTo.value = null
//         replyContent.value = ""
//     } catch (err) {
//         console.error(err)
//     }
// }

// Modifier un commentaire
function startEdit(comment) {
    editingComment.value = { ...comment }
}

function cancelEdit() {
    editingComment.value = null
}

async function updateComment() {
    try {
        const res = await fetch(
            `http://localhost:8000/api/comments/${editingComment.value.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ content: editingComment.value.content })
            }
        )
        const data = await res.json()

        const updateRecursively = (arr) => {
            for (const c of arr) {
                if (c.id === data.id) {
                    c.content = data.content
                    return
                }
                if (c.replies) updateRecursively(c.replies)
            }
        }
        updateRecursively(comments.value)
        editingComment.value = null
    } catch (err) {
        console.error(err)
    }
}

// Supprimer un commentaire
async function deleteComment(id) {
    if (!confirm("Supprimer ce commentaire ?")) return
    try {
        await fetch(`http://localhost:8000/api/comments/${id}`, {
            method: "DELETE",
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
    }
}


function timeAgo(dateString) {
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
      return `il y a ${count} ${unit}${count > 1 ? 's' : ''}`
    }
  }

  return "à l'instant"
}



function toggleReply(commentId) {
    replyTo.value = replyTo.value === commentId ? null : commentId
}

function isAuthor(comment) {
    return comment.user_id == userId
}
</script>
