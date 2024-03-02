const startButton = document.getElementById("play");
const gameContainer = document.querySelector(".container");
const boardContainer = document.querySelector(".board");
const allTiles = document.querySelectorAll(".tile");
const redTile = document.querySelector(".red");
const greenTile = document.querySelector(".green");
const blueTile = document.querySelector(".blue");
const yellowTile = document.querySelector(".yellow");
const higherScore = document.getElementById("high-score");
const gameLevel = document.getElementById("level");
let tileSequence = [redTile, blueTile, greenTile, yellowTile];
let userClickedPattern = [];
let score = 0;
let level = 0;
function getRandomPanel(panel) {
  return panel[Math.floor(Math.random() * panel.length)];
}
tileSequence = [
  getRandomPanel(tileSequence),
  getRandomPanel(tileSequence),
  getRandomPanel(tileSequence),
  getRandomPanel(tileSequence),
];
console.log(tileSequence);
function flash(panel) {
  const panelSound = new Audio(`./sounds/${panel.dataset.tile}.mp3`);
  return new Promise((resolve, reject) => {
    panel.classList.replace("inactive", "active");
    setTimeout(() => {
      panel.classList.replace("active", "inactive");
      panelSound.play();
      setTimeout(() => {
        resolve();
      }, 500);
    }, 1000);
  });
}
const colorsPattern = () => {
  return tileSequence.map((tile) => {
    return tile.dataset.tile;
  });
};
function comparePatterns() {
  let correctPattern = [];
  for (let i = 0; i < userClickedPattern.length; i++) {
    if (userClickedPattern[i] === colorsPattern()[i]) {
      correctPattern.push(true);
    } else {
      correctPattern.push(false);
    }
  }
  return correctPattern;
}
function handleClick(clickedTile) {
  const clickedTileValue = clickedTile.target.dataset.tile;
  const tileSound = new Audio(`./sounds/${clickedTileValue}.mp3`);
  tileSound.play();
  userClickedPattern.push(clickedTileValue);
  const checkedPattern = comparePatterns();
  if (checkedPattern.includes(false)) {
    const wrongAnswer = new Audio("./sounds/wrong.mp3");
    wrongAnswer.play();
    const gameOver = new Audio("./sounds/game-over.wav");
    setTimeout(() => {
      gameOver.play();
    }, 1000);
    setTimeout(() => {
      endGame();
      higherScore.innerHTML = 0;
      gameLevel.innerHTML = 0;
    }, 2000);
  } else if (checkedPattern.length === colorsPattern().length) {
    score++;
    level++;
    higherScore.innerHTML = score;
    gameLevel.innerHTML = level;
    resetGame();
  }
  if (higherScore === 12) {
    winGame();
  }
}
function resetGame() {
  userClickedPattern = [];
  allTiles.forEach((child) => {
    child.classList.add("inactive");
  });
  boardContainer.classList.add("unclickable");
  tileSequence.push(getRandomPanel(tileSequence));
  console.log(tileSequence);
  setTimeout(() => {
    main();
  }, 1000);
}
function generateElement(message) {
  let div = document.createElement("div");
  let p = document.createElement("p");
  let replayButton = document.createElement("button");
  let replayButtonText = document.createTextNode("Restart Game");
  replayButton.appendChild(replayButtonText);
  p.innerHTML = message;
  div.style.cssText = ` position: absolute;
     background: linear-gradient(to top, #87b7ff, #6f7cf5);
    padding: 100px 20px;
    width: 100%;
    top: 0%;
    border-radius: 5px;
    left: 0%;
    height: 100%;
    color: rgb(255, 255, 255);
    text-align: center;
    font-size: 35px;
    border: 1px solid rgb(204, 204, 204);`;
  div.appendChild(p);
  div.appendChild(replayButton);
  gameContainer.style.position = "relative";
  gameContainer.appendChild(div);
}
function endGame() {
  generateElement("You Lost");
  replayButton.addEventListener("click", function () {
    window.location.reload();
  });
}
function winGame() {
  boardContainer.classList.add("unclickable");
  allTiles.forEach((child) => {
    child.classList.add("inactive");
  });
  const winGame = new Audio("./sounds/game-win.wav");
  generateElement("You Win");
  winGame.play();
  replayButton.addEventListener("click", function () {
    window.location.reload();
    gameLevel.innerHTML = 0;
    higherScore.innerHTML = 0;
  });
}
function startGame() {
  boardContainer.classList.remove("unclickable");
  allTiles.forEach((child) => {
    child.classList.remove("inactive");
    child.addEventListener("click", handleClick);
  });
}
const main = async () => {
  startButton.classList.add("unclickable");
  for (const panel of tileSequence) {
    await flash(panel);
  }
  startGame();
};
startButton.addEventListener("click", main);
