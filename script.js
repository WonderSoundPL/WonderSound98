let artists = JSON.parse(localStorage.getItem("artists")) || [];
let songs = JSON.parse(localStorage.getItem("songs")) || [];

function saveToLocalStorage() {
    localStorage.setItem("artists", JSON.stringify(artists));
    localStorage.setItem("songs", JSON.stringify(songs));
}

const countries = ["USA", "Polska", "UK", "Japonia", "Korea Płd.", "Chiny", "Niemcy"];

// Funkcja odświeżania listy artystów
function updateArtists() {
    let artistList = document.getElementById("artist-list");
    if (!artistList) return;
    artistList.innerHTML = "";

    artists.forEach(artist => {
        let li = document.createElement("li");
        let link = document.createElement("a");
        link.href = `artist.html?name=${encodeURIComponent(artist.name)}`;
        link.textContent = artist.name;
        li.appendChild(link);
        artistList.appendChild(li);
    });
}

// Funkcja odświeżania listy piosenek
function updateRanking() {
    let rankings = [...songs].sort((a, b) => b.totalStreams - a.totalStreams).slice(0, 10);
    let rankingList = document.getElementById("global-ranking");
    if (!rankingList) return;
    rankingList.innerHTML = "";

    rankings.forEach((song, index) => {
        let li = document.createElement("li");
        li.textContent = `#${index + 1} - ${song.title} (${song.artist}) - 🔥 ${song.totalStreams.toLocaleString()} odtworzeń`;
        rankingList.appendChild(li);
    });
}

// Aktualizacja rankingów krajowych
function updateCountryRankings() {
    let rankingList = document.getElementById("country-rankings");
    rankingList.innerHTML = "";

    countries.forEach(country => {
        let countrySongs = [...songs].sort((a, b) => b.countryStreams[country] - a.countryStreams[country]).slice(0, 5);

        let li = document.createElement("li");
        li.innerHTML = `<strong>${country}</strong>:<br> ${countrySongs.map(song => `${song.title} (${song.artist}) - ${song.countryStreams[country].toLocaleString()} odtw.`).join("<br>")}`;
        rankingList.appendChild(li);
    });
}

// Dodawanie artysty
document.getElementById("add-artist-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let artistName = document.getElementById("artist-name").value;

    artists.push({ name: artistName });
    saveToLocalStorage();
    updateArtists(); // <-- Teraz natychmiast odświeżamy listę!
    alert(`Dodano artystę: ${artistName}`);
    document.getElementById("add-artist-form").reset();
});

// Dodawanie piosenki
document.getElementById("add-song-form").addEventListener("submit", function (e) {
    e.preventDefault();
    let songTitle = document.getElementById("song-title").value;
    let songArtist = document.getElementById("song-artist").value;

    let songData = {
        title: songTitle,
        artist: songArtist,
        totalStreams: Math.floor(Math.random() * 10000000),
        countryStreams: {}
    };

    let remainingStreams = songData.totalStreams;
    countries.forEach((country, index) => {
        let countryShare = index === countries.length - 1 ? remainingStreams : Math.floor(Math.random() * remainingStreams / 2);
        songData.countryStreams[country] = countryShare;
        remainingStreams -= countryShare;
    });

    songs.push(songData);
    saveToLocalStorage();
    updateRanking(); // <-- Natychmiast odświeżamy listę rankingów!
    alert(`Dodano piosenkę: ${songTitle}`);
    document.getElementById("add-song-form").reset();
});

// Aktualizacja odtworzeń co 2 minuty
function updateStreams() {
    songs.forEach(song => {
        let newStreams = Math.floor(Math.random() *
