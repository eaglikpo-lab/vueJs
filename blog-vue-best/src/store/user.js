// src/stores/user.js
import { defineStore } from 'pinia'
import router from '../router'    // si nécessaire pour redirection dans store
import axios from 'axios'


const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' })

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,     // objet user (id, email, role, ...)
    token: null,    // token string
    initialized: false, // optionnel : pour savoir si on a initialisé depuis localStorage
    userRole: null,
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
        const storedUser = localStorage.getItem('user')
        const storedToken = localStorage.getItem('authToken')

        if (storedToken) {
          this.token = storedToken
          // configure axios global header pour toutes les requêtes
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        } else { this.token = storedToken ?? null }

        this.user = storedUser ? JSON.parse(storedUser) : null
        this.userRole = this.user?.role ?? null
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

    async login(email, password) {
      try {
        const { data } = await axios.post(
          'http://127.0.0.1:8000/api/login',
          { email, password }
        )

        this.user = data.user
        this.token = data.token

        // stockage local
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('authToken', data.token)

        // configure axios global
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`

        // Redirection selon le rôle
        if (this.userRole === 'admin') {
          router.push('/admin')
        } else if((this.userRole === 'user')) {
          router.push('/user')
        } else {
          router.push('/')
        }
      } catch (error) {
        if (error.response) {
          console.log('Erreur:', error.response.data.message)
          alert(error.response.data.message)
          // alert("Identifiants incorrects, réessayer")
        } else {
          console.error('Erreur inconnue:', error)
        }
      }
    },

    async logout({ callApi = true } = {}) {
      // Optionnel: appeler un endpoint logout côté serveur
      if (callApi && this.token) {
        try {
          await axios.post(
            'http://127.0.0.1:8000/api/logout',
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          )
          // tu peux vérifier le status si nécessaire (ex: 204 ou 200)
        } catch (err) {
          console.warn('Erreur lors de l\'appel logout API (ignoré) :', err?.response?.data ?? err)
        }
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

      // Supprime header axios global
      delete axios.defaults.headers.common['Authorization']

      // redirection propre sans reload
      router.replace('/') // utiliser replace pour ne pas laisser l'ancienne route dans l'historique
    }
  }
})
