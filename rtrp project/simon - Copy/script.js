// Set background based on theme
document.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem('selectedTheme');
  if (theme) {
    document.body.style.backgroundImage = `url('${theme}')`;  // Fixed the string interpolation
  }
});

// Game logic
let sequence = [];
let userSequence = [];
let recognition;
let scores = JSON.parse(localStorage.getItem('scores')) || [];

if (document.getElementById('startButton')) {
  document.getElementById('startButton').addEventListener('click', startGame);
}

function startGame() {
  sequence = [];
  userSequence = [];
  nextWord();
}

function nextWord() {
  const newWord = getRandomWord();
  sequence.push(newWord);
  speakSequence();
}

function getRandomWord() {
  const words = ["apple", "banana", "cat", "dog", "elephant", "flower", "guitar"];
  return words[Math.floor(Math.random() * words.length)];
}

function speakSequence() {
  utterance.lang = 'en-US';
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.voice = speechSynthesis.getVoices()[0];
  

  utterance.onend = () => {
      startListening();
  };
}

function startListening() {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.start();

  recognition.onresult = (event) => {
      const spokenWords = event.results[0][0].transcript.trim().toLowerCase();
      checkAnswer(spokenWords);
  };
}

function checkAnswer(userSpoken) {
  const correctPhrase = sequence.join(' ').toLowerCase();

  if (userSpoken === correctPhrase) {
      document.getElementById('result').textContent = "Correct!";
      nextWord();
  } else {
      document.getElementById('result').innerHTML = `
          <p>Incorrect!</p>
          <p>You said: ${userSpoken}</p>
          <p>Expected: ${correctPhrase}</p>
      `;
      updateScore(sequence.length - 1);
  }
}

function updateScore(score) {
  scores.push(score);
  localStorage.setItem('scores', JSON.stringify(scores));
}

// Progress Chart
if (document.getElementById('progressChart')) {
  const ctx = document.getElementById('progressChart').getContext('2d');
  new Chart(ctx, {
      type: 'line',
      data: {
          labels: scores.map((_, index) => `Game ${index + 1}`), // Fixed string interpolation
          datasets: [{
              label: 'Score',
              data: scores,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.2
          }] }});}