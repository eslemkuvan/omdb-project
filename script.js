const API_KEY = "917e736a";
const BASE_URL = "https://www.omdbapi.com/";
const STORAGE_KEY = "omdb-last-search";

const form = document.getElementById("searchForm");
const input = document.getElementById("movieInput");
const message = document.getElementById("message");

const titleEl = document.getElementById("movieTitle");
const yearEl = document.getElementById("movieYear");
const genreEl = document.getElementById("movieGenre");
const directorEl = document.getElementById("movieDirector");
const posterEl = document.getElementById("moviePoster");
const ratingEl = document.getElementById("movieRating");
const runtimeEl = document.getElementById("movieRuntime");
const plotEl = document.getElementById("moviePlot");

const movieCard = document.getElementById("movieCard");

function showMessage(text, type = "error") {
  message.textContent = text;
  message.className = `message ${type}`;
  message.classList.remove("hidden");
}

function hideMessage() {
  message.textContent = "";
  message.className = "message hidden";
}

function hideMovieCard() {
  movieCard.classList.add("hidden");
}

function showMovieCard() {
  movieCard.classList.remove("hidden");
}

function fillMovieData(data) {
  titleEl.textContent = data.Title || "N/A";
  yearEl.textContent = data.Year || "N/A";
  genreEl.textContent = data.Genre || "N/A";
  directorEl.textContent = data.Director || "N/A";
  ratingEl.textContent = data.imdbRating || "N/A";
  runtimeEl.textContent = data.Runtime || "N/A";
  plotEl.textContent = data.Plot || "N/A";

  if (data.Poster && data.Poster !== "N/A") {
    posterEl.src = data.Poster;
    posterEl.alt = `${data.Title} poster`;
  } else {
    posterEl.src = "";
    posterEl.alt = "Poster not available";
  }
}

async function fetchMovie(movieName) {
  const trimmedName = movieName.trim();

  if (!trimmedName) {
    hideMovieCard();
    showMessage("Please enter a movie name.", "error");
    return;
  }

  showMessage("Loading...", "success");

  try {
    const res = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(trimmedName)}`
    );

    const data = await res.json();

    if (data.Response === "False") {
      hideMovieCard();
      showMessage("Movie not found.", "error");
      return;
    }

    fillMovieData(data);
    showMovieCard();
    showMessage(`Showing result for "${data.Title}".`, "success");

    localStorage.setItem(STORAGE_KEY, trimmedName);
  } catch (error) {
    hideMovieCard();
    showMessage("Error fetching data!", "error");
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchMovie(input.value);
});

document.querySelectorAll(".chip").forEach((button) => {
  button.addEventListener("click", () => {
    const movieTitle = button.dataset.title;
    input.value = movieTitle;
    fetchMovie(movieTitle);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const lastSearch = localStorage.getItem(STORAGE_KEY);

  if (lastSearch) {
    input.value = lastSearch;
    fetchMovie(lastSearch);
  }
});
