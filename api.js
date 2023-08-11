const api = axios.create({
    baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev/3',
    timeout: 10000,
    headers: { 'Content-Type': 'Application/json' }
});

async function fetchMovie() {
    try {
        const response = await api.get('/discover/movie?language=pt-BR&include_adult=false');
        initialMovies = response.data.results;
        movieList = initialMovies;
    }
    catch (error) {
        console.log(error.response.data);
    }
}

async function geralFilme() {
    try {
        const response = await api.get('/movie/436969?language=pt-BR');
        return response.data;
    }
    catch (error) {
        console.log(error.data);
    }
}

async function filmeDia() {
    try {
        const response = await api.get('/movie/436969/videos?language=pt-BR');
        return response.data.results;
    }
    catch (error) {
        console.log(error.data);
    }
}

async function filmeModal(id) {
    try {
        const response = await api.get(`/movie/${id}?language=pt-BR`);
        return response.data;
    }
    catch (error) {
        console.log(error.response.data);
    }
}