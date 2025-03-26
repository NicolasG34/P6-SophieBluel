//const apiURL = "http://localhost:5678/api/";

const addPhotoButton = document.querySelector(".add-photo-button");
const backButton = document.querySelector(".js-modal-back");
addPhotoButton.addEventListener("click", toggleModal);
backButton.addEventListener("click", toggleModal);

const modifyButton = document.querySelector(".modify-button");

const token = sessionStorage.getItem('authToken');
if (token) {
  document.querySelector("#header").classList.add("modify");
}

let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector("#modal1");
  modal.style.display = "flex";
  
};
modifyButton.addEventListener("click", openModal);
console.log(openModal);

const crossModal = document.querySelector(".js-modal-close");

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
};
crossModal.addEventListener("click", closeModal);

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

const stopPropagation = function (e) {
  e.stopPropagation();
};

// Gestion de l'ajout d'une nouvelle photo
function handlePictureSubmit() {
  const img = document.createElement("img");
  const fileInput = document.getElementById("file");
  let file; // On ajoutera dans cette variable la photo qui a été uploadée.
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
      // Je converti l'image en une URL de donnees
      reader.readAsDataURL(file);
      document
        .querySelectorAll(".picture-loaded") // Pour enlever ce qui se trouvait avant d'upload l'image
        .forEach((e) => (e.style.display = "none"));
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

      let response = await fetch(`${url}/works`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });
      if (response.status !== 201) {
        const errorText = await response.text();
        console.error("Erreur : ", errorText);
        const errorBox = document.createElement("div");
        errorBox.className = "error-login";
        errorBox.innerHTML = `Il y a eu une erreur : ${errorText}`;
        document.querySelector("form").prepend(errorBox);
      }
    } else {
      alert("Veuillez remplir tous les champs");
    }
  });
}