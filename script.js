const API_KEY = "917e736a";
const BASE_URL = "https://www.omdbapi.com/";
const STORAGE_KEY = "omdb-last-search";

const form = document.getElementById("searchForm");
const input = document.getElementById("movieInput");
const message = document.getElementById("message");
const movieCard = document.getElementById("movieCard");
const resultsList = document.getElementById("resultsList");

const titleEl = document.getElementById("movieTitle");
const yearEl = document.getElementById("movieYear");
const genreEl = document.getElementById("movieGenre");
const directorEl = document.getElementById("movieDirector");
const posterEl = document.getElementById("moviePoster");
const ratingEl = document.getElementById("movieRating");
const runtimeEl = document.getElementById("movieRuntime");
const plotEl = document.getElementById("moviePlot");

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

function hideResultsList() {
  resultsList.classList.add("hidden");
  resultsList.innerHTML = "";
}

function showResultsList() {
  resultsList.classList.remove("hidden");
}

function formatValue(value, fallbackText, iconClass) {
  if (!value || value === "N/A") {
    return `<span class="no-data"><i class="${iconClass}"></i> ${fallbackText}</span>`;
  }
  return value;
}

function fillMovieData(data) {
  titleEl.textContent = data.Title || "N/A";
  yearEl.textContent = data.Year || "N/A";
  genreEl.textContent = data.Genre || "N/A";
  directorEl.textContent = data.Director || "N/A";

  ratingEl.innerHTML = formatValue(
    data.imdbRating,
    "No rating available",
    "fa-solid fa-star"
  );

  runtimeEl.innerHTML = formatValue(
    data.Runtime,
    "Runtime not available",
    "fa-solid fa-clock"
  );

  plotEl.innerHTML = formatValue(
    data.Plot,
    "No plot information",
    "fa-solid fa-book-open"
  );

  if (data.Poster && data.Poster !== "N/A") {
    posterEl.src = data.Poster;
    posterEl.alt = `${data.Title} poster`;
    posterEl.style.display = "block";
  } else {
    posterEl.src = "";
    posterEl.alt = "Poster not available";
    posterEl.style.display = "none";
  }
}

function renderResults(movies) {
  resultsList.innerHTML = "";

  movies.forEach((movie) => {
    const poster =
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : "https://placehold.co/400x600/0f172a/e5e7eb?text=No+Poster";

    const card = document.createElement("article");
    card.className = "result-card";
    card.innerHTML = `
      <img src="${poster}" alt="${movie.Title} poster">
      <div class="result-card__body">
        <h3 class="result-card__title">${movie.Title}</h3>
        <p class="result-card__meta">${movie.Year} • ${movie.Type}</p>
      </div>
    `;

    card.addEventListener("click", () => {
      fetchMovieDetails(movie.imdbID);
    });

    resultsList.appendChild(card);
  });

  showResultsList();
}

async function fetchMovieList(searchText) {
  const trimmedName = searchText.trim();

  if (!trimmedName) {
    hideMovieCard();
    hideResultsList();
    showMessage("Please enter a movie name.", "error");
    return;
  }

  hideMovieCard();
  showMessage("Searching movies...", "success");

  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(trimmedName)}`
    );

    if (!response.ok) {
      throw new Error("Network error");
    }

    const data = await response.json();

    if (data.Response === "False") {
      hideMovieCard();
      hideResultsList();
      showMessage("No movies found.", "error");
      return;
    }

    renderResults(data.Search);
    showMessage(`Found ${data.Search.length} result(s). Select a movie.`, "success");
    localStorage.setItem(STORAGE_KEY, trimmedName);
  } catch (error) {
    hideMovieCard();
    hideResultsList();
    showMessage("Error fetching movie list!", "error");
    console.error(error);
  }
}

async function fetchMovieDetails(imdbID) {
  showMessage("Loading movie details...", "success");

  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`
    );

    if (!response.ok) {
      throw new Error("Network error");
    }

    const data = await response.json();

    if (data.Response === "False") {
      hideMovieCard();
      showMessage("Movie details not found.", "error");
      return;
    }

    fillMovieData(data);
    showMovieCard();
    showMessage(`Showing details for "${data.Title}".`, "success");
    movieCard.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    hideMovieCard();
    showMessage("Error fetching movie details!", "error");
    console.error(error);
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  fetchMovieList(input.value);
});

document.querySelectorAll(".chip").forEach(function (button) {
  button.addEventListener("click", function () {
    const movieTitle = button.dataset.title;
    input.value = movieTitle;
    fetchMovieList(movieTitle);
  });
});

window.addEventListener("DOMContentLoaded", function () {
  hideMovieCard();
  hideResultsList();

  const lastSearch = localStorage.getItem(STORAGE_KEY);
  if (lastSearch) {
    input.value = lastSearch;
    fetchMovieList(lastSearch);
  }
});
