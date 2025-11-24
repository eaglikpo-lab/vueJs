import api from "../libs/axios";

export class AuthService {
  //   userRole = null;
  user;
  token;

  /**
   * user login
   *
   * @param {string} email
   * @param {string} password
   *
   * @returns Promise<void>
   */
  async login(email, password) {
    try {
      const { data } = await api.post(`/login`, { email, password });

      this.user = data.user;
      this.token = data.token;

      // stockage local
      //   userStore.setUserAndToken(this.user, this.token);

      // configure axios global
      //   axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      // Redirection selon le rôle
      //   if (this.userRole === "admin") {
      //     router.push("/admin");
      //   } else if (this.userRole === "user") {
      //     router.push("/user");
      //   } else {
      //     router.push("/");
      //   }
    } catch (error) {
      if (error.response) {
        console.log("Erreur:", error.response.data.message);
        alert(error.response.data.message);
        // alert("Identifiants incorrects, réessayer")
      } else {
        console.error("Erreur inconnue:", error);
      }
    }
  }

  async logout() {
    // Optionnel: appeler un endpoint logout côté serveur
    try {
      await api.post(
        `/logout`,
        {}
        // { headers: { Authorization: `Bearer ${this.token}` } }
      );
      // tu peux vérifier le status si nécessaire (ex: 204 ou 200)
    } catch (err) {
      console.warn(
        "Erreur lors de l'appel logout API (ignoré) :",
        err?.response?.data ?? err
      );
    }

    // nettoyage local
    // this.user = null;
    // this.token = null;
    // try {
    //   localStorage.removeItem("user");
    //   localStorage.removeItem("authToken");
    //   // ou localStorage.clear() si tu veux tout effacer
    // } catch (e) {
    //   console.warn("Erreur nettoyage localStorage", e);
    // }

    // Supprime header axios global
    // delete axios.defaults.headers.common["Authorization"];

    // redirection propre sans reload
    // router.replace("/"); // utiliser replace pour ne pas laisser l'ancienne route dans l'historique
  }

  reset() {
    this.user = undefined;
    this.token = undefined;
  }
}
