const startBtn = document.getElementById('start-button')
const canvas = document.querySelector("canvas");
const canvasW = canvas.width
const canvasH = canvas.height

const ctx = canvas.getContext("2d");

const roadImg = new Image();
roadImg.src = "./images/road.png"

const carImg = new Image();
carImg.src = "./images/car.png"
const carScale = 0.25;
const carW = 158 * carScale;
const carH = 319 * carScale;

const roadBackground = {
  img: roadImg,
  x: 0,
  y: 0,
  speed: 5,

  move: function() {
    this.y += this.speed;
    this.y %= canvasH;
  },

  draw: function() {
    ctx.drawImage(this.img, 0, this.y, canvasW, canvasH);
    if (this.speed < 0) {
      ctx.drawImage(this.img, 0, this.y + canvasH, canvasW, canvasH);
    }
    else {
      ctx.drawImage(this.img, 0, this.y - canvasH, canvasW, canvasH);
    }
  },
};

class Car {
  constructor(posX, posY, width, height, speed) {
    this.width = width;
    this.height = height
    this.posX = posX;
    this.posY = posY;
    this.speed = speed;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  moveRight() {
    this.posX = this.posX + this.speed;
  }

  moveLeft() {
    this.posX = this.posX - this.speed;
  }

  getBoundRight() {
    return this.posX + this.width;
  }

  getBoundBottom() {
    return this.posY + this.height;
  }
}

function checkCollision(entityA, entityB) {
  return (entityA.getBoundRight() >= entityB.posX &&
          entityA.getBoundBottom() >= entityB.posY &&
          entityA.posY <= entityB.getBoundBottom() &&
          entityA.posX <= entityB.getBoundRight());
}

const carSpawnX = (canvasW - carW) / 2;
const carSpawnY = carH + 490;

const playerCar = new Car(carSpawnX, carSpawnY, carW, carH, 10);

window.onload = () => {
  startBtn.onclick = () => {
    startBtn.disabled = 'true';
    startBtn.style.backgroundColor = 'grey';
    startGame();
  };

  function startGame() {
    gamePlayID = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(roadImg, 0, 0, canvasW, canvasH);

      // Drawing logic
      ctx.clearRect(0, 0, canvasW, canvasH)

      roadBackground.draw();
      roadBackground.move();

      ctx.drawImage(carImg, playerCar.posX, playerCar.posY, playerCar.width, playerCar.height);
    });
  }
};

// Player Controls
let keysPressed = {}

window.addEventListener("keydown", event => {
  keysPressed[event.code] = true;

  if (keysPressed["ArrowRight"]) {
    if (playerCar.getBoundRight() < canvasW - 50) {
      playerCar.moveRight();
    }
  }

  if (keysPressed["ArrowLeft"]) {
    if (playerCar.posX > 50) {
      playerCar.moveLeft();
    }
  }
});

window.addEventListener("keyup", event => {
  delete keysPressed[event.code];
});