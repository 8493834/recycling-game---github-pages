// 🛠️ Initialize Game State
const bins = document.querySelectorAll('.bin');
const itemsContainer = document.getElementById('items');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const shareContainer = document.getElementById('share-container');
const shareButton = document.getElementById('share-button');

let score = 0;
let timeRemaining = 60;
let gameInterval;

// 🛠️ Items Data
const items = [
  { name: "Bottle", type: "plastic" },
  { name: "Newspaper", type: "paper" },
  { name: "Jar", type: "glass" },
  { name: "Can", type: "plastic" },
  { name: "Magazine", type: "paper" },
  { name: "Wine Bottle", type: "glass" },
];

// 🛠️ Drag and Drop Logic
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.dataset.type);
}

function drop(event) {
  event.preventDefault();
  const itemType = event.dataTransfer.getData("text");
  const binType = event.target.dataset.type;

  if (itemType === binType) {
    score += 10;
    event.target.classList.add('correct');
    setTimeout(() => event.target.classList.remove('correct'), 500);
  } else {
    score -= 5;
    event.target.classList.add('incorrect');
    setTimeout(() => event.target.classList.remove('incorrect'), 500);
  }

  scoreElement.textContent = score;
  generateItems();
}

// 🛠️ Generate Random Items
function generateItems() {
  itemsContainer.innerHTML = "";
  const randomItems = [...items].sort(() => 0.5 - Math.random()).slice(0, 3);

  randomItems.forEach((item) => {
    const div = document.createElement('div');
    div.classList.add('item');
    div.textContent = item.name;
    div.dataset.type = item.type;
    div.draggable = true;
    div.ondragstart = drag;
    itemsContainer.appendChild(div);
  });
}

// 🛠️ Game Timer
function startTimer() {
  gameInterval = setInterval(() => {
    timeRemaining -= 1;
    timerElement.textContent = timeRemaining;

    if (timeRemaining <= 0) {
      clearInterval(gameInterval);
      endGame();
    }
  }, 1000);
}

// 🛠️ Attach Events to Bins
bins.forEach((bin) => {
  bin.ondragover = allowDrop;
  bin.ondrop = drop;
});

// 🛠️ Start Game
function startGame() {
  score = 0;
  timeRemaining = 60;
  scoreElement.textContent = score;
  timerElement.textContent = timeRemaining;
  shareContainer.style.display = "none";
  generateItems();
  startTimer();
}

// 🛠️ End Game
function endGame() {
  alert(`Game Over! Your final score is ${score}.`);
  shareContainer.style.display = "block";
}

// 🛠️ Share Score
shareButton.addEventListener('click', () => {
  const shareData = {
    title: 'Recycling Game',
    text: `I scored ${score} points in the Recycling Game! Can you beat my score? ♻️`,
    url: window.location.href,
  };

  if (navigator.share) {
    navigator.share(shareData).then(() => {
      console.log('Score shared successfully!');
    }).catch((error) => {
      console.error('Error sharing score:', error);
    });
  } else {
    // Fallback for unsupported browsers
    alert("Sharing isn't supported on your browser. Copy and share this text: " + shareData.text);
  }
});

// 🛠️ Start the Game on Load
startGame();
