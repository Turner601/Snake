const board_border = '#000000';
const board_background = '#ffffff';
const snake_col = 'dodgerblue';
const snake_border = 'darkblue';

// Make the snake => An array of coordinates
let snake = [
    {x: 200, y: 200}, {x: 190, y: 200},
    {x: 180, y: 200}, {x: 170, y: 200},
    {x: 160, y: 200}
];

let score = 0;

let changing_direction = false;

let dx = 10;
let dy = 0;

let foodX;
let foodY;

// Make the canvas
const snakeboard = document.getElementById('snakeboard');
const snakeboard_ctx = snakeboard.getContext('2d');

// Draw the border around the canvas
const clearCanvas = () => {
    snakeboard_ctx.fillStyle = board_background;
    snakeboard_ctx.strokeStyle = board_border;
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

const init = () => {

    if (hasGameEnded()) return;

    changing_direction = false;
    setTimeout(function onTick() {
        clearCanvas();
        drawSnake();
        drawFood();
        moveSnake();

        // Call init() again
        init();

    }, 100)
}

// Draw the snake
const drawSnake = () => {
    snake.forEach(drawSnakePart)
};

// Draw the food
const drawFood = () => {
    snakeboard_ctx.fillStyle = 'yellow';
    snakeboard_ctx.strokeStyle = 'orange';
    snakeboard_ctx.fillRect(foodX, foodY, 10, 10);
    snakeboard_ctx.strokeRect(foodX, foodY, 10, 10);
}

const drawSnakePart = (snakePart) => {
    snakeboard_ctx.fillStyle = snake_col;
    snakeboard_ctx.strokeStyle = snake_border;
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

const hasGameEnded = () => {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall
}

// Randomize the food
const randomFood = (min, max) => {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10
}

const generateFood = () => {
    foodX = randomFood(0, snakeboard.width - 10);
    foodY = randomFood(0, snakeboard.height - 10);

    snake.forEach(function hasSnakeEatenFood(part) {
        const has_eaten = part.x == foodX && part.y == foodY;

        if (has_eaten) {
            generateFood()
        }
    })
}

const changeDirection = (e) => {
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;

    if (changing_direction) return;
    changing_direction = true;

    const keyPressed = e.keyCode;

    const goingUp = dy === -10;
    const goingDown = dy === 10;
    const goingRight = dx === 10;
    const goingLeft = dx === -10;

    if (keyPressed === LEFT && !goingRight) {
        dx = -10;
        dy = 0;
    }

    if (keyPressed === UP && !goingDown) {
        dx = 0;
        dy = -10;
    }

    if (keyPressed === RIGHT && !goingLeft) {
        dx = 10;
        dy = 0;
    }

    if (keyPressed === DOWN && !goingUp) {
        dx = 0;
        dy = 10;
    }
}

const moveSnake = () => {
    // dx (The dx attribute indicates a shift along the x-axis on the position of an element or its content.)
    // dx => the horizontal velocity of the snake, ie, how fast the snake will move to the left or right;
    // ex to the right dx = +10; to the left dx = -10

    // dy => the vertical velocity of the snake (The dy attribute indicates a shift along the y-axis on the position of an element or its content.)
    const head = {x: snake[0].x + dx, y: snake[0].y + dy}
    snake.unshift(head);

    const has_eaten_food = snake[0].x === foodX && snake[0].y === foodY;

    if (has_eaten_food) {
        score += 1;

        let displayScore = document.getElementById('score');
        displayScore.innerText = score;
        generateFood();
    } else {
        snake.pop();
    }
}

init();

document.addEventListener('keydown', changeDirection);

generateFood();