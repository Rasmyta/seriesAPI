"use strict";

var requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

let api_key = "408cd1ef35641ece9a3c19864ce754b4";
let title = "";
let genre = "";
let page = 1;
let subtitle = document.querySelector("#subtitle");
let title_inicio = "Descubre TV";
let subtitle_txt = "Lo más popular en televisión";

// Inicio de la pagina. Muestra las series mas populares de todos los géneros
document.addEventListener("DOMContentLoaded", async () => {
    $("#section__list").show();
    $(".serie").hide();
    title = title_inicio;
    subtitle.innerHTML = subtitle_txt;
    generarLista(genre, page = 1, title);
    pagination(genre);
});

// Genera las listas por género al hacer click en menu.
document.querySelector(".nav__list").addEventListener("click", async (e) => {
    $("#section__list").show();
    $(".serie").hide();
    let section = document.querySelector("#section__list");
    subtitle.innerHTML = "";

    if (e.target.closest("a[href='#inicio']")) {
        genre = "";
        title = title_inicio;
        subtitle.innerHTML = subtitle_txt;
        document.body.style.background = "#5fc7ea";
        section.style.background = "#5fc7ea";
    } else if (e.target.closest("a[href='#1']")) {
        genre = 10759;
        title = "Acción & Aventura";
        document.body.style.background = "#e6d068";
        section.style.background = "#e6d068";
    } else if (e.target.closest("a[href='#2']")) {
        genre = 16;
        title = "Animación";
        document.body.style.background = "#e68568";
        section.style.background = "#e68568";
    } else if (e.target.closest("a[href='#3']")) {
        genre = 35;
        title = "Comedia";
        document.body.style.background = "#68e6ac";
        section.style.background = "#68e6ac";
    } else if (e.target.closest("a[href='#4']")) {
        genre = 18;
        title = "Drama";
        document.body.style.background = "#5fc7ea";
        section.style.background = "#5fc7ea";
    } else if (e.target.closest("a[href='#5']")) {
        genre = 9648;
        title = "Misterio";
        document.body.style.background = "#e6d068";
        section.style.background = "#e6d068";
    }

    generarLista(genre, page = 1, title);
    pagination(genre);
});

// Genera el contenido de una serie.
document.querySelector("#wrapper").addEventListener("click", async (e) => {
    document.body.style.background = "#5fc7ea";

    if (e.target.closest("a[href='#serie']")) {
        $("#section__list").hide();
        $(".serie").show();

        let id_serie = e.target.closest("article").id;
        let url = "https://api.themoviedb.org/3/tv/" + id_serie + "?api_key=" + api_key + "&language=es&append_to_response=credits";
        let res = await fetch(url, requestOptions);
        let data = await res.json();

        document.querySelector(".serie").id = id_serie;
        document.querySelector("#serie_name").innerHTML = data.name;
        document.querySelector("#original_name span").innerHTML = data.original_name;
        document.querySelector("div#tmdb p.rating").innerHTML = data.vote_average;
        document.querySelector("div#tmdb p.ratings").innerHTML = data.vote_count;
        document.querySelector("#serie_year").innerHTML = data.first_air_date != null ? data.first_air_date.substring(0, 4) : "";
        document.querySelector("#serie_genres").innerHTML = getGenres(data.genres);
        document.querySelector("#serie_poster img").src =  data.poster_path != null ? "https://image.tmdb.org/t/p/original/" + data.poster_path : "./img/noimage.png";
        document.querySelector("#overview_text").innerHTML = data.overview;
        document.querySelector("#creator span").innerHTML = getCreators(data.created_by);
        appendNetworks(document.querySelector("#networks_logo"), data.networks);
        document.querySelector("#status span").innerHTML = data.status == "Ended" ? "finalizado" : "volverá a emitirse";
        appendVideos(id_serie);
        appendSeasons(id_serie);
        appendComments(id_serie);
        getVotesMediaBD(id_serie); // datos desde la BD
    }

});


// Añade un nuevo comentario
document.querySelector("#form_comentario").addEventListener("submit", async (e) => {
    e.preventDefault();

    let id_serie = document.querySelector(".serie").id;
    let formData = new FormData(e.target);
    formData.append("id_serie", id_serie);
    formData.append("action", "newComentario");

    let res = await fetch("Controller/controller.php", {
        method: "POST",
        body: formData,
    });
    let data = await res.text(); // devuelve 1 si el comentario se ha insertado

    if (data == 1) {
        document.querySelector(".popup__close").click(); // cerramos el modal
        appendComments(id_serie); // refrescamos el area de las reseñas
        getVotesMediaBD(id_serie); // refrescamos la media
    }
});

document.querySelector("#light-pagination").addEventListener("click", async () => {
    page = document.querySelector("#light-pagination li.active span").innerHTML;
    generarLista(genre, page, title);
});

document.querySelector("#light-pagination").addEventListener("click", function () {
    $("html, body").animate({
        scrollTop: 0
    }, "slow");
});

async function generarLista(genre, page, title) {
    let url = "https://api.themoviedb.org/3/discover/tv?api_key=" + api_key + "&with_genres=" + genre + "&page=" + page + "&language=es";
    let res = await fetch(url, requestOptions);
    let data = await res.json();

    let article = document.querySelector("#base article");
    let wrapper = document.querySelector("#wrapper");
    wrapper.innerHTML = ""; // limpiamos el contenido
    document.querySelector("#list__title").innerHTML = title;

    // Recorremos todas las series de una pagina
    for (let i = 0; i < data.results.length; i++) {
        if (data.results[i].vote_average != 0 && data.results[i].overview != "") {
            let poster = data.results[i].poster_path != null; // comprobamos si la serie tiene el poster
            let clone = article.cloneNode(true); // clonamos el 'article' con todo su arbol
            clone.id = data.results[i].id;
            //clone.querySelector(".serie_url").href += data.results[i].id;
            clone.querySelector(".title").innerHTML = data.results[i].name;
            clone.querySelector(".overview").innerHTML = data.results[i].overview;
            clone.querySelector(".image__wrapper img").src = poster ? "https://image.tmdb.org/t/p/w185/" + data.results[i].poster_path : "./img/noimage.png";
            clone.querySelector(".vote_average").innerHTML = data.results[i].vote_average;
            wrapper.appendChild(clone);
        }
    }
}

// Devuelve la lista con los géneros de la serie
function getGenres(arr) {
    let result = [];
    for (let obj in arr) {
        result.push(arr[obj].name);
    }
    return result.join(", ");
}

// Devuelve la lista con los creadores de la serie
function getCreators(arr) {
    let result = [];
    for (let obj in arr) {
        result.push(arr[obj].name);
    }
    return result.join(", ");
}

// Muestra los canales donde se puede ver la serie
function appendNetworks(wrapper, arr) {
    wrapper.innerHTML = "";
    for (let obj in arr) {
        let img = document.createElement("img");
        img.src = "https://image.tmdb.org/t/p/original/" + arr[obj].logo_path;
        wrapper.appendChild(img);
    }
}

// Muestra el primer video de una serie
async function appendVideos(id_serie) {
    let url = "https://api.themoviedb.org/3/tv/" + id_serie + "/videos?api_key=" + api_key;
    let res = await fetch(url, requestOptions);
    let data = await res.json();

    let video = data.results[0] != null;
    document.querySelector("iframe").src = video ? "https://www.youtube.com/embed/" + data.results[0].key : "";
}

// Muestra las temporadas de una serie
async function appendSeasons(id_serie) {
    let url = "https://api.themoviedb.org/3/tv/" + id_serie + "?api_key=" + api_key + "&language=es";
    let res = await fetch(url, requestOptions);
    let data = await res.json();

    let temporadas_wrapper = document.querySelector("#temporadas_wrapper");
    temporadas_wrapper.innerHTML = "";

    for (var i = data.seasons.length - 1; i >= 0; i--) {
        let season = data.seasons[i];
        let temp_wrapper = document.createElement("div");
        let img = document.createElement("img");
        let div = document.createElement("div");
        let h3 = document.createElement("h3");
        let p = document.createElement("p");
        if (season.poster_path != null) {
            img.src = "https://image.tmdb.org/t/p/w154/" + season.poster_path;
            temp_wrapper.appendChild(img);
        }
        h3.innerHTML = season.name;
        p.innerHTML = season.air_date.substring(0, 4) + " | " + season.episode_count + " episodios";
        div.appendChild(h3);
        div.appendChild(p);
        temp_wrapper.appendChild(div);
        temporadas_wrapper.appendChild(temp_wrapper);
    }
}

// Muestra los comentarios desde la BD
async function appendComments(id_serie) {
    let data = await getComentariosDB(id_serie);
    let comentarios_wrapper = document.querySelector("#comentarios_wrapper");
    let coment_num = document.querySelector("#coment_num");
    coment_num.innerHTML = data.length;
    comentarios_wrapper.innerHTML = "";

    if (data.length > 0) {
        let coment_wrapper = document.createElement("div");
        let p1 = document.createElement("p");
        p1.innerHTML = "&#11088; " + data[0].nota + "<span>/10 &nbsp;(" + data[0].nombre + ")</span>";
        coment_wrapper.appendChild(p1);
        let p2 = document.createElement("p");
        p2.innerHTML = data[0].comentario;
        coment_wrapper.appendChild(p2);
        comentarios_wrapper.appendChild(coment_wrapper);
    }

    if (data.length > 1) {
        let ver_todos_coment = document.createElement("button");
        ver_todos_coment.id = "ver_todos_coment";
        ver_todos_coment.innerHTML = "Ver todas &#8594;";
        comentarios_wrapper.appendChild(ver_todos_coment);
        appendAllComments(ver_todos_coment, data);
    }
}

// Muestra todos los comentarios.
async function appendAllComments(button, data) {
    button.addEventListener("click", async () => {
        let comentarios_wrapper = document.querySelector("#comentarios_wrapper");
        comentarios_wrapper.innerHTML = "";

        for (let i = 0; i < data.length; i++) {
            let coment_wrapper = document.createElement("div");
            let p1 = document.createElement("p");
            p1.innerHTML = "&#11088; " + data[i].nota + "<span>/10 &nbsp;(" + data[i].nombre + ")</span>";
            coment_wrapper.appendChild(p1);
            let p2 = document.createElement("p");
            p2.innerHTML = data[i].comentario;
            coment_wrapper.appendChild(p2);
            comentarios_wrapper.appendChild(coment_wrapper);
        }
    });
}

// Calcula la media de los votos desde BD y muestra en la pagina.
async function getVotesMediaBD(id_serie) {
    let data = await getComentariosDB(id_serie);
    let average = data
        .map(obj => obj.nota) // quedamos solo con las notas
        .reduce((suma, nota, index, array) => { // calculamos la media
            suma += nota;
            if (index === array.length - 1) {
                return suma / array.length;
            } else {
                return suma;
            }
        }, 0);
    document.querySelector("div#descubre_tv p.rating").innerHTML = Number.isInteger(average) ? average : average.toFixed(1);
    document.querySelector("div#descubre_tv p.ratings").innerHTML = data.length;
}

// Devuelve los comentarios de una serie desde BD 
async function getComentariosDB(id_serie) {
    let formData = new FormData();
    formData.append("id_serie", id_serie);
    formData.append("action", "verComentarios");

    let res = await fetch("Controller/controller.php", {
        method: "POST",
        body: formData
    });
    let data = JSON.parse(await res.text());
    return data;
}

// Devuelve el numero de las paginas de un TV género
async function getTotalPages(genre_id) {
    let url = "https://api.themoviedb.org/3/discover/tv?api_key=" + api_key + "&with_genres=" + genre_id + "&language=es";
    let res = await fetch(url, requestOptions);
    let data = await res.json();
    return data.total_pages;
}


// Uso de la libreria 'simplePagination'
async function pagination(genre_id) {
    let total_pages = await getTotalPages(genre_id);
    $('#light-pagination').pagination({
        // Total number of items that will be used to calculate the pages.
        items: total_pages,
        // Number of items displayed on each page.
        itemsOnPage: 1,
        // If specified, items and itemsOnPage will not be used to calculate the number of pages.
        pages: 0,
        // How many page numbers should be visible while navigating. Minimum allowed: 3 (previous, current & next)
        displayedPages: 5,
        // How many page numbers are visible at the beginning/ending of the pagination.
        edges: 3,
        // Enables start/end edge
        useStartEdge: true,
        useEndEdge: true,
        // Which page will be selected immediately after init.
        currentPage: 0,
        // Uses anchor links or spans
        useAnchors: true,
        // A string used to build the href attribute, added before the page number.
        hrefTextPrefix: "#page-",
        // Another string used to build the href attribute, added after the page number.
        hrefTextSuffix: '',
        // Text to be display on the previous button.
        prevText: "Prev",
        // Text to be display on the next button.
        nextText: "Next",
        // Ellipse Character
        ellipseText: '&hellip;',
        ellipsePageSet: true,
        // list style
        listStyle: '',
        // The class of the CSS theme:
        // "light-theme", "compact-theme", and "dark-theme"
        cssStyle: "light-theme",
        // Set to false if you don't want to select the page immediately after click.
        selectOnClick: true,
        // Next button at front.
        nextAtFront: false,
        // Inverts page order
        invertPageOrder: false
    });
}