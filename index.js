
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

 const difficultyCols = {
  12: ['grid-cols-4', 'md:grid-cols-6', 'xl:grid-cols-8'],
  10: ['grid-cols-4', 'md:grid-cols-5', 'xl:grid-cols-10'],
  9: ['grid-cols-3', 'md:grid-cols-6', 'xl:grid-cols-9'],
  8: ['grid-cols-4', 'lg:grid-cols-8'],
  6: ['grid-cols-4', 'lg:grid-cols-6'],
  5: ['grid-cols-2', 'sm:grid-cols-5', "lg:grid-cols-10"],
  4: ['grid-cols-4', 'lg:grid-cols-8'],
}

let cards = [];
let turns = 0;
let difficulty = 12;
let firstChoice = {};
let secondChoice = {};
let clickEnabled = true;

const shuffle = () => {
  cards = [...images.slice(0, difficulty), ...images.slice(0, difficulty)]
    .sort(() => Math.random() - 0.5)
    .map((item) => ({ ...item, id: Math.random(), show: false}));
}

const increaseDifficulty = () => {
  difficulty < 12 ? difficulty++ : difficulty += 0;
  [7, 11].includes(difficulty) ? difficulty++ : difficulty += 0;
  renderDifficulty();
}

const decreaseDifficulty = () => {
  difficulty > 4 ? difficulty-- : difficulty += 0;
  [7, 11].includes(difficulty) ? difficulty-- : difficulty += 0;
  renderDifficulty();
}

const renderDifficulty = () => {
  document.getElementById("difficulty").innerHTML = difficulty;
}

const hideModal = () => {
  document.getElementById('modal').classList.add('hidden');
}

const renderModal = () => {
  document.getElementById('winner-turns').innerHTML = turns;
  document.getElementById('winner-time').innerHTML = timeToString(elapsedTime);
  document.getElementById('modal').classList.remove('hidden');
}

const checkFinished = () => {
  if (cards.every(card => card.show)) {
    console.log("WINNER WINNER");
    pauseTimer();
    renderModal();
  }
}

const resetTurns = () => {
  turns = 0;
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
      clickEnabled = false;
      secondChoice = cards.find(item => item.id == id);
      secondChoice.show = true;
      setTimeout(() => evaluate(), 1000);
    }
  }
}

const setGridCols = () => {
  document.getElementById('card-grid').getAttribute('class').split(' ').forEach(c => {
    if (c.includes('-cols')) {
      document.getElementById('card-grid').classList.remove(c);
    }
  })
  difficultyCols[difficulty].forEach(c => {
    document.getElementById('card-grid').classList.add(c);
  })

}

const moveFooter = () => {
  setTimeout(() => {
    document.getElementById("foot").classList.remove('fixed');
  },  50);
}

const renderHTML = () => {
  let html = ''
  cards.forEach((card) => {
    html += `
    <div id="${card.id}" class="card cursor-pointer mx-auto transform hover:scale-105">\n
      <img src="${card.src}" class="face rounded-md h-full">\n
      <img src="./assets/back.png" card="${card.id}" onclick="handleChoice(this.getAttribute(\'card\'))"
      class="back border-2 border-solid rounded-md border-red-900">\n
    </div>`;
  })
  document.getElementById('card-grid').innerHTML = html;
}

const startNewGame = () => {
  hideModal();
  resetTimer();
  resetTurns();
  shuffle();
  setGridCols();
  renderHTML();
  nextTurn();
  startTimer();
  moveFooter();
  setModalHeight();
}

const setModalHeight = () => {
  setTimeout(() => {
    document.getElementById('modal').style.height = document.body.scrollHeight + "px";
  }, 250);
}

window.addEventListener('resize', function(event) {
  setModalHeight();
}, true);


// -- TIMER --


function timeToString(time) {
  let diffInHrs = time / 3600000;

  let diffInMin = diffInHrs * 60;
  let mm = Math.floor(diffInMin);

  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);

  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");

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
