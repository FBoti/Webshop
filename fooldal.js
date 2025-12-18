document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('nav a').forEach(a => {
                const href = a.getAttribute('href');
                const page = window.location.pathname.split('/').pop();
                if ((href === 'index.html' && (page === '' || page === 'index.html')) || href === page) {
                    a.classList.add('active');
                }
            });
        });