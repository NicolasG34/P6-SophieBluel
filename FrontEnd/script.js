const apiURL = "http://localhost:5678/api/";

const addPhotoButton = document.querySelector(".add-photo-button");
const backButton = document.querySelector(".js-modal-back");
addPhotoButton.addEventListener("click", toggleModal);
backButton.addEventListener("click", toggleModal);

//Récupération des travaux depuis l'API
fetch(apiURL + "works")
    .then((response) => { return response.json() })
    .then((data) => {
        const gallery = document.querySelector(".gallery");
        data.forEach(work => {
            const figure = document.createElement("figure");
            const image = document.createElement("img");
            const figCaption = document.createElement("figcaption");

            image.src = work.imageUrl;
            image.alt = work.title;
            figCaption.innerHTML = work.title;

            figure.appendChild(image);
            figure.appendChild(figCaption);
            gallery.appendChild(figure);

            figure.setAttribute("data-idcat", work.categoryId);
            figure.setAttribute("class", "workImg");
            const categoryIdImage = document.getElementsByClassName("workImg");
            console.log(categoryIdImage);
            console.log(categoryIdImage.dataset);
        });
    })

    //Rédupération des catégories depuis l'API
fetch(apiURL + "categories")
    .then((response) => { return response.json() })
    .then((data) => {
        const categories = document.querySelector(".filters");
        //Ajout des filtres pour chaque catégorie
        data.forEach(category => {
            const filter = document.createElement("div");
            filter.classList.add("filter");
            filter.innerHTML = category.name;
            categories.appendChild(filter);
            filter.setAttribute("data-id", category.id);
            //Actionnement filtres au click
            filter.addEventListener("click", function (event) {
                console.log(event);
                const works = document.getElementsByClassName("workImg");
                console.log(works);
                Array.from(works).forEach((work)=>{
                    const workCatId = work.dataset.idcat;
                    const filterCatId =event.target.dataset.id;
                    if (filterCatId !== workCatId){
                        work.style.display="none";
                    }
                    else{
                        work.style.display="block";
                    }
                })
            })
        });
        //Actionnement du filtre All
        const all = document.getElementById("all");
        console.log(all);
        all.addEventListener("click", function (event) {
                const works = document.getElementsByClassName("workImg");
                console.log(works);
                Array.from(works).forEach((work)=>{
                    work.style.display="block";
                })
                   
        })
    })

    const token = sessionStorage.getItem('authToken');
if (token){
    document.querySelector("#header").classList.add("modify");
}
    
 let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  focusables[0].focus();
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal
    .querySelectorAll(".js-modal-close")
    .forEach((e) => e.addEventListener("click", closeModal));

  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
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


