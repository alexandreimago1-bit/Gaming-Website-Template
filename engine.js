// Local Database tracking game logs & mod releases (Updated with PFP/ directory routing)
const RACING_LOG_DB = [
    {
        id: "log-1",
        title: "Assetto Corsa Custom Physics: Damper Profile Updates",
        summary: "Community test tracks are pushing a new patch integrating custom structural damper formulas and real-time tire wall mutation logic.",
        game: "ac",
        imgUrl: "PFP/acphy.jpeg", 
        timestamp: "12 mins ago",
        likes: 184,
        featured: false
    },
    {
        id: "log-2",
        title: "Forza Horizon Spring Asset Drop // JDM Classics Pack",
        summary: "The expansion playlist hits the garage deck tonight featuring legendary widebody aero sets and retro single-turbo modification packages.",
        game: "fh",
        imgUrl: "PFP/fhjdm.jpeg", 
        timestamp: "2 hours ago",
        likes: 312,
        featured: false
    },
    {
        id: "log-3",
        title: "CarX Drift: Tokyo Highway Physics Optimization",
        summary: "The transmission logic update fine-tunes low-gear torque behavior, fixing engine stagnation issues during tight multi-car tandem transitions.",
        game: "cx",
        imgUrl: "PFP/cxdr.jpeg", 
        timestamp: "5 hours ago",
        likes: 95,
        featured: false
    },
    {
        id: "log-4",
        title: "Wangan Midnight Expressway V3 Arena Drop",
        summary: "Download link is active. Features upscaled high-res texture layout mapping, night illumination arrays, and fully optimized AI traffic pathways.",
        game: "ac",
        imgUrl: "PFP/wanganmn.jpeg", 
        timestamp: "1 day ago",
        likes: 420,
        featured: false
    },
    // HIGH-CLASS HOMEPAGE FEATURED RECORD SPOTLIGHT
    {
        id: "log-featured",
        title: "LATE NIGHT LOUNGE: THE EVOLUTION OF HIGHWAY JDM RUNS",
        summary: "An in-depth historical profile exploring how Assetto Corsa communities built a seamless digital underground subculture using authentic asset configurations.",
        game: "ac",
        imgUrl: "PFP/JDM wallpaper.jpeg", 
        timestamp: "Featured Telemetry",
        likes: 982,
        featured: true
    }
];

// Tracking Arrays
let savedLogs = [];
let currentGameFilter = "all";
let activeSearchQuery = "";

// DOM Cache Selectors
const newsFeedOutput = document.getElementById('newsFeedOutput');
const heroSpotlightTarget = document.getElementById('heroSpotlightTarget');
const savedCount = document.getElementById('savedCount');
const feedSearch = document.getElementById('feedSearch');
const filterItems = document.querySelectorAll('.mod-filters li');

function fireUpEngine() {
    renderFeaturedHero();
    renderNewsFeed();
    bindControls();
}

// Render the high-finesse Home Feature Banner
function renderFeaturedHero() {
    const featuredItem = RACING_LOG_DB.find(item => item.featured === true);
    if (!featuredItem) return;

    heroSpotlightTarget.innerHTML = `
        <div class="hero-bg-canvas" style="background-image: url('${featuredItem.imgUrl}');"></div>
        <div class="hero-overlay-shadow">
            <div class="hero-content-envelope">
                <span class="hero-badge">FEATURED LOG</span>
                <h1>${featuredItem.title}</h1>
                <p>${featuredItem.summary}</p>
                <button class="like-counter-btn" data-like-id="${featuredItem.id}">
                    👍 Upvote Report (<span class="like-value">${featuredItem.likes}</span>)
                </button>
            </div>
        </div>
    `;
}

// Dynamic Feed Stream Routine
function renderNewsFeed() {
    newsFeedOutput.innerHTML = '';

    // Filter standard posts (exclude the standalone home hero spotlight entry from listing below)
    const processedFeed = RACING_LOG_DB.filter(item => {
        if (item.featured) return false; 
        
        const matchesFilter = currentGameFilter === 'all' || item.game === currentGameFilter;
        const matchesSearch = item.title.toLowerCase().includes(activeSearchQuery) || 
                              item.summary.toLowerCase().includes(activeSearchQuery);
        return matchesFilter && matchesSearch;
    });

    if (processedFeed.length === 0) {
        newsFeedOutput.innerHTML = `<div style="color: var(--text-dim); text-align: center; padding: 4rem 0;">No active telemetry streams match your search parameters.</div>`;
        return;
    }

    processedFeed.forEach(log => {
        const isBookmarked = savedLogs.includes(log.id);
        const cardNode = document.createElement('article');
        cardNode.className = 'news-card';
        cardNode.innerHTML = `
            <div class="card-banner-fallback" style="background-image: url('${log.imgUrl}');"></div>
            <div class="card-details-zone">
                <div class="card-top-line">
                    <span class="game-tag ${log.game}">${getGameLabel(log.game)}</span>
                    <button class="bookmark-btn ${isBookmarked ? 'saved' : ''}" data-log-id="${log.id}">📌</button>
                </div>
                <div>
                    <h3>${log.title}</h3>
                    <p>${log.summary}</p>
                </div>
                <div class="card-meta-strip">
                    <span>Logged: ${log.timestamp}</span>
                    <button class="like-counter-btn" data-like-id="${log.id}">
                        👍 <span class="like-value">${log.likes}</span>
                    </button>
                </div>
            </div>
        `;
        newsFeedOutput.appendChild(cardNode);
    });
}

function getGameLabel(gameCode) {
    if (gameCode === 'ac') return "Assetto Corsa Mod";
    if (gameCode === 'fh') return "Forza Horizon";
    if (gameCode === 'cx') return "CarX Drift";
    return "Telemetry Log";
}

// Interaction Event Bindings
function bindControls() {
    // Left Menu Game Filter Toggles
    filterItems.forEach(tab => {
        tab.addEventListener('click', () => {
            filterItems.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentGameFilter = tab.dataset.game;
            renderNewsFeed();
        });
    });

    // Search input loop
    feedSearch.addEventListener('input', (e) => {
        activeSearchQuery = e.target.value.toLowerCase().trim();
        renderNewsFeed();
    });

    // Global listener catch for dynamic upvotes & updates
    document.body.addEventListener('click', (e) => {
        // Bookmark Engine
        const pinBtn = e.target.closest('.bookmark-btn');
        if (pinBtn) {
            const logId = pinBtn.dataset.logId;
            if (savedLogs.includes(logId)) {
                savedLogs = savedLogs.filter(id => id !== logId);
                pinBtn.classList.remove('saved');
            } else {
                savedLogs.push(logId);
                pinBtn.classList.add('saved');
            }
            savedCount.innerText = savedLogs.length;
            return;
        }

        // Like Engine (Handles both stream logs and featured hero upvotes)
        const likeBtn = e.target.closest('.like-counter-btn');
        if (likeBtn) {
            const logId = likeBtn.dataset.likeId;
            const targetLog = RACING_LOG_DB.find(l => l.id === logId);
            if (targetLog) {
                targetLog.likes++;
                likeBtn.querySelector('.like-value').innerText = targetLog.likes;
            }
        }
    });
}

// Launch
fireUpEngine();