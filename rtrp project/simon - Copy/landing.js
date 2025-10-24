function selectTheme(theme) {
    localStorage.setItem('selectedTheme', theme);
    window.location.href = 'game.html';
}