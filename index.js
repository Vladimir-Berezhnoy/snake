var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// CREATE CANVAS
var canvas = (document.querySelector("canvas"));
// for 50x50 field use 500px
canvas.width = 500;
canvas.height = 500;
var ctx = (canvas.getContext("2d"));
// MOVING DIRECTION
var Direction;
(function (Direction) {
    Direction[Direction["Right"] = 0] = "Right";
    Direction[Direction["Left"] = 1] = "Left";
    Direction[Direction["Down"] = 2] = "Down";
    Direction[Direction["Up"] = 3] = "Up";
})(Direction || (Direction = {}));
// GAME
var Game = /** @class */ (function () {
    function Game() {
        this.INITIAL_POSITION = [{ x: 0, y: 0 }];
        this.INITIAL_DIRECTION = Direction.Right;
        this.food = {};
        this.speed = 10;
        this.tail = __spreadArray([], this.INITIAL_POSITION, true);
        this.direction = this.INITIAL_DIRECTION;
        this.score = 0;
        this.gameOver = false;
        this.isGame = false;
        this.canEat = false;
    }
    // Initial frame
    Game.prototype.initGameInfo = function () {
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.globalAlpha = 1;
        ctx.fillText("Press Enter to Start", canvas.width / 2, canvas.height / 2);
    };
    Game.prototype.startGame = function () {
        this.initGameInfo();
        this.startGameListener();
    };
    Game.prototype.startGameListener = function () {
        var _this = this;
        var startGameListener = function (event) {
            if (event.keyCode === 13) {
                // start game and remove listener on enter
                _this.isGame = true;
                document.removeEventListener("keyup", startGameListener);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                _this.move();
                _this.foodGenerator();
            }
        };
        document.addEventListener("keyup", startGameListener);
    };
    // DIRECTION HANDLER
    Game.prototype.setDirection = function (direction) {
        this.direction = direction;
    };
    // DRAW FUNC
    Game.prototype.draw = function () {
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
        ctx.rect(this.food.x, this.food.y, 10, 10);
        ctx.fill();
        // DRAW SNAKE
        this.tail.forEach(function (item, index) {
            // colorize snake
            if (index % 2 === 0) {
                ctx.fillStyle = "#008000";
            }
            else {
                ctx.fillStyle = "#111111";
            }
            ctx.beginPath();
            ctx.rect(item.x, item.y, 10, 10);
            ctx.fill();
        });
        this.isDead();
        this.eatFood();
    };
    Game.prototype.move = function () {
        var _this = this;
        var head = __assign({}, this.tail[this.tail.length - 1]);
        var newHead = __assign({}, head);
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
        }
        else {
            this.canEat = !this.canEat;
        }
        this.tail.push(newHead);
        this.draw();
        // NEXT FRAME HANDLER
        setTimeout(function () {
            if (!_this.gameOver) {
                requestAnimationFrame(function () { return _this.move(); });
            }
            else {
                // draw and game alert
                ctx.textAlign = "center";
                ctx.fillStyle = "#fff";
                ctx.globalAlpha = 1;
                ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
                ctx.fillText("Press Enter to Restart", canvas.width / 2, canvas.height / 2 + 30);
                // create new game for restart
                game = new Game();
                game.startGameListener();
            }
        }, 80 - this.score * 1.5);
    };
    Game.prototype.isDead = function () {
        var _this = this;
        var head = __assign({}, this.tail[this.tail.length - 1]);
        this.tail.forEach(function (item, index) {
            // is snake inside field
            var isInside = head.x < canvas.width &&
                head.y < canvas.height &&
                head.x >= 0 &&
                head.y >= 0;
            if (index === _this.tail.length - 1 && isInside) {
                return;
            }
            else if (!isInside || (head.x === item.x && head.y === item.y)) {
                _this.gameOver = true;
            }
        });
    };
    Game.prototype.foodGenerator = function () {
        // randomize x,y food position
        var foodX = Math.floor(Math.random() * (canvas.width / 10)) * 10;
        var foodY = Math.floor(Math.random() * (canvas.height / 10)) * 10;
        // checker is snake position on food position
        var foodInside = false;
        for (var _i = 0, _a = this.tail; _i < _a.length; _i++) {
            var item = _a[_i];
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
    };
    Game.prototype.eatFood = function () {
        var head = __assign({}, this.tail[this.tail.length - 1]);
        if (head.x === this.food.x && head.y === this.food.y) {
            this.canEat = true;
            this.score += 1;
            this.foodGenerator();
        }
    };
    return Game;
}());
// CREATE NEW INSTANCE
var game = new Game();
// START GAME
game.startGame();
// MOVEMENT LISTENER CONTROL
document.addEventListener("keyup", function (event) {
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
