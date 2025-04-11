// URL de l'API pour la connexion de l'utilisateur
const apiLogin = "http://localhost:5678/api/users/login";

// Ajout d'un eventListener au formulaire de connexion
document.getElementById("loginForm").addEventListener("submit", connexion);

// Fonction de gestion de la connexion
async function connexion(event) {
  // Empêche le rechargement de la page lors de la soumission du formulaire
  event.preventDefault();

  // Récupère les valeurs saisies dans les champs email et mot de passe
  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  // Vérifie que tous les champs sont remplis
  if (!user.email || !user.password) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    // Envoie des données de connexion à l'API 
    let response = await fetch(apiLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // Si la réponse n'est pas correcte 
    if (!response.ok) {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-login";
      errorMessage.innerHTML = "Veuillez vérifier votre email et/ou votre mot de passe";
      document.querySelector("form").prepend(errorMessage);
    } else {
      // Si la connexion réussit, on récupère le token
      let result = await response.json();
      const token = result.token;

      // Stocke le token dans le sessionStorage 
      sessionStorage.setItem("authToken", token);

      // Redirige l'utilisateur vers la page d'accueil
      window.location.href = "index.html";
    }
  } catch (error) {
    // En cas d'erreur réseau ou autre problème inattendu
    console.error("Erreur de connexion:", error);
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-login";
    errorMessage.innerHTML = "Une erreur s'est produite. Veuillez réessayer.";
    document.querySelector("form").prepend(errorMessage);
  }
}