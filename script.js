const API_KEY = "917e736a"; 
const BASE_URL = "https://www.omdbapi.com/";

const form = document.getElementById("searchForm");
const input = document.getElementById("movieInput");
const message = document.getElementById("message");

const titleEl = document.getElementById("movieTitle");
const yearEl = document.getElementById("movieYear");
const genreEl = document.getElementById("movieGenre");
const directorEl = document.getElementById("movieDirector");
const posterEl = document.getElementById("moviePoster");

const movieCard = document.getElementById("movieCard");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const movieName = input.value;

  message.textContent = "Loading...";

  try {
    const res = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&t=${movieName}`
    );

    const data = await res.json();

    if (data.Response === "False") {
      message.textContent = "Movie not found!";
      movieCard.style.display = "none";
      return;
    }

    titleEl.textContent = data.Title;
    yearEl.textContent = data.Year;
    genreEl.textContent = data.Genre;
    directorEl.textContent = data.Director;
    posterEl.src = data.Poster;

    movieCard.style.display = "block";
    message.textContent = "";
  } catch (error) {
    message.textContent = "Error fetching data!";
  }
});
