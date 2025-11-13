<template>
  <section class="min-h-screen bg-gray-50 text-gray-800 py-12">
    <div class="max-w-5xl mx-auto px-6">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl md:text-4xl font-extrabold text-blue-600">Centre d’aide</h1>
        <p class="text-sm text-gray-600 mt-2 max-w-xl mx-auto">Choisissez une question pour voir le processus étape par étape.</p>
      </div>

      <!-- Grid simple: questions | conseil -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        <!-- Questions list -->
        <div class="space-y-3">
          <h2 class="text-lg font-semibold text-gray-800 mb-2">Questions fréquentes</h2>

          <div class="flex flex-col gap-2">
            <button
              v-for="faq in faqs"
              :key="faq.id"
              @click="openFaq(faq)"
              class="w-full text-left p-3 rounded-lg bg-white shadow-sm hover:shadow transition flex items-center justify-between"
            >
              <div>
                <div class="font-medium text-gray-800">{{ faq.title }}</div>
                <div class="text-xs text-gray-500 mt-1 line-clamp-2">{{ faq.summary }}</div>
              </div>
              <div class="text-blue-500 font-semibold ml-3">→</div>
            </button>
          </div>
        </div>

        <!-- Small tips box (compact) -->
        <aside class="bg-white p-4 rounded-lg shadow-sm items-center">
          <h3 class="text-sm font-semibold text-gray-800 mb-2">Conseil rapide</h3>
          <p class="text-xs text-gray-600">Si votre problème n'est pas couvert, cliquez sur "Contact support" ou envoyez-nous un e-mail.</p>

          <button @click="openSupport" class="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            📞 Contact support
          </button>
        </aside>
      </div>
    </div>

    <!-- Sliding card (more compact) -->
    <transition name="slide-right-fade">
      <div v-if="activeFaq" class="fixed inset-0 z-40 flex items-start justify-end">
        <!-- backdrop -->
        <div class="absolute inset-0 bg-black/30" @click="closeFaq"></div>

        <!-- card: narrower than before -->
        <div class="relative w-full sm:w-4/5 md:w-2/5 lg:w-1/3 h-full overflow-auto p-5 bg-white shadow-2xl rounded-l-2xl">
          <button @click="closeFaq" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>

          <header class="mb-3">
            <h3 class="text-lg font-semibold text-gray-800">{{ activeFaq.title }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ activeFaq.subtitle }}</p>
          </header>

          <div class="space-y-4">
            <div class="text-sm text-gray-700">
              <div class="font-medium mb-2">Étape {{ currentStep + 1 }} / {{ activeFaq.steps.length }}</div>
              <div class="mb-2 text-gray-800">{{ activeStep.title }}</div>
              <p class="text-sm text-gray-600">{{ activeStep.content }}</p>
            </div>

            <div class="w-full bg-gray-100 rounded-full h-2">
              <div class="h-2 rounded-full bg-blue-500" :style="{ width: progress + '%' }"></div>
            </div>

            <div class="flex items-center justify-between mt-3 gap-3">
              <button @click="prevStep" :disabled="currentStep===0" class="px-3 py-1 rounded bg-gray-100 disabled:opacity-50">← Précédent</button>

              <div>
                <button v-if="currentStep < activeFaq.steps.length - 1" @click="nextStep" class="px-3 py-1 bg-blue-600 text-white rounded">Suivant →</button>
                <button v-else @click="completeGuide" class="px-3 py-1 bg-green-600 text-white rounded">Terminé</button>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mt-2">
              <button
                v-for="(s, idx) in activeFaq.steps"
                :key="idx"
                @click="currentStep = idx"
                :class="['text-xs px-2 py-1 rounded-full border', idx===currentStep ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700']"
              >
                {{ idx + 1 }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const faqs = [
  { id: 1, title: "Créer un compte", summary: "S'inscrire et confirmer votre e-mail.", subtitle: "Créer un compte rapidement", steps: [
    { title: "Aller à l'inscription", content: "Cliquer sur 'S'inscrire' en haut à droite." },
    { title: "Remplir le formulaire", content: "Nom, email et mot de passe requis." },
    { title: "Confirmer l'email", content: "Cliquez sur le lien reçu." }
  ]},
  { id: 2, title: "Mot de passe oublié", summary: "Réinitialisez en quelques clics.", subtitle: "Récupérer l'accès", steps: [
    { title: "Page connexion", content: "Cliquer 'Mot de passe oublié ?'." },
    { title: "Entrer l'email", content: "Recevez le lien et choisissez un nouveau mot de passe." }
  ]},
  { id: 3, title: "Contacter support", summary: "Email & formulaire disponibles.", subtitle: "Contact support", steps: [
    { title: "Envoyer un email", content: "Écrire à support@monsite.com" },
    { title: "Formulaire", content: "Utiliser le formulaire d'aide sur cette page." }
  ]}
]

const activeFaq = ref(null)
const currentStep = ref(0)

function openFaq(faq) {
  activeFaq.value = faq
  currentStep.value = 0
  // ensure small scroll into view on mobile:
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function closeFaq() {
  activeFaq.value = null
  currentStep.value = 0
}
function nextStep() {
  if (!activeFaq.value) return
  if (currentStep.value < activeFaq.value.steps.length - 1) currentStep.value++
}
function prevStep() {
  if (!activeFaq.value) return
  if (currentStep.value > 0) currentStep.value--
}
function completeGuide() {
  // small feedback
  alert('Guide terminé — merci !')
  closeFaq()
}
function openSupport() {
  openFaq(faqs.find(f => f.id === 3))
}

const activeStep = computed(() => activeFaq.value ? activeFaq.value.steps[currentStep.value] : { title: '', content: '' })
const progress = computed(() => activeFaq.value ? Math.round(((currentStep.value + 1) / activeFaq.value.steps.length) * 100) : 0)
</script>

<style scoped>
/* simple slide from right */
.slide-right-fade-enter-active { transition: transform .28s ease, opacity .28s ease; }
.slide-right-fade-leave-active { transition: transform .22s ease, opacity .22s ease; }
.slide-right-fade-enter-from { transform: translateX(30%); opacity: 0; }
.slide-right-fade-enter-to { transform: translateX(0); opacity: 1; }
.slide-right-fade-leave-from { transform: translateX(0); opacity: 1; }
.slide-right-fade-leave-to { transform: translateX(30%); opacity: 0; }

/* line clamp */
.line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
