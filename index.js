
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

const nextTurn = () => {
  turns++;
  firstChoice = {};
  secondChoice = {};
  clickEnabled = true;
}

const evaluateChoices = () => {
  if (firstChoice.src === secondChoice.src) {
    console.log("SUCCESS")
  } else {
    console.log("FAIL")
    cards.filter((item) => {return item.id == firstChoice.id || item.id == secondChoice.id})
    .forEach((item) => {item.show = false});
    document.getElementById(firstChoice.id).classList.remove('flipped');
    document.getElementById(secondChoice.id).classList.remove('flipped');
    // console.log('F', firstChoice, 'S', secondChoice)
    // console.log('cARDS:', cards)
  }
  nextTurn();
}

const handleChoice = (id) => {
  if (clickEnabled) {
    document.getElementById(id).classList.add('flipped');
    if (firstChoice && Object.keys(firstChoice).length === 0 && Object.getPrototypeOf(firstChoice) === Object.prototype) {
      firstChoice = cards.find(item => item.id == id);
      firstChoice.show = true;
    } else {
      // cards.find(item => item.id == id).show = true;
      secondChoice = cards.find(item => item.id == id);
      secondChoice.show = true;
      clickEnabled = false;
      setTimeout(() => evaluateChoices(), 1000);
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
  shuffle();
  renderHTML();
  nextTurn();
  setTimeout(() => {
    document.getElementById("foot").classList.remove('fixed');
  },  100);
  
}

window.onload = startNewGame;
