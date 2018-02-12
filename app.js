const request = superagent;
// axios
const api_endpoint_genres = 'https://api.themoviedb.org/3/genre/movie/list?api_key=308ef47d4177eecfbb266f41f2617b5f&language=en-US';
const api_endpoint_movies = 'https://api.themoviedb.org/3/discover/movie?api_key=308ef47d4177eecfbb266f41f2617b5f&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=';

const api_endpoint_movie = 'https://api.themoviedb.org/3/movie/';
const api_endpoint_key = '?api_key=308ef47d4177eecfbb266f41f2617b5f&language=en-US';

const api_endpoint_posters = 'http://image.tmdb.org/t/p/w200//';



function loadPage() {
    $('#inicio').click(paintButtons);
    // $('.button-gnr').click(painMovies);
}

function paintButtons(e) {
    var $button;
    var containButtons = $('#buttons');
    containButtons.empty(); //limpiamos la seccion donde se pintan los generos
    request.get(api_endpoint_genres).then(function (response) { //response es de donde vamos a extraer información
        // console.log(response);
        var genresMovie = response.body.genres
        // console.log(genresMovie);         

        genresMovie.forEach(element => {
            // console.log(element);

            var genresId = element.id; // extraemos los id del genero
            var movieName = element.name; //extraemos los nombres de los generos


            $button = $('<input>').attr('type', 'button').attr('value', movieName).attr('data-movies', genresId).addClass('button-gnr');
            //por cada interaccion se crear un elemento se le asigna el value del nombre del genero y un data del id del genero    

            containButtons.append($button);
            //  se agregan los botones al contenedor   

        });

        $button.each(element => {
            $('.button-gnr').click(paintTitleMovies);
            //Se agrega un evento click a cada elemento boton con la funcion que pinta la coleccion de peliculas por genero
        });
    });
}


function paintTitleMovies(event) {
    var titles;

    var containerTitles = $('#titles'); //traer contenedor de peliculas
    containerTitles.empty();

    var moviesId = this.dataset.movies;
    //obtenemo el data-movies de cada boton que es el id de los generos
    // console.log(movieId);
    var url_list_genres = api_endpoint_movies + moviesId;
    //concatenamos nuestro enpoint de movies con nuestro id de genero 
    // console.log(url_list_genres);
    request.get(url_list_genres).then(function (response) {
        var movies = response.body.results;
        // console.log(movies);
        // entrar a title y a id
        movies.forEach(element => {
            // console.log(element);          
            var movieTitle = element.title;
            var movieId = element.id;
            //  console.log(movieId);


            titles = $('<h4 />').text(movieTitle).attr('data-movie', movieId).addClass('title');
            containerTitles.append(titles);
            // crear elemento h2 para titulos                         
        });

        titles.each(element => {
            $('.title').click(paintInfoMovie);
        });
    });
}


function paintInfoMovie(event) {

    var infoMovie = $('#info-movie');
    infoMovie.empty();
    // api_endpoint_info + movieId + api_endpoint_key    ruta para pintar info de cada pelicula
    var movieIds = this.dataset.movie;
    //  console.log(movieIds);

    var api_endpoint_info = api_endpoint_movie + movieIds + api_endpoint_key;

    request.get(api_endpoint_info).then(function (response) {
        //  console.log(response.body);     

        var movieBody = response.body;

        var posterPath = movieBody.poster_path

        var moviePoster = api_endpoint_posters + posterPath;
        var movieDate = movieBody.release_date;
        var movieTitle = movieBody.title;
        var movieTagline = movieBody.tagline;
        var movieOverview = movieBody.overview
        var moviePage = movieBody.homepage;


        console.log(moviePoster);
        console.log(movieDate);
        console.log(movieTitle);
        console.log(movieTagline);
        console.log(movieOverview);
        console.log(moviePage);
        // soundtrack   

        //   crear elementos
        // agregar contenido
        // append a conteneores

    });
}


$(document).ready(loadPage);

// referencias emc6 
// <img src="${movie.propiedad}" class="clase">}
// <h2>${movie.propiedad}</h2>
// todo el output entre comillas ``