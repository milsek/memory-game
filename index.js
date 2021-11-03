const images = [
  {'src': './assets/0.png'},
  {'src': './assets/1.png'},
  {'src': './assets/2.png'},
  {'src': './assets/3.png'},
  {'src': './assets/4.png'},
  {'src': './assets/5.png'},
  {'src': './assets/6.png'},
  {'src': './assets/7.png'},
  {'src': './assets/8.png'},
  {'src': './assets/9.png'},
  {'src': './assets/10.png'},
  {'src': './assets/11.png'},
];

let cards = [];
let turns = 0;
let firstChoice = {};
let secondChoice = {};
let clickEnabled = true;

const shuffle = () => {
  const shuffledCards = [...images, ...images]
    .sort(() => Math.random() - 0.5)
    .map((item) => ({ ...item, id: Math.random(), show: false}));
  cards = shuffledCards;
  turns = 0;
  console.log(cards);
  console.log('turns: ', turns);
}

const checkFinished = () => {
  if (cards.every(card => card.show)) {
    console.log("WINNER WINNER");
    pauseTimer();
  }
}

const updateTurns = () => {
  document.getElementById('turns').innerHTML = turns;
}

const nextTurn = () => {
  firstChoice = {};
  secondChoice = {};
  clickEnabled = true;
  updateTurns();
}

const evaluate = () => {
  if (firstChoice.src !== secondChoice.src) {
    cards.filter((item) => {return item.id == firstChoice.id || item.id == secondChoice.id})
    .forEach((item) => {item.show = false});
    document.getElementById(firstChoice.id).classList.remove('flipped');
    document.getElementById(secondChoice.id).classList.remove('flipped');
  }
  turns++;
  checkFinished();
  nextTurn();
}

const handleChoice = (id) => {
  if (clickEnabled) {
    document.getElementById(id).classList.add('flipped');
    if (firstChoice && Object.keys(firstChoice).length === 0 && Object.getPrototypeOf(firstChoice) === Object.prototype) {
      firstChoice = cards.find(item => item.id == id);
      firstChoice.show = true;
    } else {
      secondChoice = cards.find(item => item.id == id);
      secondChoice.show = true;
      clickEnabled = false;
      setTimeout(() => evaluate(), 1000);
    }
  }
}

const renderHTML = () => {
  let html = ''
  cards.forEach((card) => {
    html += `
    <div id="${card.id}" class="card  cursor-pointer mx-auto transform hover:scale-105">\n
      <img src="${card.src}" class="face h-full">\n
      <img src="./assets/back.png" card="${card.id}" onclick="handleChoice(this.getAttribute(\'card\'))"
      class="back border-2 border-solid border-red-900">\n
    </div>`;
  })
  document.getElementById('card-grid').innerHTML = html;
}

const startNewGame = () => {
  resetTimer();
  shuffle();
  renderHTML();
  nextTurn();
  startTimer();
  setTimeout(() => {
    document.getElementById("foot").classList.remove('fixed');
  },  100);
  
}


// -- TIMER --


function timeToString(time) {
  let diffInHrs = time / 3600000;

  let diffInMin = diffInHrs * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);

  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");

  // return `${formattedMM}:${formattedSS}:${formattedMS}`;
  return `${formattedMM}:${formattedSS}`;
}

let startTime;
let elapsedTime = 0;
let timerInterval;

function print(txt) {
  document.getElementById("timer").innerHTML = txt;
}

function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(function printTime() {
    elapsedTime = Date.now() - startTime;
    print(timeToString(elapsedTime));
  }, 10);
}

function pauseTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  print("00:00");
  elapsedTime = 0;
}

window.onload = startNewGame;
