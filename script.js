// Variabili di gioco
let canvas;
let context;
let canvasWidth;
let canvasHeight;
let gameInterval;
let isGameOver;

let playerX;
let playerY;
let playerSize;
let playerSpeed;
let diagonalSpeed;

let balls;
let ballSize;
let ballSpeed;
let ballSpawnInterval;

let score;

// Inizializzazione del gioco
function startGame() {
  canvas = document.getElementById("gameCanvas");
  context = canvas.getContext("2d");
  canvasWidth = canvas.width;
  canvasHeight = canvas.height;
  playerX = canvasWidth / 2;
  playerY = canvasHeight / 2;
  playerSize = 5;
  playerSpeed = 1;
  diagonalSpeed = Math.sqrt(playerSpeed * playerSpeed) / 2;
  balls = [];
  ballSize = 30;
  ballSpeed = 1;
  ballSpawnInterval = 4000;
  score = 0;
  isGameOver = false;

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);

  gameInterval = setInterval(updateGame, 20);

  spawnBall();
}

// Funzione per disegnare il giocatore
function drawPlayer() {
  context.fillStyle = "blue";
  context.fillRect(playerX, playerY, playerSize, playerSize);
}

// Funzione per gestire gli input da tastiera
let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;

function handleKeyDown(event) {
  if (isGameOver) {
    return;
  }

  switch (event.key) {
    case "w":
    case "ArrowUp":
      moveUp = true;
      break;
    case "s":
    case "ArrowDown":
      moveDown = true;
      break;
    case "a":
    case "ArrowLeft":
      moveLeft = true;
      break;
    case "d":
    case "ArrowRight":
      moveRight = true;
      break;
    default:
      break;
  }
}

function handleKeyUp(event) {
  if (isGameOver) {
    return;
  }

  switch (event.key) {
    case "w":
    case "ArrowUp":
      moveUp = false;
      break;
    case "s":
    case "ArrowDown":
      moveDown = false;
      break;
    case "a":
    case "ArrowLeft":
      moveLeft = false;
      break;
    case "d":
    case "ArrowRight":
      moveRight = false;
      break;
    default:
      break;
  }
}

// Funzione per aggiornare la posizione del giocatore
function updatePlayerPosition() {
  if (moveUp) {
    playerY -= playerSpeed;
  }
  if (moveDown) {
    playerY += playerSpeed;
  }
  if (moveLeft) {
    playerX -= playerSpeed;
  }
  if (moveRight) {
    playerX += playerSpeed;
  }

  // Controlla che il personaggio rimanga all'interno del canvas
  if (playerX < 0) {
    playerX = 0;
  } else if (playerX + playerSize > canvasWidth) {
    playerX = canvasWidth - playerSize;
  }

  if (playerY < 0) {
    playerY = 0;
  } else if (playerY + playerSize > canvasHeight) {
    playerY = canvasHeight - playerSize;
  }
}

// Funzione per disegnare le palline
function drawBalls() {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    context.fillStyle = "red";
    context.beginPath();
    context.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }
}

// Funzione per generare una traiettoria casuale
function generateRandomTrajectory() {
  const angle = Math.random() * Math.PI * 2; // Angolo casuale tra 0 e 2pi
  const speed = Math.random() * ballSpeed + ballSpeed; // Velocità casuale tra ballSpeed e 2 * ballSpeed

  return {
    dx: Math.cos(angle) * speed, // Componente x del vettore velocità
    dy: Math.sin(angle) * speed, // Componente y del vettore velocità
  };
}

// Funzione per aggiornare il contatore delle palline a schermo
function updateBallCounter() {
  const ballCounter = document.getElementById("ball-counter");
  ballCounter.innerText = balls.length;
}

// Funzione per aggiornare la posizione delle palline
function updateBallsPosition() {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];

    if (!ball.trajectory) {
      // Genera una nuova traiettoria casuale se non ne ha ancora una
      ball.trajectory = generateRandomTrajectory();
    }

    // Aggiorna la posizione in base alla traiettoria
    ball.x += ball.trajectory.dx;
    ball.y += ball.trajectory.dy;

    // Controlla se la pallina raggiunge i bordi del canvas
    if (ball.x - ballSize < 0 || ball.x + ballSize > canvasWidth) {
      ball.trajectory.dx *= -1; // Inverte la direzione orizzontale
    }
    if (ball.y - ballSize < 0) {
      ball.trajectory.dy *= -1; // Inverte la direzione verticale
    } else if (ball.y + ballSize > canvasHeight) {
      ball.y = canvasHeight - ballSize; // Imposta la posizione sulla parte inferiore del canvas
      ball.trajectory.dy *= -1; // Inverte la direzione verticale
    }
  }
  // Aggiorna il contatore delle palline
  updateBallCounter();
}

// Funzione per generare una nuova pallina
function spawnBall() {
  const ball = {
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
  };
  balls.push(ball);

  setTimeout(spawnBall, ballSpawnInterval);
}

// Funzione per controllare la collisione tra il giocatore e le palline
function checkCollision() {
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    const dx = ball.x - (playerX + playerSize / 2);
    const dy = ball.y - (playerY + playerSize / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ballSize + playerSize) {
      balls.splice(i, 1);
      i--;

      score++;

      if (playerSpeed < 50) {
        playerSpeed++;
      }

      if (playerSize < 50) {
        playerSize++;
      }

      if (ballSpawnInterval > 500) {
        ballSpawnInterval -= 250;
      }

      if (ballSize > 5) {
        ballSize--;
      }
    }
  }
}

// Funzione per aggiornare il punteggio
function updateScore() {
  const scoreElement = document.getElementById("score");
  scoreElement.innerText = score;
}

// Funzione per controllare la fine del gioco
function checkGameOver() {
  if (balls.length > 50) {
    isGameOver = true;
    clearInterval(gameInterval);

    const finalScoreElement = document.getElementById("finalScore");
    finalScoreElement.innerText = "Game Over. Final Score: " + score;
  }
}

// Funzione per aggiornare il gioco
function updateGame() {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  drawPlayer();
  updatePlayerPosition();

  drawBalls();
  updateBallsPosition();

  checkCollision();
  updateScore();
  checkGameOver();
}

// Avvia il gioco
startGame();
