// CREATE CANVAS
const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.querySelector("canvas")
);
// for 50x50 field use 500px
canvas.width = 500;
canvas.height = 500;
const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>(
  canvas.getContext("2d")
);

// MOVING DIRECTION
enum Direction {
  Right,
  Left,
  Down,
  Up,
}

// GAME
class Game {
  readonly INITIAL_POSITION = [{ x: 0, y: 0 }];
  readonly INITIAL_DIRECTION: Direction = Direction.Right;

  private speed: number;
  private food: { x?: number; y?: number };
  private tail: { x: number; y: number }[];
  private score: number;
  private gameOver: boolean;
  private canEat: boolean;
  direction: Direction;
  isGame: boolean;

  constructor() {
    this.food = {};
    this.speed = 10;
    this.tail = [...this.INITIAL_POSITION];
    this.direction = this.INITIAL_DIRECTION;
    this.score = 0;
    this.gameOver = false;
    this.isGame = false;
    this.canEat = false;
  }

  // Initial frame
  initGameInfo() {
    ctx.font = "24px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 1;
    ctx.fillText("Press Enter to Start", canvas.width / 2, canvas.height / 2);
  }

  startGame() {
    this.initGameInfo();
    this.startGameListener();
  }

  startGameListener() {
    const startGameListener = (event: KeyboardEvent) => {
      if (event.keyCode === 13) {
        // start game and remove listener on enter
        this.isGame = true;
        document.removeEventListener("keyup", startGameListener);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.move();
        this.foodGenerator();
      }
    };
    document.addEventListener("keyup", startGameListener);
  }

  // DIRECTION HANDLER
  setDirection(direction: Direction) {
    this.direction = direction;
  }

  // DRAW FUNC
  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // DRAW SCORE
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 0.5;
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";
    ctx.fillText("Score : " + this.score, 5, canvas.height);

    // DRAW FOOD
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ff0000";
    ctx.rect(this.food.x!, this.food.y!, 10, 10);
    ctx.fill();

    // DRAW SNAKE
    this.tail.forEach((item, index) => {
      // colorize snake
      if (index % 2 === 0) {
        ctx.fillStyle = "#008000";
      } else {
        ctx.fillStyle = "#111111";
      }
      ctx.beginPath();
      ctx.rect(item.x, item.y, 10, 10);
      ctx.fill();
    });

    this.isDead();

    this.eatFood();
  }

  move() {
    const head = { ...this.tail[this.tail.length - 1] };
    const newHead = { ...head };
    switch (this.direction) {
      case Direction.Right:
        newHead.x += this.speed;
        break;
      case Direction.Left:
        newHead.x -= this.speed;
        break;
      case Direction.Down:
        newHead.y += this.speed;
        break;
      case Direction.Up:
        newHead.y -= this.speed;
        break;
    }

    // SNAKE SIZE CONTROL
    if (!this.canEat) {
      this.tail.shift();
    } else {
      this.canEat = !this.canEat;
    }

    this.tail.push(newHead);
    this.draw();

    // NEXT FRAME HANDLER
    setTimeout(() => {
      if (!this.gameOver) {
        requestAnimationFrame(() => this.move());
      } else {
        // draw and game alert
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 1;
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        ctx.fillText(
          "Press Enter to Restart",
          canvas.width / 2,
          canvas.height / 2 + 30
        );
        // create new game for restart
        game = new Game();
        game.startGameListener();
      }
    }, 80 - this.score * 1.5);
  }

  isDead() {
    const head = { ...this.tail[this.tail.length - 1] };
    this.tail.forEach((item, index) => {
      // is snake inside field
      const isInside =
        head.x < canvas.width &&
        head.y < canvas.height &&
        head.x >= 0 &&
        head.y >= 0;
      if (index === this.tail.length - 1 && isInside) {
        return;
      } else if (!isInside || (head.x === item.x && head.y === item.y)) {
        this.gameOver = true;
      }
    });
  }

  foodGenerator() {
    // randomize x,y food position
    const foodX = Math.floor(Math.random() * (canvas.width / 10)) * 10;
    const foodY = Math.floor(Math.random() * (canvas.height / 10)) * 10;
    // checker is snake position on food position
    let foodInside = false;
    for (let item of this.tail) {
      if (item.x === foodX && item.y === foodY) {
        foodInside = true;
        break;
      }
    }
    // if food inside generate new food
    if (foodInside) {
      this.foodGenerator();
      return;
    }

    this.food.x = foodX;
    this.food.y = foodY;
  }

  eatFood() {
    const head = { ...this.tail[this.tail.length - 1] };
    if (head.x === this.food.x && head.y === this.food.y) {
      this.canEat = true;
      this.score += 1;
      this.foodGenerator();
    }
  }
}

// CREATE NEW INSTANCE
let game = new Game();

// START GAME
game.startGame();

// MOVEMENT LISTENER CONTROL
document.addEventListener("keyup", (event) => {
  if (game.isGame) {
    switch (event.keyCode) {
      case 39:
        if (game.direction !== Direction.Left) {
          game.setDirection(Direction.Right);
        }
        break;
      case 37:
        if (game.direction !== Direction.Right) {
          game.setDirection(Direction.Left);
        }
        break;
      case 40:
        if (game.direction !== Direction.Up) {
          game.setDirection(Direction.Down);
        }
        break;
      case 38:
        if (game.direction !== Direction.Down) {
          game.setDirection(Direction.Up);
        }
        break;
    }
  }
});
