document.addEventListener("DOMContentLoaded", function() {
    // --- Define Elements and Media Query ---
    const header = document.querySelector('.main-header');
    const navPlaceholder = document.getElementById('nav-placeholder');
    const contentPlaceholder = document.getElementById('content-placeholder');
    const mobileMediaQuery = window.matchMedia('(max-width: 768px)');

    // --- Page-specific initialization functions ---
    function initContactPage() {
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Thank you for your message! (This is a demo)');
                form.reset();
            });
        }
    }

    // --- Hobbies Page Functions ---

    async function loadWeatherCard(lat, lon) {
        const weatherCard = document.getElementById('weather-card-content');
        if (weatherCard) {
            try {
                const pointsResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
                if (!pointsResponse.ok) throw new Error('Failed to get weather station URL');
                const pointsData = await pointsResponse.json();
                const forecastUrl = pointsData.properties.forecast;
                const forecastResponse = await fetch(forecastUrl);
                if (!forecastResponse.ok) throw new Error('Failed to get forecast data');
                const forecastData = await forecastResponse.json();
                const currentPeriod = forecastData.properties.periods[0];
                weatherCard.innerHTML = `
                    <h5 class="card-title">${currentPeriod.temperature}°${currentPeriod.temperatureUnit}</h5>
                    <p class="card-text">${currentPeriod.shortForecast}</p>
                    <p class="card-text"><small class="text-muted">Source: weather.gov</small></p>
                `;
            } catch (error) {
                console.error("Weather fetch error:", error);
                weatherCard.innerHTML = `<p class="text-danger">Could not load weather data.</p>`;
            }
        }
    }

    // NEW reusable function for loading a sports team RSS feed
    async function loadSportTeamCard(feedElementId, rssUrl, logoUrl) {
        const feedElement = document.getElementById(feedElementId);
        if (!feedElement) return;

        // Add the team logo to the card's header
        const cardHeader = feedElement.previousElementSibling;
        if (cardHeader && logoUrl) {
            const logoImg = document.createElement('img');
            logoImg.src = logoUrl;
            logoImg.alt = "Team Logo";
            logoImg.style.height = '24px';
            // Change margin to be on the right side of the logo
            logoImg.style.marginRight = '6px';
            // Prepend the logo to put it before the text
            cardHeader.prepend(logoImg);
        }
        
        // Fetch and display the RSS feed
        try {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            
            if (data.status === 'ok' && data.items.length > 0) {
                let newsHtml = '<ul class="list-unstyled">';
                data.items.slice(0, 3).forEach(item => {
                    newsHtml += `
                        <li class="d-flex justify-content-between align-items-center mt-2">
                            <span class="me-2" style="font-size: 0.9rem;">${item.title}</span>
                            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="text-secondary">
                                <i class="bi bi-box-arrow-up-right"></i>
                            </a>
                        </li>
                    `;
                });
                newsHtml += '</ul>';
                feedElement.innerHTML = newsHtml;
            } else {
                throw new Error(data.message || 'RSS feed format error or no items found.');
            }
        } catch (error) {
            console.error("Sports News fetch error:", error);
            feedElement.innerHTML = `<p class="text-danger small">Error: ${error.message}</p>`;
        }
    }

    async function initHobbiesPage() {
        // Call the weather card function
        loadWeatherCard(45.52, -122.68);
        
        // Call the new sports team card function for the Timbers
        loadSportTeamCard(
            'timbers-news-feed', 
            'https://rss.app/feeds/IRpM5V1FDbUrwcq8.xml', 
            'https://images.mlssoccer.com/image/upload/assets/logos/POR.svg'
        );

        // hockey-feed
        loadSportTeamCard(
            'winterhawks-news-feed', 
            'https://rss.app/feeds/viXRSBHtvnKSjL7t.xml', 
            'https://static01.nyt.com/athletic/uploads/wp/2021/07/14123749/PHW-Primary_Logo-RGB.png'
        );


        // --- Hockey Team Card ---
        const hockeyCard = document.getElementById('hockey-feed');
        if (hockeyCard) {
            hockeyCard.innerHTML = `
                <p>Latest results and schedule for my beer league team.</p>
                <a href="https://mountainview.ezleagues.ezfacility.com/teams/3068416/3rd-Rock.aspx?framed=1" class="btn btn-success" target="_blank" rel="noopener noreferrer">View Team Page</a>
            `;
        }
    }

    // --- Core SPA & Navigation Logic ---
    function loadContent(page) {
        fetch(`pages/${page}.html`)
            .then(response => {
                if (!response.ok) { throw new Error('Page not found'); }
                return response.text();
            })
            .then(html => {
                contentPlaceholder.innerHTML = html;
                switch (page) {
                    case 'hobbies': initHobbiesPage(); break;
                    case 'home': // No specific JS needed for home
                    case 'about':
                    case 'courses':
                    case 'projects':
                        break;
                    case 'contact':
                        initContactPage();
                        break;
                }
            })
            .catch(error => {
                console.error(`Error fetching page ${page}:`, error);
                contentPlaceholder.innerHTML = '<h2>Page Not Found</h2>';
            });
    }

    function loadNav() {
        fetch('nav.html')
            .then(response => response.text())
            .then(html => {
                navPlaceholder.innerHTML = html;
                initSidebarToggle();
            })
            .catch(error => console.error('Error fetching nav.html:', error));
    }
    
    // --- Layout, Routing, and Menu Toggle Logic ---
    function handleRouteChange() {
        const page = window.location.hash.substring(1) || 'home';
        loadContent(page);
    }

    function handleResponsiveLayout(event) {
        if (event.matches) {
            header.appendChild(navPlaceholder);
        } else {
            document.body.insertBefore(navPlaceholder, contentPlaceholder);
        }
    }

    function initMenuToggle() {
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navPlaceholder.classList.toggle('is-open');
            });
            navPlaceholder.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    navPlaceholder.classList.remove('is-open');
                }
            });
        }
    }

    function initSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-collapsed');
            });
        }
    }

    // --- Initial Page Load ---
    loadNav();
    initMenuToggle();
    mobileMediaQuery.addEventListener('change', handleResponsiveLayout);
    handleResponsiveLayout(mobileMediaQuery);
    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
});
