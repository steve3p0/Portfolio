document.addEventListener("DOMContentLoaded", function() {
    // --- Define Elements and Media Query ---
    const header = document.querySelector('.main-header');
    const navPlaceholder = document.getElementById('nav-placeholder');
    const contentPlaceholder = document.getElementById('content-placeholder');
    const mobileMediaQuery = window.matchMedia('(max-width: 768px)');
    // NEW: Define a media query for the tablet breakpoint
    // const tabletMediaQuery = window.matchMedia('(max-width: 992px)');

        // --- Page-specific initialization functions ---
    function initHomePage() {
        const pfSpan = document.getElementById('platform');
        if (pfSpan) {
            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
            pfSpan.textContent = isMobile ? "a mobile device" : "a desktop computer";
        }
    }
    
    function initHobbiesPage() {
        // --- Weather Card ---
        const weatherCard = document.getElementById('weather-card-content');
        if (weatherCard) {
            const tempC = Math.floor(Math.random() * 20 + 5); // Random temp between 5-25 C
            const tempF = Math.round(tempC * 9 / 5 + 32);
            const summaries = ["Clear", "Partly Cloudy", "Showers", "Overcast"];
            const summary = summaries[Math.floor(Math.random() * summaries.length)];
            weatherCard.innerHTML = `
                <h5 class="card-title">${tempF}°F / ${tempC}°C</h5>
                <p class="card-text">${summary}</p>
                <p class="card-text"><small class="text-muted">Updated just now</small></p>
            `;
        }

        // --- Timbers News Card (Simulated) ---
        const timbersCard = document.getElementById('timbers-news-feed');
        if (timbersCard) {
            timbersCard.innerHTML = `
                <ul class="list-unstyled">
                    <li><a href="#">Timbers Secure Victory in Rivalry Match</a></li>
                    <li class="mt-2"><a href="#">Key Player Signs Contract Extension</a></li>
                    <li class="mt-2"><a href="#">Upcoming Match Preview</a></li>
                </ul>
            `;
        }

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
                // After loading content, run the specific script for that page
                switch (page) {
                    case 'home': initHomePage(); break;
                    case 'counter': initCounterPage(); break;
                    case 'weather': initWeatherPage(); break;
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
                // After the nav HTML is loaded, set up the sidebar toggle button inside it
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
            // Screen is MOBILE: move nav inside the header
            header.appendChild(navPlaceholder);
        } else {
            // Screen is DESKTOP: move nav back to be a child of the body, before the main content
            document.body.insertBefore(navPlaceholder, contentPlaceholder);
        }
    }

    function initMenuToggle() {
        // This is for the mobile hamburger button
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navPlaceholder.classList.toggle('is-open');
            });
            // Close mobile menu when a link inside it is clicked
            navPlaceholder.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    navPlaceholder.classList.remove('is-open');
                }
            });
        }
    }

    function initSidebarToggle() {
        // This is for the desktop collapse button
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                // First, toggle the class on the body as before
                document.body.classList.toggle('sidebar-collapsed');

                // Now, find the icon inside the button
                const icon = sidebarToggle.querySelector('i');

                // Check if the sidebar is now collapsed and change the icon's class accordingly
                if (document.body.classList.contains('sidebar-collapsed')) {
                    // It's collapsed, so show the 'open' icon
                    icon.className = 'bi bi-chevron-double-right';
                } else {
                    // It's expanded, so show the 'close' icon
                    icon.className = 'bi bi-chevron-double-left';
                }
            });
        }
    }

    // --- Initial Page Load ---
    loadNav();
    initMenuToggle();

    // Set up responsive layout listener
    mobileMediaQuery.addEventListener('change', handleResponsiveLayout);
    handleResponsiveLayout(mobileMediaQuery);

    // Set up hash-based routing
    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);

    // ▼▼▼ ADD THIS NEW LOGIC ▼▼▼
    // On page load, check if we are in the tablet range and should start collapsed.
    if (tabletMediaQuery.matches && !mobileMediaQuery.matches) {
        // This is true for screen widths between 769px and 992px
        document.body.classList.add('sidebar-collapsed');
    }
});