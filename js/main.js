document.addEventListener("DOMContentLoaded", function() {
    // --- Page-specific initialization functions ---

    function initHomePage() {
        const pfSpan = document.getElementById('platform');
        if (pfSpan) {
            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
            pfSpan.textContent = isMobile ? "a mobile device" : "a desktop computer";
        }
    }

    function initCounterPage() {
        const btn = document.getElementById('counter-btn');
        if (btn) {
            const span = document.getElementById('counter-value');
            let count = 0;
            btn.addEventListener('click', () => {
                span.textContent = ++count;
            });
        }
    }

    function initWeatherPage() {
        const tableBody = document.getElementById('weather-table');
        if (tableBody) {
            // Clear existing table data to prevent duplicates on re-load
            tableBody.innerHTML = ''; 
            const summaries = ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];
            const today = new Date();
            for (let i = 0; i < 5; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i + 1);
                const c = Math.floor(Math.random() * 75 - 20);
                const f = Math.round(c * 9 / 5 + 32);
                const summary = summaries[Math.floor(Math.random() * summaries.length)];
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${date.toLocaleDateString()}</td><td>${c}</td><td>${f}</td><td>${summary}</td>`;
                tableBody.appendChild(tr);
            }
        }
    }

    // --- Core SPA navigation and content loading ---

    function loadNavAndSetupLinks() {
        fetch('nav.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('nav-placeholder').innerHTML = html;
                setupNavigation();
            })
            .catch(error => console.error('Error fetching nav.html:', error));
    }

    function loadContent(page) {
        fetch(`pages/${page}.html`)
            .then(response => {
                if (!response.ok) { throw new Error('Page not found'); }
                return response.text();
            })
            .then(html => {
                document.getElementById('content-placeholder').innerHTML = html;
                // After loading content, run the specific script for that page
                switch (page) {
                    case 'home':
                        initHomePage();
                        break;
                    case 'counter':
                        initCounterPage();
                        break;
                    case 'weather':
                        initWeatherPage();
                        break;
                }
            })
            .catch(error => {
                console.error(`Error fetching page ${page}:`, error);
                document.getElementById('content-placeholder').innerHTML = '<h2>Page Not Found</h2>';
            });
    }

    function setupNavigation() {
        document.getElementById('nav-placeholder').addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                event.preventDefault();
                const page = event.target.getAttribute('href');
                if (page) {
                    loadContent(page);
                }
            }
        });
    }

    // --- Initial Page Load ---
    loadNavAndSetupLinks();
    loadContent('home');
});