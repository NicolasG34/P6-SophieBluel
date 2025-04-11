handlePictureSubmit();
const addPhotoButton = document.querySelector(".add-photo-button");
const backButton = document.querySelector(".js-modal-back");
addPhotoButton.addEventListener("click", toggleModal);
backButton.addEventListener("click", toggleModal);
backButton.addEventListener("click", resetAddWorkForm);
const loginLink = document.querySelector("#login-link");

const modifyButton = document.querySelector(".modify-button");


function resetAddWorkForm() {
    document.getElementById("picture-form").reset(); // Vide les champs
    document.getElementById("photo-container").innerHTML = ""; // Supprime l’image affichée
    document
        .querySelectorAll(".picture-loaded") // Réaffiche les éléments masqués
        .forEach((e) => (e.style.display = "block"));
}

// Si l'utilisateur est connecté, le mode édition s'affiche
const token = sessionStorage.getItem('authToken');
if (token) {
    document.querySelector("#header").classList.add("modify");
    showModifyBar = document.querySelector(".modify-bar");
    showModifyBar.style.display = "flex";

    showModifyButton = document.querySelector(".modify-button");
    showModifyButton.style.display = "flex";
    
    showFilters = document.querySelector(".filters");
    showFilters.style.display = "none";
    showFilters = document.querySelector(".portfolio--title");
    showFilters.style.margin = "5em";

    const loginLink = document.querySelector(".login-link");
    loginLink.innerHTML = "logout";
    loginLink.setAttribute("href","index.html");
    loginLink.addEventListener("click", (event) => {
        sessionStorage.removeItem('authToken');
    });
    console.log(loginLink);
}

let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

// Fonction pour fermer la modale
const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector("#modal1");
    modal.style.display = "flex";

};
modifyButton.addEventListener("click", openModal);

const crossModal = document.querySelector(".js-modal-close");
const crossModal2 = document.querySelector(".js-modal-close2");

// Fonction pour fermer la modale
const closeModal = function (e) {
    if (e) {
        e.preventDefault();  // Empêche le comportement par défaut seulement si `e` est défini
    }
    const galleryModal = document.querySelector(".gallery-modal");
    const addModal = document.querySelector(".add-modal");

    galleryModal.style.display = "block";
    
    addModal.style.display = "none";
    modal = document.querySelector("#modal1");
    if (modal) {
        modal.style.display = "none";
        resetAddWorkForm();
    }
};

// Fermer en cliquant sur la croix
if (crossModal) {
    crossModal.addEventListener("click", closeModal);
}

if (crossModal2) {
    crossModal2.addEventListener("click",() =>{
        closeModal();
       // toggleModal();
    });

}

// Fermer en cliquant à l'extérieur de la modale
document.addEventListener("click", (e) => {
    if (modal && e.target === modal) { 
        closeModal(e);
    }
});

function toggleModal() {
    const galleryModal = document.querySelector(".gallery-modal");
    const addModal = document.querySelector(".add-modal");

    if (
        galleryModal.style.display === "block" ||
        galleryModal.style.display === ""
    ) {
        galleryModal.style.display = "none";
        addModal.style.display = "block";
    } else {
        galleryModal.style.display = "block";
        addModal.style.display = "none";
    }
}

fetch(apiURL + "works")
    .then((response) => { return response.json() })
    .then((data) => {
        const gallery = document.querySelector(".modal-gallery");
        data.forEach(work => {
            fillModal(work, gallery);
        });
    });


    
// Fonction qui remplit la modale des works de l'api
const fillModal = (work, gallery) => {
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    image.src = work.imageUrl;
    image.alt = work.title;

    // Créer un conteneur pour l'image et l'icône
    figure.classList.add("image-container");

    // Ajouter l'image au conteneur
    figure.appendChild(image);

    // Créer l'icône poubelle
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can"); // Icône Font Awesome

    // Ajouter l'icône poubelle au conteneur
    figure.appendChild(trashIcon);

    // Ajouter la figure à la galerie
    gallery.appendChild(figure);

    // Attribuer des classes et attributs
    figure.setAttribute("data-id", work.id);
    figure.classList.add("workImg");

    // Event pour la suppression de l'image
    trashIcon.addEventListener("click", (event) => {
        const workId = event.target.parentElement.dataset.id;
        fetch(apiURL + "works/" + workId, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then((response) => {
                if (response.ok) {
                    figure.remove(); // Supprimer l'image et l'icône quand l'icône de poubelle est cliquée
                    let element = document.querySelector('[data-workid="'+workId+'"]');
                    element.remove();
                }
            })
    });
}

function handlePictureSubmit() {
    const img = document.createElement("img");
    const fileInput = document.getElementById("file");
    let file;
    fileInput.style.display = "none";

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

    const titleInput = document.getElementById("title");
    let titleValue = "";
    let selectedValue = "1";

    document.getElementById("category").addEventListener("change", function () {
        selectedValue = this.value;
    });

    titleInput.addEventListener("input", function () {
        titleValue = titleInput.value;
    });

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

                const data = await response.json();
                const gallery = document.querySelector(".gallery");
                const galleryModal = document.querySelector(".modal-gallery");
                fillMainGallery(data, gallery);
                fillModal(data,galleryModal);
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

