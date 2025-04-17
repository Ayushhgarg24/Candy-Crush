const boardSize = 6;
const board = [];
const fruits = ["🍓", "🍇", "🍊", "🍌", "🍍"];
const fruitImages = {
  "🍓": "https://em-content.zobj.net/thumbs/240/apple/354/strawberry_1f353.png",
  "🍇": "https://em-content.zobj.net/thumbs/240/apple/354/grapes_1f347.png",
  "🍊": "https://em-content.zobj.net/thumbs/240/apple/354/tangerine_1f34a.png",
  "🍌": "https://em-content.zobj.net/thumbs/240/apple/354/banana_1f34c.png",
  "🍍": "https://em-content.zobj.net/thumbs/240/apple/354/pineapple_1f34d.png",
};
let first = null;
let score = 0;

const scoreDisplay = document.getElementById("score");
const boardDiv = document.getElementById("board");

function createBoard() {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const fruit = fruits[Math.floor(Math.random() * fruits.length)];
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.style.backgroundImage = `url('${fruitImages[fruit]}')`;
    cell.dataset.index = i;
    cell.dataset.fruit = fruit;
    cell.addEventListener("click", () => handleClick(cell));
    board.push(cell);
    boardDiv.appendChild(cell);
  }
}

function handleClick(cell) {
  if (first === null) {
    first = cell;
    cell.style.outline = "3px solid orange";
  } else {
    if (first === cell) return;
    const idx1 = parseInt(first.dataset.index);
    const idx2 = parseInt(cell.dataset.index);
    if (areAdjacent(idx1, idx2)) {
      swapFruits(first, cell);
      if (!crushCandies()) {
        swapFruits(first, cell); // revert if no crush
      }
    }
    first.style.outline = "none";
    first = null;
  }
}

function areAdjacent(i, j) {
  const x1 = Math.floor(i / boardSize), y1 = i % boardSize;
  const x2 = Math.floor(j / boardSize), y2 = j % boardSize;
  return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
}

function swapFruits(a, b) {
  const tempFruit = a.dataset.fruit;
  a.dataset.fruit = b.dataset.fruit;
  b.dataset.fruit = tempFruit;
  a.style.backgroundImage = `url('${fruitImages[a.dataset.fruit]}')`;
  b.style.backgroundImage = `url('${fruitImages[b.dataset.fruit]}')`;
}

function crushCandies() {
  let crushed = false;
  const matched = Array(boardSize * boardSize).fill(false);

  // Horizontal
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize - 2; j++) {
      let idx = i * boardSize + j;
      let f = board[idx].dataset.fruit;
      if (f && f === board[idx + 1].dataset.fruit && f === board[idx + 2].dataset.fruit) {
        matched[idx] = matched[idx + 1] = matched[idx + 2] = true;
        crushed = true;
      }
    }
  }

  // Vertical
  for (let j = 0; j < boardSize; j++) {
    for (let i = 0; i < boardSize - 2; i++) {
      let idx = i * boardSize + j;
      let f = board[idx].dataset.fruit;
      if (f && f === board[idx + boardSize].dataset.fruit && f === board[idx + 2 * boardSize].dataset.fruit) {
        matched[idx] = matched[idx + boardSize] = matched[idx + 2 * boardSize] = true;
        crushed = true;
      }
    }
  }

  if (!crushed) return false;

  matched.forEach((v, i) => {
    if (v) {
      board[i].dataset.fruit = "";
      board[i].style.backgroundImage = "none";
      score += 10;
    }
  });

  setTimeout(() => {
    applyGravity();
    refillBoard();
    scoreDisplay.innerText = `Score: ${score}`;
    setTimeout(crushCandies, 300);
  }, 300);

  return true;
}

function applyGravity() {
  for (let j = 0; j < boardSize; j++) {
    let empty = [];
    for (let i = boardSize - 1; i >= 0; i--) {
      let idx = i * boardSize + j;
      if (!board[idx].dataset.fruit) {
        empty.push(idx);
      } else if (empty.length > 0) {
        let dest = empty.shift();
        board[dest].dataset.fruit = board[idx].dataset.fruit;
        board[dest].style.backgroundImage = board[idx].style.backgroundImage;
        board[idx].dataset.fruit = "";
        board[idx].style.backgroundImage = "none";
        empty.push(idx);
      }
    }
  }
}

function refillBoard() {
  board.forEach(cell => {
    if (!cell.dataset.fruit) {
      let fruit = fruits[Math.floor(Math.random() * fruits.length)];
      cell.dataset.fruit = fruit;
      cell.style.backgroundImage = `url('${fruitImages[fruit]}')`;
    }
  });
}

createBoard();
crushCandies(); // initial cleanup if needed
