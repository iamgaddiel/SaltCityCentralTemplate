// =====================
// GLOBAL STATE
// =====================
let allSermons = [];
let player;
let currentVideoId = null;
let filters = {
    series: "all",
    speaker: "all",
    topic: "all",
    search: ""
};
let sortBy = "newest";

function slugify(text) {
    return text.toLowerCase().replace(/\s+/g, "-");
}

function updateFilterCount() {
    const activeCount = Object.values(filters).filter(v => v !== "all" && v !== "").length;
    const clearBtn = document.getElementById("clearFilters");
    
    if (activeCount > 0) {
        clearBtn.classList.add("visible");
        clearBtn.style.display = "inline-flex";
    } else {
        clearBtn.classList.remove("visible");
        clearBtn.style.display = "none";
    }
}

function applyFilters() {
    let filtered = [...allSermons];

    // Filter by series
    if (filters.series !== "all") {
        filtered = filtered.filter(s => slugify(s.series) === filters.series);
    }

    // Filter by speaker
    if (filters.speaker !== "all") {
        filtered = filtered.filter(s => slugify(s.speaker) === filters.speaker);
    }

    // Filter by topic
    if (filters.topic !== "all") {
        filtered = filtered.filter(s => s.topic === filters.topic);
    }

    // Search filter
    if (filters.search.trim() !== "") {
        const keyword = filters.search.toLowerCase();
        filtered = filtered.filter(s =>
            s.title.toLowerCase().includes(keyword) ||
            s.description.toLowerCase().includes(keyword) ||
            s.speaker.toLowerCase().includes(keyword) ||
            s.series.toLowerCase().includes(keyword)
        );
    }

    // Apply sorting
    filtered = sortSermons(filtered, sortBy);

    renderAllSermons(filtered);
    updateSermonCount(filtered.length);
    updateFilterCount();
}

function sortSermons(sermons, sortType) {
    const sorted = [...sermons];
    
    switch(sortType) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'speaker':
            return sorted.sort((a, b) => a.speaker.localeCompare(b.speaker));
        default:
            return sorted;
    }
}

function updateSermonCount(count) {
    const countElement = document.getElementById("sermonCount");
    if (countElement) {
        countElement.textContent = count;
    }
}

function clearAllFilters() {
    filters = {
        series: "all",
        speaker: "all",
        topic: "all",
        search: ""
    };
    
    // Reset all filter buttons
    document.querySelectorAll(".filter-option").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.filter === "all") {
            btn.classList.add("active");
        }
    });
    
    // Clear search input
    const searchInput = document.getElementById("sermonSearch");
    if (searchInput) searchInput.value = "";
    
    applyFilters();
}

// =====================
// FETCH SERMON DATA
// =====================
async function fetchSermons() {
    try {
        const response = await fetch("../assets/data/sermons.json");
        const data = await response.json();

        allSermons = data.sermons;

        updateFeaturedSermon();     // show latest sermon
        renderAllSermons();         // populate grid
        initFilters();              // initialize filter buttons

    } catch (error) {
        console.error("Error loading sermons.json:", error);
    }
}

fetchSermons();

// =====================
// UPDATE FEATURED SERMON
// =====================
function updateFeaturedSermon(sermonData = null) {
    if (!allSermons.length) return;

    const featured = sermonData || allSermons[0];
    currentVideoId = featured.youtubeId;

    // Update text
    document.querySelector(".sermon-title").textContent = featured.title;
    document.querySelector(".sermon-description").textContent = featured.description;
    document.querySelector(".sermon-date").textContent = formatDate(featured.date);
    document.querySelector(".sermon-series").textContent = featured.series;

    // Update speaker information
    const speakerData = getSpeaker(featured.speaker);
    document.querySelector(".speaker-info h4").textContent = speakerData.name;
    document.querySelector(".speaker-info p").textContent = speakerData.role;
    document.querySelector(".speaker-avatar img").src = speakerData.avatar;

    // Update buttons
    document.getElementById("watchOnYouTube").onclick = () => window.open(
        `https://www.youtube.com/watch?v=${featured.youtubeId}`,
        "_blank"
    );

    document.getElementById("downloadAudio").onclick = () => {
        window.open(featured.audioUrl, "_blank");
    };

    document.getElementById("sermonNotes").onclick = () => {
        window.open(featured.notes, "_blank");
    };

    loadVideo(featured.youtubeId);
    
    // Scroll to featured section smoothly
    document.querySelector('.featured-sermon').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// =====================
// RENDER SERMON GRID
// =====================
function renderAllSermons(list = allSermons) {
    const grid = document.getElementById("sermonsGrid");
    grid.innerHTML = "";

    if (list.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-medium-grey); padding: var(--spacing-xl);">No sermons found matching your criteria.</p>';
        return;
    }

    list.forEach(sermon => {
        const card = document.createElement('div');
        card.className = 'sermon-card';
        card.dataset.id = sermon.id;
        
        card.innerHTML = `
            <div class="sermon-image">
                <img src="${sermon.artwork}" alt="${sermon.title}" loading="lazy">
                <div class="play-overlay"><div class="play-icon">▶</div></div>
            </div>
            <div class="sermon-content">
                <div class="sermon-meta">
                    <span class="sermon-date">${formatDate(sermon.date)}</span>
                    <span class="sermon-duration">${sermon.duration}</span>
                </div>
                <h3 class="sermon-title">${sermon.title}</h3>
                <p class="sermon-description">${sermon.description}</p>
            </div>
        `;
        
        card.addEventListener("click", () => {
            const clickedSermon = allSermons.find(s => s.id === sermon.id);
            updateFeaturedSermon(clickedSermon);
        });
        
        grid.appendChild(card);
    });
}

// =====================
// YOUTUBE PLAYER API
// =====================
function loadVideo(videoId) {
    currentVideoId = videoId;

    if (!player) {
        createYouTubePlayer(videoId);
    } else {
        player.loadVideoById(videoId);
    }
}

function createYouTubePlayer(videoId) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
        player = new YT.Player("player", {
            height: "100%",
            width: "100%",
            videoId,
            playerVars: { 
                playsinline: 1, 
                rel: 0, 
                modestbranding: 1, 
                controls: 1 
            },
        });
    };
}

// =====================
// FILTER INITIALIZATION
// =====================
function initFilters() {
    // Series/Speaker/Topic filter buttons
    document.querySelectorAll(".filter-option").forEach(btn => {
        btn.addEventListener("click", () => {
            const filterGroup = btn.closest(".filter-group");
            const label = filterGroup.querySelector(".filter-label").textContent.toLowerCase();
            const value = btn.dataset.filter;

            // Update filter state
            if (label.includes("series")) {
                filters.series = value;
            } else if (label.includes("speaker")) {
                filters.speaker = value;
            } else if (label.includes("topic")) {
                filters.topic = value;
            }

            // Update active state
            filterGroup.querySelectorAll(".filter-option").forEach(b => 
                b.classList.remove("active")
            );
            btn.classList.add("active");

            applyFilters();
        });
    });

    // Search input
    const searchField = document.querySelector(".search-input");
    if (searchField) {
        searchField.addEventListener("input", (e) => {
            filters.search = e.target.value.toLowerCase().trim();
            applyFilters();
        });
    }
}

// =====================
// HELPERS
// =====================
function getSpeaker(speakerName) {
    const speakers = {
        "Pastor Tobore David": {
            name: "Pastor Tobore David",
            role: "Senior Pastor",
            avatar: "../assets/images/leadership/pastor-tobore.jpg"
        },
        "Pastor Faith Johnson": {
            name: "Pastor Faith Johnson",
            role: "Associate Pastor",
            avatar: "../assets/images/leadership/leader-1.jpg"
        },
        "Brother Michael Adeyemi": {
            name: "Brother Michael Adeyemi",
            role: "Youth Pastor",
            avatar: "../assets/images/leadership/leader-2.jpg"
        }
    };

    return speakers[speakerName] || {
        name: speakerName,
        role: "Guest Speaker",
        avatar: "../assets/images/sermons/guest-speaker.jpg"
    };
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}