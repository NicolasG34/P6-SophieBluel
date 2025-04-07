const apiURL = "http://localhost:5678/api/";

//Récupération des travaux depuis l'API
fetch(apiURL + "works")
  .then((response) => { return response.json() })
  .then((data) => {
    const gallery = document.querySelector(".gallery");
    data.forEach(work => {
      fillMainGallery(work, gallery);
    });
  });

//Remplissage de la gallerie du site depuis l'api
const fillMainGallery = (work, gallery) => {
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
}

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
        const works = document.getElementsByClassName("workImg");
        Array.from(works).forEach((work) => {
          const workCatId = work.dataset.idcat;
          const filterCatId = event.target.dataset.id;
          if (filterCatId !== workCatId) {
            work.style.display = "none";
          }
          else {
            work.style.display = "block";
          }
        })
      })
    });
    //Actionnement du filtre All
    const all = document.getElementById("all");
    all.addEventListener("click", function (event) {
      const works = document.getElementsByClassName("workImg");
      console.log(works);
      Array.from(works).forEach((work) => {
        work.style.display = "block";
      })

    })
  })


