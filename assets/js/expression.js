// expressions.js - Simple functionality for expression pages

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize any expression-specific functionality
    initExpressionPage();
});

function initExpressionPage() {
    // Add any expression-specific initialization here
    console.log('Expression page initialized');
    
    // Example: Load gallery images dynamically if needed
    // loadGalleryImages();
}