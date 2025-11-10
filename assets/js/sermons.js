/* ================================
   LOAD DATA
================================ */
let sermons = [];
let series = [];
let speakers = [];

const sermonsGrid     = document.getElementById("sermonsGrid");
const searchInput     = document.getElementById("searchInput");
const seriesFilter    = document.getElementById("seriesFilter");
const speakerFilter   = document.getElementById("speakerFilter");
const topicFilter     = document.getElementById("topicFilter");
const clearBtn        = document.getElementById("clearBtn");
const resultCount     = document.getElementById("resultCount");

/* Featured Sermon Elements */
const featuredPlayer  = document.getElementById("player");
const featuredBadge   = document.querySelector(".section-badge");
const featuredTitle   = document.querySelector(".sermon-title");
const featuredDesc    = document.querySelector(".sermon-description");
const featuredDate    = document.querySelector(".sermon-date");
const featuredSeries  = document.querySelector(".sermon-series");
const featuredSpeaker = document.querySelector(".speaker-info h4");
const featuredAvatar  = document.querySelector(".speaker-avatar img");
const btnYouTube      = document.getElementById("watchOnYouTube");
const btnAudio        = document.getElementById("downloadAudio");
const btnNotes        = document.getElementById("sermonNotes");
const spotifyLink     = document.querySelector(".platform-link.spotify");

let youtubePlayerInstance = null;

/* Load JSON */
fetch("../assets/data/sermons.json")
    .then(res => res.json())
    .then(data => {
        sermons  = data.sermons;
        series   = data.series;
        speakers = data.speakers;

        populateDropdowns();
        renderSermons(sermons);
        loadFeatured(sermons[0]); // latest sermon
    });

/* ================================
   POPULATE DROPDOWNS
================================ */
function populateDropdowns() {

    series.forEach(item => {
        seriesFilter.innerHTML += `<option value="${item.id}">${item.name}</option>`;
    });

    speakers.forEach(item => {
        speakerFilter.innerHTML += `<option value="${item.name}">${item.name}</option>`;
    });

    // topic list from unique sermon topics
    const topics = [...new Set(sermons.map(s => s.topic))];
    topics.forEach(topic => {
        topicFilter.innerHTML += `<option value="${topic}">${topic}</option>`;
    });
}

/* ================================
   RENDER SERMON CARDS
================================ */
function renderSermons(list) {

    sermonsGrid.innerHTML = "";

    list.forEach(sermon => {
        sermonsGrid.innerHTML += `
        <div class="sermon-card" data-id="${sermon.id}">
            <div class="sermon-image">
                <img src="${sermon.artwork}" alt="${sermon.title}">
                <div class="play-overlay"><div class="play-icon">▶</div></div>
            </div>
            <div class="sermon-content">
                <h3 class="sermon-title">${sermon.title}</h3>
                <p class="sermon-meta">${sermon.speaker} • ${formatDate(sermon.date)}</p>
            </div>
        </div>`;
    });

    document.querySelectorAll(".sermon-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.getAttribute("data-id");
            const sermon = sermons.find(s => s.id === id);
            loadFeatured(sermon);
            scrollToFeatured();
        });
    });

    resultCount.textContent = list.length;
}

/* ================================
   UPDATE FEATURED SERMON
================================ */
function loadFeatured(sermon) {

    featuredBadge.textContent = "Selected Message";

    featuredTitle.textContent   = sermon.title;
    featuredDesc.textContent    = sermon.description;
    featuredDate.textContent    = formatDate(sermon.date);
    featuredSeries.textContent  = sermon.series;
    featuredSpeaker.textContent = sermon.speaker;
// find matching speaker for this sermon
    const speakerObj = speakers.find(s => s.name === sermon.speaker);

    featuredAvatar.src = speakerObj?.avatar || "../assets/images/default-avatar.jpg";

    btnYouTube.href = `https://youtube.com/watch?v=${sermon.youtubeId}`;
    btnAudio.href   = sermon.audioUrl;
    btnNotes.href   = sermon.notes;
    spotifyLink.href = sermon.spotifyUrl;

    if (youtubePlayerInstance) {
        youtubePlayerInstance.loadVideoById(sermon.youtubeId);
    } else {
        youtubePlayerInstance = new YT.Player("player", {
            height: "390",
            width: "640",
            videoId: sermon.youtubeId
        });
    }
}

/* Scroll to featured sermon */
function scrollToFeatured() {
    document.querySelector(".featured-sermon").scrollIntoView({ behavior: "smooth" });
}

/* ================================
   FILTER LOGIC
================================ */
function applyFilters() {

    const searchVal  = searchInput.value.toLowerCase();
    const fSeries    = seriesFilter.value;
    const fSpeaker   = speakerFilter.value;
    const fTopic     = topicFilter.value;

    const filtered = sermons.filter(s => (
        (fSeries === "all"  || s.series === fSeries) &&
        (fSpeaker === "all" || s.speaker === fSpeaker) &&
        (fTopic === "all"   || s.topic === fTopic) &&
        (s.title.toLowerCase().includes(searchVal) ||
         s.speaker.toLowerCase().includes(searchVal))
    ));

    renderSermons(filtered);
}

/* Events */
searchInput.addEventListener("input", applyFilters);
seriesFilter.addEventListener("change", applyFilters);
speakerFilter.addEventListener("change", applyFilters);
topicFilter.addEventListener("change", applyFilters);

clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    seriesFilter.value = "all";
    speakerFilter.value = "all";
    topicFilter.value = "all";
    renderSermons(sermons);
});

/* Helpers */
function formatDate(dateStr) {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
}
