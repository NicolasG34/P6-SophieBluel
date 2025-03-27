const apiLogin = "http://localhost:5678/api/users/login";

document.getElementById("loginForm").addEventListener("submit", connexion);

async function connexion(event) {
  event.preventDefault();

  // Get user input
  let user = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  // Basic validation 
  if (!user.email || !user.password) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    // Send login request
    let response = await fetch(apiLogin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-login";
      errorMessage.innerHTML = "Veuillez vérifier votre email et/ou votre mot de passe";
      document.querySelector("form").prepend(errorMessage);
    } else {
      let result = await response.json();
      const token = result.token;
      sessionStorage.setItem("authToken", token);
      window.location.href = "index.html";

    }
  } catch (error) {
    // Handle network or other errors
    console.error("Erreur de connexion:", error);
    const errorMessage = document.createElement("div");
    errorMessage.className = "error-login";
    errorMessage.innerHTML = "Une erreur s'est produite. Veuillez réessayer.";
    document.querySelector("form").prepend(errorMessage);
  }
}