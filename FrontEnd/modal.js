// Lance la configuration du formulaire d'ajout d'image
handlePictureSubmit();

// Sélection des éléments du DOM
const addPhotoButton = document.querySelector(".add-photo-button");
const backButton = document.querySelector(".js-modal-back");
const modifyButton = document.querySelector(".modify-button");

// Ajout d'EventListener pour gérer l'ouverture et la navigation entre les modales
addPhotoButton.addEventListener("click", toggleModal);
backButton.addEventListener("click", toggleModal);
backButton.addEventListener("click", resetAddWorkForm);

// Fonction pour réinitialiser le formulaire d'ajout d'image
function resetAddWorkForm() {
    document.getElementById("picture-form").reset(); // Réinitialise les champs
    document.getElementById("photo-container").innerHTML = ""; // Supprime la prévisualisation
    document.querySelectorAll(".picture-loaded").forEach((e) => (e.style.display = "block")); // Réaffiche les éléments
}

// Vérifie si l'utilisateur est connecté (présence du token)
const token = sessionStorage.getItem('authToken');
if (token) {
    // Active l'affichage du mode édition
    document.querySelector("#header").classList.add("modify");

    showModifyBar = document.querySelector(".modify-bar");
    showModifyBar.style.display = "flex";

    showModifyButton = document.querySelector(".modify-button");
    showModifyButton.style.display = "flex";

    showFilters = document.querySelector(".filters");
    showFilters.style.display = "none";

    showPortfolio = document.querySelector(".portfolio--title");
    showPortfolio.style.margin = "5em";

    // Transforme le bouton login en logout
    const loginLink = document.querySelector(".login-link");
    loginLink.innerHTML = "logout";
    loginLink.setAttribute("href", "index.html");
    loginLink.addEventListener("click", (event) => {
        sessionStorage.removeItem('authToken'); // Déconnexion
    });
}

// Initialisation de la modale
let modal = null;
const focusableSelector = "button, a, input, textarea";

// Fonction pour ouvrir la modale
const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector("#modal1");
    modal.style.display = "flex";
};
modifyButton.addEventListener("click", openModal);

// Sélection des boutons de fermeture de la modale
const crossModal = document.querySelector(".js-modal-close");
const crossModal2 = document.querySelector(".js-modal-close2");

// Fonction pour fermer la modale
const closeModal = function (e) {
    if (e) e.preventDefault();

    const galleryModal = document.querySelector(".gallery-modal");
    const addModal = document.querySelector(".add-modal");

    galleryModal.style.display = "block";
    addModal.style.display = "none";

    modal = document.querySelector("#modal1");
    if (modal) {
        modal.style.display = "none";
        resetAddWorkForm(); // Réinitialisation du formulaire au passage
    }
};

// Ajout des fermetures par croix
if (crossModal) {
    crossModal.addEventListener("click", closeModal);
}
if (crossModal2) {
    crossModal2.addEventListener("click", () => {
        closeModal();
    });
}

// Fermer en cliquant à l'extérieur de la modale
document.addEventListener("click", (e) => {
    if (modal && e.target === modal) {
        closeModal(e);
    }
});

// Fonction qui bascule entre les vues "galerie" et "ajout"
function toggleModal() {
    const galleryModal = document.querySelector(".gallery-modal");
    const addModal = document.querySelector(".add-modal");

    if (galleryModal.style.display === "block" || galleryModal.style.display === "") {
        galleryModal.style.display = "none";
        addModal.style.display = "block";
    } else {
        galleryModal.style.display = "block";
        addModal.style.display = "none";
    }
}

// Récupère les travaux depuis l'API et les affiche dans la modale
fetch(apiURL + "works")
    .then((response) => response.json())
    .then((data) => {
        const gallery = document.querySelector(".modal-gallery");
        data.forEach(work => {
            fillModal(work, gallery);
        });
    });

// Fonction pour remplir la galerie modale avec les images
const fillModal = (work, gallery) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    image.src = work.imageUrl;
    image.alt = work.title;
    figure.classList.add("image-container");

    figure.appendChild(image);

    // Création de l’icône de suppression
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can");
    figure.appendChild(trashIcon);

    gallery.appendChild(figure);

    figure.setAttribute("data-id", work.id);
    figure.classList.add("workImg");

    // Suppression de l’image au clic sur l’icône
    trashIcon.addEventListener("click", (event) => {
        const workId = event.target.parentElement.dataset.id;
        fetch(apiURL + "works/" + workId, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token
            }
        }).then((response) => {
            if (response.ok) {
                figure.remove();
                let element = document.querySelector('[data-workid="' + workId + '"]');
                if (element) element.remove();
            }
        });
    });
}

// Gère le comportement du formulaire d'ajout de photo
function handlePictureSubmit() {
    const img = document.createElement("img");
    const fileInput = document.getElementById("file");
    let file;

    fileInput.style.display = "none";

    // Prévisualisation de l’image sélectionnée
    fileInput.addEventListener("change", function (event) {
        file = event.target.files[0];
        const maxFileSize = 4 * 1024 * 1024;

        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            if (file.size > maxFileSize) {
                alert("La taille de l'image ne doit pas dépasser 4 Mo.");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
                img.alt = "Uploaded Photo";
                document.getElementById("photo-container").appendChild(img);
            };
            reader.readAsDataURL(file);

            document.querySelectorAll(".picture-loaded").forEach((e) => (e.style.display = "none"));
        } else {
            alert("Veuillez sélectionner une image au format JPG ou PNG.");
        }
    });

    // Gestion des champs titre et catégorie
    const titleInput = document.getElementById("title");
    let titleValue = "";
    let selectedValue = "1";

    document.getElementById("category").addEventListener("change", function () {
        selectedValue = this.value;
    });

    titleInput.addEventListener("input", function () {
        titleValue = titleInput.value;
    });

    // Soumission du formulaire
    const addPictureForm = document.getElementById("picture-form");

    addPictureForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const hasImage = document.querySelector("#photo-container").firstChild;
        if (hasImage && titleValue) {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("title", titleValue);
            formData.append("category", selectedValue);

            const token = sessionStorage.authToken;
            if (!token) {
                console.error("Token d'authentification manquant.");
                return;
            }

            try {
                const response = await fetch(`${apiURL}works`, {
                    method: "POST",
                    headers: {
                        Authorization: "Bearer " + token
                    },
                    body: formData
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Erreur : ", errorText);
                    const errorBox = document.createElement("div");
                    errorBox.className = "error-login";
                    errorBox.innerHTML = `Il y a eu une erreur : ${errorText}`;
                    document.querySelector("form").prepend(errorBox);
                    return;
                }

                // Mise à jour des galeries après ajout
                const data = await response.json();
                const gallery = document.querySelector(".gallery");
                const galleryModal = document.querySelector(".modal-gallery");
                fillMainGallery(data, gallery);
                fillModal(data, galleryModal);
                resetAddWorkForm();
                closeModal();

            } catch (error) {
                console.error("Erreur lors de l'envoi :", error);
            }
        } else {
            alert("Veuillez remplir tous les champs");
        }
    });
}