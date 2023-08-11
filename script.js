const body = document.querySelector('body');
const movies = document.querySelector('.movies');
const btnTheme = document.querySelector('.btn-theme');
const header = document.querySelector('.header');
const headerTitle = document.querySelector('.header__title');
const moviesContainer = document.querySelector('.movies-container');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const input = document.querySelector('.input');
const imgLogo = document.querySelector('img');

const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightVideo = document.querySelector('.highlight__video');
const highlightVideoLink = document.querySelector('.highlight__video-link');

const modalHidden = document.querySelector('.modal');
const modalBody = document.querySelector('.modal__body');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalGenres = document.querySelector('.modal__genres');
const modalClose = document.querySelector('.modal__close');

input.placeholder = 'Digite o nome do filme';

let initialMovies = [];
let movieList = [];
let start = 0;
let end = 5;
const movieTotal = 18;

async function startMovie() {
    await fetchMovie();
    criandoDiv();
}

async function criandoDiv() {

    movies.innerHTML = '';

    for (let i = start; i <= end && movieTotal; i++) {

        const divMovie = document.createElement('div');
        divMovie.classList.add('movie');
        divMovie.style.backgroundImage = `url(${movieList[i].poster_path})`;

        const divMovieInfo = document.createElement('div');
        divMovieInfo.classList.add('movie__info');

        const spanMovieTitle = document.createElement('span');
        spanMovieTitle.classList.add('movie__title');
        spanMovieTitle.textContent = movieList[i].title;

        const spanMovieRating = document.createElement('span');
        spanMovieRating.classList.add('movie__rating');
        spanMovieRating.textContent = movieList[i].vote_average.toFixed(1);

        const imgStar = document.createElement('img');
        imgStar.src = './assets/estrela.svg';
        imgStar.style.paddingBottom = '3px';

        divMovieInfo.appendChild(spanMovieTitle);
        divMovieInfo.appendChild(spanMovieRating);
        spanMovieRating.appendChild(imgStar);
        divMovie.appendChild(divMovieInfo);
        movies.appendChild(divMovie);

        divMovie.addEventListener('click', async () => {
            modalGenres.innerHTML = '';
            let id = await filmeModal(movieList[i].id);
            modalHidden.classList.remove('hidden');
            modalTitle.textContent = id.title;
            modalImg.src = id.backdrop_path;
            modalDescription.textContent = id.overview;
            modalAverage.textContent = id.vote_average.toFixed(1);

            let arrayGenero = id.genres;

            for (let n = 0; n < arrayGenero.length; n++) {
                const spanGenero = document.createElement('span');
                spanGenero.classList.add('modal__genre');
                spanGenero.textContent = arrayGenero[n].name;
                modalGenres.appendChild(spanGenero);
            }
        });
    }
}
startMovie();

function atualizarNext() {
    start += 6;
    end += 6;

    if (end >= movieTotal) {
        start = 0;
        end = 5;
    }
};

function atualizarPrev() {
    start -= 6;
    end -= 6;

    if (end < 0) {
        start = 12
        end = 17;
    }
};

btnNext.addEventListener('click', () => {
    atualizarNext();
    criandoDiv();
});
btnPrev.addEventListener('click', () => {
    atualizarPrev();
    criandoDiv();
});

modalClose.addEventListener('click', () => {
    modalHidden.classList.add('hidden');
});
modalBody.addEventListener('click', () => {
    modalHidden.classList.add('hidden');
});

function pesquisar() {
    input.addEventListener('keydown', async (event) => {
        if (event.keyCode === 13) {
            let query = input.value.trim();
            if (query) {
                let endpoint = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${query}`;
                axios.get(endpoint)
                    .then(response => {
                        movieList = response.data.results;
                        criandoDiv();
                    })
                    .catch(error => {
                        console.log(error.data);
                    });
                input.value = '';
            } else if (!input.value) {
                movieList = initialMovies;
                start = 0;
                end = 5;
                criandoDiv();
            }
        }
    })
}
pesquisar();

let geral = [];
let filme = '';

async function filmeDestaque() {
    geral = await geralFilme();
    filme = await filmeDia();

    highlightVideo.style.backgroundImage = `url(${geral.backdrop_path})`;
    highlightVideo.style.backgroundSize = 'cover';
    highlightTitle.textContent = geral.title;
    highlightRating.textContent = geral.vote_average.toFixed(1);

    const highlightVideoDark = document.createElement('div');
    highlightVideoDark.classList.add('highlight__video__dark');
    highlightVideo.appendChild(highlightVideoDark);

    const genresArray = geral.genres.map(genre => genre.name);
    highlightGenres.textContent = genresArray.join(', ');
    highlightLaunch.textContent = new Date(geral.release_date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
    highlightDescription.textContent = geral.overview;
    let key = filme[0].key;
    highlightVideoLink.href = "https://www.youtube.com/watch?v=" + key;
}
filmeDestaque();

let contador = 0;

function colors() {
    const rootColor = document.documentElement;
    if (contador === 0) {
        rootColor.style.setProperty('--background', '#1b2028');
        rootColor.style.setProperty('--input-color', '#fff');
        rootColor.style.setProperty('--text-color', '#fff');
        rootColor.style.setProperty('--bg-secondary', '#2D3440');
        rootColor.style.setProperty('--bg-modal', '#2D3440');

        btnTheme.src = './assets/dark-mode.svg';
        imgLogo.src = './assets/logo.svg';
        btnPrev.src = './assets/arrow-left-light.svg';
        btnNext.src = './assets/arrow-right-light.svg';
        modalClose.src = './assets/close.svg';

        contador = 1;
    }
    else {
        rootColor.style.setProperty('--background', '#fff');
        rootColor.style.setProperty('--input-color', '#979797');
        rootColor.style.setProperty('--text-color', '#1b2028');
        rootColor.style.setProperty('--bg-secondary', '#ededed');
        rootColor.style.setProperty('--bg-modal', '#ededed');

        btnTheme.src = './assets/light-mode.svg';
        imgLogo.src = './assets/logo-dark.png';
        btnPrev.src = './assets/arrow-left-dark.svg';
        btnNext.src = './assets/arrow-right-dark.svg';
        modalClose.src = './assets/close-dark.svg';

        contador = 0;
    }
}
btnTheme.addEventListener('click', colors);