// src/stores/user.js
import { defineStore } from 'pinia'
import router from '@/router'    // si nécessaire pour redirection dans store

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,     // objet user (id, email, role, ...)
    token: null,    // token string
    initialized: false // optionnel : pour savoir si on a initialisé depuis localStorage
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userRole: (state) => state.user?.role ?? null
  },
  actions: {
    initFromLocalStorage() {
      // appeler une seule fois au démarrage (ex: App.vue onMounted)
      if (this.initialized) return
      try {
        const rawUser = localStorage.getItem('user')
        const rawToken = localStorage.getItem('authToken')
        this.user = rawUser ? JSON.parse(rawUser) : null
        this.token = rawToken ?? null
      } catch (e) {
        this.user = null
        this.token = null
      } finally {
        this.initialized = true
      }
    },

    setUserAndToken(userObj, tokenStr) {
      this.user = userObj
      this.token = tokenStr
      try {
        localStorage.setItem('user', JSON.stringify(userObj))
        if (tokenStr) localStorage.setItem('authToken', tokenStr)
      } catch (e) {
        console.warn('LocalStorage unavailable', e)
      }
    },

    logout({ callApi = true } = {}) {
      // Optionnel: appeler un endpoint logout côté serveur
      if (callApi) {
        // si tu utilises axios global, tu peux appeler l'API ici et l'ignorer si erreur
        axios.post('/api/logout').catch(() => {})
      }

      // nettoyage local
      this.user = null
      this.token = null
      try {
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
        // ou localStorage.clear() si tu veux tout effacer
      } catch (e) {
        console.warn('Erreur nettoyage localStorage', e)
      }
      // redirection propre sans reload
      router.replace('/') // utiliser replace pour ne pas laisser l'ancienne route dans l'historique
    }
  }
})
