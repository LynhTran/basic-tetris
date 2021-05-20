
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    '#C8D5B9',
    '#EE6C4D',
    '#FFCAE9',
    '#7EB2DD',
    '#FFD791',
    '#414073'
  ]
  //making 200 divs for the grid
  var gridDivs = ""
  for (var i = 0; i < 200; i++) {
      gridDivs += '<div></div>';
  }
  //making bottom for pieces not to fall past the grid
  for (var i = 0; i < 10; i++) {
    gridDivs += '<div class ="taken"></div>';
  }
  // add the divs to the grid
  var container = document.getElementById("grid");
  container.innerHTML = gridDivs;
  //create divs for the next piece display
  var miniGridDivs = ""
  for (var i = 0; i < 15; i++) {
      miniGridDivs += '<div></div>';
  }
  var container2 = document.getElementById("grid2");
  container2.innerHTML = miniGridDivs;

  let squares = Array.from(document.querySelectorAll('.grid div'))

  //The Tetrominoes
  const lPiece = [
    [1, width+1, width*2+1, 0],
    [width*2, width*2+1, width*2+2, width+2],
    [1, width+1, width*2+1, width*2+2],
    [width, width+1, width+2, width*2+2]
  ]
  const revLPiece = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]
  const sPiece = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
  ]
  const zPiece = [
    [1,width,width+1,width*2],
    [width, width+1,width*2+1,width*2+2],
    [1,width,width+1,width*2],
    [width, width+1,width*2+1,width*2+2]
  ]
  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]
  const oPiece = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]
  const longPiece = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]
  const theTetrominoes = [lPiece, revLPiece, sPiece, zPiece, tTetromino, oPiece, longPiece]

  let currentPosition = 4
  let currentRotation = 0

  console.log(theTetrominoes[0][0])

  //randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  //draw the Tetromino
  function draw() {
    // goes through each square of the piece and assigns them the class tetromino
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  //undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''

    })
  }

  //assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37) {          // Left Arrow
      moveLeft()
    } else if (e.keyCode === 38) {  // Up Arrow
      rotate()
    } else if (e.keyCode === 39) {  // Right Arrow
      moveRight()
    } else if (e.keyCode === 40) {  // Down Arrow
      moveDown()
    }
  }
  // watches for commands and executes function according to control function
  document.addEventListener('keyup', control) 

  //move down function
  function moveDown() {
    undraw()
    currentPosition += width //moves down a row
    draw()
    freeze() // checks to see if it can still move
  }

  //freeze function
  function freeze() {
     //execute if any of the squares in the current tetremino is on top of another piece or hits the bottom
     if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      //if true, then the piece stops moving down and is also considered taken
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }
  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }

  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }

  
  ///FIX ROTATION OF TETROMINOS A THE EDGE 
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }
  
  //rotate the tetromino
  function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition()
    draw()
  }
  /////////

  
  
  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0


  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 0],            //lPiece
    [1, displayWidth+1, displayWidth*2+1, 2],            //revLPiece
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //sPiece
    [1,displayWidth,displayWidth+1,displayWidth*2],      // zPiece
    [1, displayWidth, displayWidth+1, displayWidth+2],   //tTetromino
    [0, 1, displayWidth, displayWidth+1],                //oPiece
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //longPiece
  ]

  //display the shape in the mini-grid display
  function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  //add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayShape()
    }
  })

  //add score
  function addScore() {
    for (let i = 0; i < 199; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))) {
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //game over
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
    }
  }

})