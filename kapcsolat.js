document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('nav a').forEach(a => {
                const href = a.getAttribute('href');
                const page = window.location.pathname.split('/').pop();
                if ((href === 'kapcsolat.html' && page === 'kapcsolat.html') || (href === 'index.html' && (page === '' || page === 'index.html'))) {
                    a.classList.add('active');
                }
            });
        });