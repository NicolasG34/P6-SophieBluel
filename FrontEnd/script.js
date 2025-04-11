// Déclaration de l'URL de base de l'API
const apiURL = "http://localhost:5678/api/";

// --- RÉCUPÉRATION ET AFFICHAGE DES WORKS (TRAVAUX) ---

// Appel à l'API pour récupérer les travaux (works)
fetch(apiURL + "works")
  .then((response) => { return response.json(); }) // Conversion de la réponse en JSON
  .then((data) => {
    const gallery = document.querySelector(".gallery"); // Sélection de la galerie dans le DOM
    // Pour chaque work récupéré, on l'affiche dans la galerie
    data.forEach(work => {
      fillMainGallery(work, gallery);
    });
  });

// Fonction pour créer et insérer les éléments HTML dans la galerie principale
const fillMainGallery = (work, gallery) => {
  // Création des éléments HTML 
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  const figCaption = document.createElement("figcaption");

  // Attribution de la source et du texte
  image.src = work.imageUrl;
  image.alt = work.title;
  figCaption.innerHTML = work.title;

  // Attribution des images et de la description à la figure et de la figure à la galerie
  figure.appendChild(image);
  figure.appendChild(figCaption);
  gallery.appendChild(figure);

  // Attribution d'attributs personnalisés pour le filtrage
  figure.setAttribute("data-idcat", work.categoryId); 
  figure.setAttribute("data-workid", work.id);        
  figure.setAttribute("class", "workImg");           

}

// --- RÉCUPÉRATION ET AFFICHAGE DES CATÉGORIES POUR FILTRES ---

// Appel à l'API pour récupérer les catégories
fetch(apiURL + "categories")
  .then((response) => { return response.json(); }) // Conversion de la réponse en JSON
  .then((data) => {
    const categories = document.querySelector(".filters"); // Sélection du conteneur de filtres

    // Pour chaque catégorie, création d'un bouton de filtre
    data.forEach(category => {
      const filter = document.createElement("div");
      filter.classList.add("filter");
      filter.innerHTML = category.name;
      categories.appendChild(filter);

      // Ajout de l'ID de catégorie comme attribut personnalisé
      filter.setAttribute("data-id", category.id);

      // Ajout de l'eventListener au clic sur le filtre
      filter.addEventListener("click", function (event) {
        const works = document.getElementsByClassName("workImg");

        // Affichage ou masquage des travaux selon leur catégorie
        Array.from(works).forEach((work) => {
          const workCatId = work.dataset.idcat;
          const filterCatId = event.target.dataset.id;

          // Affiche uniquement les travaux de la catégorie sélectionnée
          if (filterCatId !== workCatId) {
            work.style.display = "none";
          } else {
            work.style.display = "block";
          }
        });
      });
    });

    // Gestion du filtre "All" 
    const all = document.getElementById("all");
    all.addEventListener("click", function () {
      const works = document.getElementsByClassName("workImg");

      // Affiche tous les travaux
      Array.from(works).forEach((work) => {
        work.style.display = "block";
      });
    });
  });
