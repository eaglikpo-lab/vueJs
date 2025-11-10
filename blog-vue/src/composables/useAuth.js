// src/composables/useAuth.js
import { ref, computed } from "vue";

const token = ref(localStorage.getItem("authToken") || null);
const userEmail = ref(localStorage.getItem("userEmail") || null);
const userRole = ref(localStorage.getItem("userRole") || null);

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value);

  function login(newToken, email, role) {
    token.value = newToken;
    userEmail.value = email;
    userRole.value = role;

    localStorage.setItem("authToken", newToken);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
  }

  function logout() {
    token.value = null;
    userEmail.value = null;
    userRole.value = null;

    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
  }

  return {
    token,
    userEmail,
    userRole,
    isAuthenticated,
    login,
    logout,
  };
}
