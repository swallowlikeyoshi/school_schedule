// 다크 모드 토글 기능 추가
const darkModeToggle = document.getElementById('dark-mode-toggle');
const rootElement = document.documentElement;

darkModeToggle.addEventListener('click', () => {
    if (rootElement.classList.contains('dark-mode')) {
        rootElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    } else {
        rootElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
});