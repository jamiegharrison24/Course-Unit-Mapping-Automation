function toggleDarkMode() {
    const body = document.body;
    const sidebar = document.getElementById('sidebar');
    const header = document.querySelector('header');
    const userInfo = document.querySelector('.user-info');

    // Toggle dark mode class on key elements
    body.classList.toggle('dark-mode');
    sidebar.classList.toggle('dark-mode');
    header.classList.toggle('dark-mode');
    if (userInfo) userInfo.classList.toggle('dark-mode');

    // Save the current mode to localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

// Load the theme preference from localStorage on page load
window.onload = function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('sidebar').classList.add('dark-mode');
        document.querySelector('header').classList.add('dark-mode');
        const userInfo = document.querySelector('.user-info');
        if (userInfo) userInfo.classList.add('dark-mode');

        // Ensure the dark mode toggle is checked if on settings page
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) darkModeToggle.checked = true;
    }
};
