const apiURL = "http://localhost:5678/api/";

fetch(apiURL + "works")
.then((response) => { return response.json() })
.then((data) => {
    const gallery = document.querySelector(".gallery");
    data.forEach(work => {
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figCaption = document.createElement("figcaption");

        image.src= work.imageUrl;
        image.alt= work.title;
        figCaption.innerHTML= work.title;

        figure.appendChild(image);
        figure.appendChild(figCaption);
        gallery.appendChild(figure);
    });
    console.log(gallery);

 })

 fetch(apiURL + "categories")
 .then((response) => { return response.json() })
.then((data) => {
    const categories = document.querySelector(".filters");
    //const all = document.createElement("all");
    data.forEach(category => {
        const filter = document.createElement("div");
        filter.classList.add("filter");
        filter.innerHTML =category.name;
        //filter.setAttribute("name", "filter");

        //filter.src= category.name;
        //const names = filter.innerText;
        //names.src=category.name; 

        categories.appendChild(filter);
    });
    console.log(categories);
})




