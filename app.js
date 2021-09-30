document.addEventListener('DOMContentLoaded', ()=> {
    const grid = document.querySelector('grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
 //Tetris members
 const lTetromino = [
     [1, width+1, width*2+1,2],
     [width,width+1, width+2, width*2+2],
     [1,width+1,width*2+1,width*2+2],
     [width, width*2, width*2+1, width*2+2],

 ]

 const zTetromino = [
     [0, width, width+1,width*2+1],
     [width+1, width +2, width*2, width*2+1],
     [0, width,width+1, width*2+1],
     [width+1, width+2, width*2, width*2+1]        
]

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2 +1],
    [1,width, width+1, width*2+1]
]

const oTetromino = [
    [0,1, width, width+1],
    [0,1, width, width+1],
    [0,1, width, width+1],
    [0,1, width, width+1]

]

const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width, width+1, width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width, width+1, width+2,width+3],
]

const theTetrominoes = [lTetromino, zTetromino, tTetromino,oTetromino, iTetromino]

let currentPosition = 4;
let currentRotation = 0;

//randomly select a tetromino and its first rotation (Math.random & Math.floor)
let random = Math.floor(Math.random()*theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];

//draw the first rotation of first tetromino

function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
    })
}

//clear the rotation
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
    })
}

//make the tetromino move down in the game area when game is loaded
//timerId = setInterval(moveDown, 200);

//assign keyCodes for the functions
function control(e) {
 if(e.keyCode === 37) {
    moveLeft();
 } else if(e.keyCode === 38) {
   rotate();
 }else if(e.keyCode === 39) {
   moveRight();
 } else if (e.keyCode === 40) {
     moveDown();
 }

}

document.addEventListener('keyup',control)

function moveDown () {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

//freeze when touch the bottom
function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //start a new tetromino falling again
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw();
        displayShape();
        addScore();
        gameOver();
    }
}

function moveLeft () {
    undraw();
    const isAtTheLeft = current.some(index => (currentPosition + index) % width === 0);

    if(!isAtTheLeft) currentPosition -=1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
        draw();
    }
}

function moveRight() {
    undraw();
    const isAtTheRight = current.some(index => (currentPosition + index) % width === width -1);
   
    if(!isAtTheRight) currentPosition +=1;

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1 ;
        draw();
    }
}

function rotate() {
    undraw();
    currentRotation ++
    if(currentRotation === current.length) {   //if the current rotation is 4 then we'll go back to the first rotation again
        currentRotation = 0;
    }

     current = theTetrominoes[random][currentRotation];
     draw();
}

//preview of next tetromino in mini-grid display

const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;
//let nextRandom = 0;

//the Tetrominos without rotations
const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]

//display the shape in the mini-grid display
function displayShape()
{
    //remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino')
    });
    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
    }); 
}

//start&pause 
startBtn.addEventListener('click', () => {
    if(timerId)
    {
        clearInterval(timerId);
        timerId = null;
    }else {
        draw();
        timerId = setInterval(moveDown, 200);
        nextRandom = Math.round(Math.random()*theTetrominoes.length);
        displayShape();
    }
});

//Score adding
function addScore () {
    for(let i = 0; i< 199 ; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score +=10;
            scoreDisplay.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
            });
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));
        }
    }
}

//gameover
function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end',
        clearInterval(timerId);

    }
}



})
