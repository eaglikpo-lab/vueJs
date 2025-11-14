<template>
  <div class="p-4 rounded-lg bg-gray-50 mt-2">
    <div class="flex items-start gap-4">
      <!-- Avatar -->
      <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600">
        {{ (comment.user?.name ? comment.user.name[0] : 'U').toUpperCase() }}
      </div>

      <div class="flex-1">
        <!-- Header -->
        <div class="flex justify-between items-start">
          <div>
            <p class="font-semibold text-gray-800">
              {{ comment.user?.name || ('Utilisateur #' + (comment.user_id ?? '')) }}
            </p>
            <p class="text-xs text-gray-500">{{ timeAgo(comment.created_at) }}</p>

            <!-- Affichage du nombre de réponses -->
            <span v-if="(comment.replies?.length ?? 0) > 0" class="toggle-replies text-xs text-blue-600 cursor-pointer"
                  @click="toggleShowReplies">
              {{ comment.replies.length }} réponse(s)
            </span>
          </div>

          <div v-if="isAuthor(comment)" class="flex items-center gap-2 text-sm">
            <button @click="startEdit" class="text-blue-500">Modifier</button>
            <button @click="confirmDelete" class="text-red-500">Supprimer</button>
          </div>
        </div>

        <!-- Contenu ou formulaire d'édition -->
        <div v-if="editing" class="mt-3">
          <textarea v-model="editingContent" class="w-full border rounded-lg p-2"></textarea>
          <div class="mt-2 flex gap-2">
            <button @click="saveEdit" class="bg-green-500 text-white px-3 py-1 rounded-lg">Sauvegarder</button>
            <button @click="cancelEdit" class="text-gray-600 px-3 py-1 rounded-lg">Annuler</button>
          </div>
        </div>
        <p v-else class="mt-3 text-gray-700 whitespace-pre-line text-justify">{{ comment.content }}</p>

        <!-- Bouton Répondre -->
        <div class="mt-2">
          <button @click="toggleReply" class="text-sm text-blue-600 hover:underline">Répondre</button>
        </div>

        <!-- Formulaire de réponse -->
        <div v-if="replyToThis" class="mt-2">
          <textarea v-model="replyContent" placeholder="Votre réponse..."
                    class="w-full border rounded-lg p-2"></textarea>
          <div class="mt-2 flex gap-2">
            <button @click="emitReply" class="bg-blue-500 text-white px-3 py-1 rounded-lg">Publier la réponse</button>
            <button @click="cancelReply" class="text-gray-600 px-3 py-1 rounded-lg">Annuler</button>
          </div>
        </div>

        <!-- Sous-commentaires (récursif) -->
        <div v-if="showReplies && (comment.replies?.length)" class="mt-4 border-l-2 border-gray-200 pl-4 space-y-2">
          <CommentItem
            v-for="child in comment.replies"
            :key="child.id"
            :comment="child"
            :userId="userId"
            @reply="$emit('reply', $event)"
            @updated="$emit('updated', $event)"
            @deleted="$emit('deleted', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { defineAsyncComponent } from "vue"
import axios from "axios"
import { useUserStore } from "../store/user"
const userStore = useUserStore()
const userState = userStore.$state

// récursion asynchrone 
const CommentItem = defineAsyncComponent(() => import('./CommentItem.vue'))

const props = defineProps({
  comment: { type: Object, required: true },
  userId: { type: [Number, String], required: false }
})

const emit = defineEmits(["reply", "updated", "deleted"])

const replyToThis = ref(false)
const replyContent = ref("")
const editing = ref(false)
const editingContent = ref("")

const showReplies = ref(true) // par défaut afficher les réponses

function toggleShowReplies() {
  showReplies.value = !showReplies.value
}

function toggleReply() {
  replyToThis.value = !replyToThis.value
}

function cancelReply() {
  replyContent.value = ""
  replyToThis.value = false
}

function emitReply() {
  if (!replyContent.value.trim()) return
  emit("reply", { parentId: props.comment.id, content: replyContent.value })
  replyContent.value = ""
  replyToThis.value = false
}

function startEdit() {
  editing.value = true
  editingContent.value = props.comment.content ?? ""
}

function cancelEdit() {
  editing.value = false
  editingContent.value = ""
}

async function saveEdit() {
  if (!editingContent.value.trim()) return
  try {
    // Appel PUT à Laravel API : /api/comments/{id}
    const url = `http://127.0.0.1:8000/api/comments/${props.comment.id}`
    const payload = { contenu: editingContent.value } // adapter si API attend 'content'
      const token = userState.token
      console.log("token", token);
      console.log('playload', payload);
    
    const res = await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } })
      const updated = res.data.comment ?? res.data
    console.log(updated);
    

    // émettre l'objet mis à jour pour que le parent mette à jour son arbre
    // on normalise ici les champs attendus (content)
    emit("updated", {
      id: updated.id,
      content: updated.content ?? updated.contenu ?? editingContent.value,
      user_id: updated.user_id ?? props.comment.user_id,
      user: updated.user ?? props.comment.user,
      parent_id: updated.parent_id ?? props.comment.parent_id,
      created_at: updated.created_at ?? props.comment.created_at,
      updated_at: updated.updated_at ?? new Date().toISOString()
    })

    editing.value = false
    editingContent.value = ""
  } catch (err) {
    console.error("Erreur update comment:", err)
    alert("Erreur lors de la mise à jour du commentaire.")
  }
}

function confirmDelete() {
  if (!confirm("Supprimer ce commentaire ?")) return
  // déléguer au parent pour suppression (ou faire axios.delete ici)
  emit("deleted", props.comment.id)
}

function timeAgo(dateString) {
  if (!dateString) return "il y a un moment"
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  const intervals = { an: 31536000, mois: 2592000, semaine: 604800, jour: 86400, heure: 3600, minute: 60 }
  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value)
    if (count >= 1) return `il y a ${count} ${unit}${count > 1 ? "s" : ""}`
  }
  return "à l'instant"
}

function isAuthor(comment) {
  return Number(comment.user_id) === Number(props.userId)
}
</script>

<style scoped>
    .toggle-replies { display: inline-block; margin-top: 4px; }
</style>
