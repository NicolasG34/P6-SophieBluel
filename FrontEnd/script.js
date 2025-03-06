const apiURL = "http://localhost:5678/api/";

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
        console.log(gallery);

    })
fetch(apiURL + "categories")
    .then((response) => { return response.json() })
    .then((data) => {
        const categories = document.querySelector(".filters");
        data.forEach(category => {
            const filter = document.createElement("div");
            filter.classList.add("filter");
            filter.innerHTML = category.name;
            categories.appendChild(filter);
            filter.setAttribute("data-id", category.id);
            filter.addEventListener("click", function (event) {
                console.log(event);
                const works = document.getElementsByClassName("workImg");
                console.log(works);
                Array.from(works).forEach((work)=>{
                    const workCatId = work.dataset.idcat;
                    const filterCatId =event.target.dataset.id;
                    if (filterCatId !== workCatId){
                        work.style.display="none";
                        console.log("toto");
                    }
                })
            })
        });
        console.log(categories);
    })





/*.then((data) => {
    const categories = document.querySelector(".filters");
    const filters = []; // create a new array that will contain all filter
    data.forEach(category => {
        const filter = document.createElement("div");
        filter.classList.add("filter");
        filter.innerHTML = category.name;
        filter.dataset.categoryId = category.id; // Add category id as a data attribute
        categories.appendChild(filter);
        filters.push(filter); // push the element in the array
    });

    //add the listener after the elements are created.
    filters.forEach(filter => {
        filter.addEventListener("click", function() {
            const categoryId = this.dataset.categoryId;// get the category id
            const imageFiltrees = work.filter((idFiltre) => idFiltre.categoryId== categoryId);
            console.log(imageFiltrees);
        });
    })

    console.log(categories);
})*/

/*filter.addEventListener("click", function() {
    const imageFiltrees = work.filter((idFiltre) => category.id==work.categoryId);
})
console.log(imageFiltrees); */




