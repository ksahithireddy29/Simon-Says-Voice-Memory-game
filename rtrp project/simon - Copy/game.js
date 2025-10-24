let recognition;
let systemWords = [];
let userWords = [];
let round = 1;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Define theme-based word sets
const themeWords = {
    'valleys': ["hill", "grass", "tree", "wind", "stream", "rock", "cloud", "bird", "sun", "path"],
    'devils_land': ["fire", "dark", "red", "hot", "smoke", "bat", "lava", "ghost", "ash", "howl"],
    'space': ["star", "moon", "sun", "ship", "sky", "blue", "dark", "ball", "light", "zoom"],
    'alien_land': ["blip", "bloop", "zing", "zap", "buzz", "zork", "zonk", "boop", "vroom", "mip"],
    'mountains': ["rock", "snow", "tree", "cold", "hill", "sky", "air", "goat", "climb", "trail"],
    'dark': ["night", "bat", "owl", "fog", "moon", "shade", "black", "star", "sleep", "lamp"],
    'nature': ["leaf", "tree", "sun", "rain", "cloud", "bug", "bird", "grass", "wind", "petal"]
};

// Get selected theme from localStorage
let selectedTheme = localStorage.getItem('selectedTheme');

// Extract theme name from image path
function getThemeKey(themePath) {
    if (!themePath) return 'nature'; // default
    if (themePath.includes('valleys')) return 'valleys';
    if (themePath.includes('devils_land')) return 'devils_land';
    if (themePath.includes('space')) return 'space';
    if (themePath.includes('alien_land')) return 'alien_land';
    if (themePath.includes('mountains')) return 'mountains';
    if (themePath.includes('dark')) return 'dark';
    if (themePath.includes('nature')) return 'nature';
    return 'nature'; // fallback
}

const themeKey = getThemeKey(selectedTheme);

document.getElementById('start-btn').addEventListener('click', startGame);

function startGame() {
    systemWords = [];
    userWords = [];
    round = 1;
    score = 0;
    updateScoreboard();
    document.getElementById('error-message').textContent = '';
    hideTryAgainBar();
    addSystemWord();
}

function addSystemWord() {
    const newWord = getRandomWord();
    systemWords.push(newWord);
    speakSequence();
}

function nextTurn() {
    round++;
    score++;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }

    updateScoreboard();
    addSystemWord();
}

function getRandomWord() {
    const words = themeWords[themeKey] || themeWords['nature'];
    return words[Math.floor(Math.random() * words.length)];
}

function speakSequence() {
    const utterance = new SpeechSynthesisUtterance('Simon says ' + systemWords.join(' '));
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
        listen();
    };
}

function listen() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        const expectedSequence = systemWords.join(' ').toLowerCase().trim();

        if (transcript.startsWith(expectedSequence)) {
            const userWordsArray = transcript.split(' ');
            if (userWordsArray.length === systemWords.length + 1) {
                const userAddedWord = userWordsArray[userWordsArray.length - 1];
                systemWords.push(userAddedWord);
                setTimeout(nextTurn, 1000);
            } else {
                showError(transcript, expectedSequence + " + your new word");
            }
        } else {
            showError(transcript, expectedSequence + " + your new word");
        }
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
    };
}

function showError(userSaid, expected) {
    document.getElementById('error-message').innerHTML = `
        <br>
        You said: "${userSaid}"<br>
        Expected something like: "${expected}"
    `;
    showTryAgainBar();
}

function updateScoreboard() {
    document.getElementById('round').textContent = round;
    document.getElementById('score').textContent = score;
    document.getElementById('high-score').textContent = highScore;
}

function showTryAgainBar() {
    document.getElementById("try-again-bar").style.display = "block";
}

function hideTryAgainBar() {
    document.getElementById("try-again-bar").style.display = "none";
}

function tryAgain() {
    hideTryAgainBar();
    startGame();
}

function goToProgress() {
    window.location.href = "progress.html";
}
