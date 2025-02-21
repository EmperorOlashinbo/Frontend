document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.sidebar');
    const toggle_btn = document.getElementById('toggle-btn');
    const content = document.querySelector('section');
    const body = document.querySelector('body');
    const bgModeBtn = document.getElementById('bgModeBtn');
    const bgModeIcon = document.getElementById('bgModeIcon');
    const sectionHeader = document.querySelector('section h1');

    // Ensure the sidebar is hidden initially on small screens
    if (window.innerWidth <= 1024) {
        nav.classList.add('hide');
    }

    toggle_btn.onclick = function() {
        nav.classList.toggle('hide');
        nav.classList.toggle('show');
        content.classList.toggle('expand');
    };

    bgModeBtn.onclick = function() {
        body.classList.toggle("dark-mode");
        bgModeIcon.classList.toggle("fa-sun-o");
        bgModeIcon.classList.toggle("fa-moon-o");
        sectionHeader.classList.toggle("dark-mode");
    };

    // Handle window resize to show/hide sidebar and toggle button appropriately
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            nav.classList.remove('hide');
            nav.classList.remove('show');
        } else {
            nav.classList.add('hide');
        }
    });
});