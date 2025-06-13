document.addEventListener("DOMContentLoaded", function() {
    // This function loads the navigation and then sets up the links
    function loadNavAndSetupLinks() {
        fetch('nav.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('nav-placeholder').innerHTML = html;
                // Once the navigation is loaded, set up the click handlers
                setupNavigation();
            })
            .catch(error => console.error('Error fetching nav.html:', error));
    }

    // This function loads the content for a given page
    function loadContent(page) {
        fetch(`pages/${page}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Page not found');
                }
                return response.text();
            })
            .then(html => {
                document.getElementById('content-placeholder').innerHTML = html;
            })
            .catch(error => {
                console.error(`Error fetching page ${page}:`, error);
                // Optionally, load a 404 page here
                document.getElementById('content-placeholder').innerHTML = '<h2>Page Not Found</h2>';
            });
    }

    // This new function sets up the click listeners on the nav links
    function setupNavigation() {
        document.getElementById('nav-placeholder').addEventListener('click', function(event) {
            // Check if a link (A tag) was clicked
            if (event.target.tagName === 'A') {
                event.preventDefault(); // Stop the browser from navigating the old way
                
                const page = event.target.getAttribute('href'); // Get the page name (e.g., "about")
                if (page) {
                    loadContent(page); // Load the new content
                }
            }
        });
    }

    // Initial page load
    loadNavAndSetupLinks();
    loadContent('home');
});