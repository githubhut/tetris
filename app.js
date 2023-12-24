const grid = document.querySelector(".grid");
let squares = Array.from(document.querySelectorAll('.grid div')) // 2 ghnte barbaad kr diye is line pr.....sb khuch kr liya...end m ye hi shi code tha jo likha tha
const width = 10; 
const scoreDisplay = document.querySelector("#score");
const highscoreDisplay = document.querySelector("#highScore");
const startBtn = document.querySelector("#start");
const refresh = document.querySelector(".refresh");
let timerID;
let nextRandom = 0;
let score = 0;
let canMove = false;
let hghscr = 0;

const colors = [
  "red",
  "grey",
  "purple",
  "orange",
  "green"
]

//The Tetrominoes
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]

const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

let random = Math.floor(Math.random()*theTetrominoes.length);
let currentPosition = 4;
let currentRotation = 0
let current = theTetrominoes[random][currentRotation];

function draw(){
    current.forEach(index=> {
        squares[currentPosition + index].classList.add("tetromino")
        squares[currentPosition + index].style.backgroundColor = colors[random];
    })
}
function undraw(){
    current.forEach(index=> {
        squares[currentPosition + index].classList.remove("tetromino")
        squares[currentPosition + index].style.backgroundColor = "";
    })
}

function controls(e){
  if(canMove){
    if(e.keyCode === 37) moveLeft();
    else if (e.keyCode === 38) rotate()
    else if (e.keyCode === 39) moveRight()
    else if (e.keyCode === 40) moveDown()
  }

}

document.addEventListener("keydown", controls);



function moveDown(){
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

function moveLeft(){
  undraw();
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

  if(!isAtLeftEdge) currentPosition -= 1;

  if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) currentPosition += 1;

  draw();
}
function moveRight(){
  undraw();
  const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1);

  if(!isAtRightEdge) currentPosition += 1;

  if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) currentPosition -= 1;

  draw();
}

function freeze(){
  if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))){
    current.forEach(index => squares[currentPosition + index].classList.add("taken"));
    random = nextRandom;
    nextRandom = Math.floor(Math.random()*theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    currentPosition = 4;
    draw();
    displayShape();
    gameOver();
    addScore();
  }

}
  
function rotate(){
  undraw();
  currentRotation++;
  if(currentRotation === current.length) currentRotation = 0; 

  current = theTetrominoes[random][currentRotation];
  draw();
}

// mini grid

const displaySquares = document.querySelectorAll(".mini-grid div");
const displyWidth = 4;
let displayIndex = 0;

const upNextTetrominos = [
  [1, displyWidth+1, displyWidth*2+1, 2], // l
  [0,displyWidth,displyWidth+1,displyWidth*2+1], // z
  [1,displyWidth,displyWidth+1,displyWidth+2], // t
  [0,1,displyWidth,displyWidth+1], // o
  [1,displyWidth+1,displyWidth*2+1,displyWidth*3+1] // i
]

function displayShape(){

  displaySquares.forEach(square =>{
    square.classList.remove("tetromino");
    // square.classList.style.backgroundColor = "";
  })

  upNextTetrominos[nextRandom].forEach(index => {
    displaySquares[displayIndex + index].classList.add("tetromino")
    // displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
  })

}

startBtn.addEventListener("click", () =>{
  canMove = !canMove;
  if(timerID){
    clearInterval(timerID);
    timerID = null;
  }
  else{
    draw();
    timerID = setInterval(moveDown, 500);
    nextRandom = Math.floor(Math.random()*theTetrominoes.length);
    displayShape();
  }
})

function addScore(){
  for(let i = 0; i < 199; i+= width){
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

    if(row.every(index => squares[index].classList.contains("taken"))){
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach(index =>{
        squares[index].classList.remove("taken");
        squares[index].classList.remove("tetromino");
        squares[index].style.backgroundColor = "";
      })
      console.log(squares)
      const squaresRemoved = squares.splice(i, width);
      console.log(squaresRemoved)
      console.log(squares)
      squares = squaresRemoved.concat(squares);
      console.log(squares)
      squares.forEach(cell => grid.appendChild(cell))

    }
  }
}

function gameOver(){
  if(current.some(index => squares[currentPosition + index].classList.contains("taken"))){
    if(hghscr < score)  {
      highscoreDisplay.innerHTML = score
      hghscr = score;
    }
    scoreDisplay.innerHTML = "end";
    clearInterval(timerID);
  }
}

function handleKeyDown(event) {
  // Check if the pressed key is an arrow key (keyCode 37-40)
  if (event.keyCode >= 37 && event.keyCode <= 40) {
    event.preventDefault();
  }
}

document.addEventListener("keydown", handleKeyDown);


refresh.addEventListener("click",() =>{

  for(let i = 0; i <= 199; i++){
    squares[i].classList.remove("taken");
    squares[i].classList.remove("tetromino");
    squares[i].style.backgroundColor = "";
  }
  currentPosition = 4;
  currentRotation = 0;
  random =  Math.floor(Math.random()*theTetrominoes.length);
  current = theTetrominoes[random][currentRotation]

  displaySquares.forEach(index => {
    index.classList.remove("tetromino");
    index.style.backgroundColor = "";
  })

  score = 0;
  scoreDisplay.innerHTML = 0;

  clearInterval(timerID);
  timerID = null;
  canMove = false;
})
