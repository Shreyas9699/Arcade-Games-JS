const gameBox = document.getElementById('gameBox');
const win = gameBox.getContext('2d');
// requirements:
// snake -> its pos, size
// drop random foods
// increase snake size when it eats and speed
// game over if snake easts itself or hits the border

var speed = 7;
// var tileCount = 20; // tilecount is sqrt of width of gamebox size
width = gameBox.clientWidth;
height = gameBox.clientHeight;
var tileCountX = Math.sqrt(width);
var tileCountY = Math.sqrt(height);
var tileSizeX = width / tileCountX;
var tileSizeY = height / tileCountY;

console.log("tileSizeX: " + tileSizeX);
console.log("tileSizeY: " + tileSizeY);
console.log("tileCountX: " + tileCountX);
console.log("tileCountY: " + tileCountY);

var SnakeBody = [];
var tailLenght=2;

var headPosX = Math.floor(Math.random() * tileCountX); //Math.floor(Math.random() * tileCount)
var headPosY = Math.floor(Math.random() * tileCountY);

var xSpeed = 0;
var ySpeed = 0;

var xFoodPos = Math.floor(Math.random() * (tileCountX-1));
var yFoodPos = Math.floor(Math.random() * (tileCountY-1));

var score = 0;

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

class snakeBodyPart {
    constructor(x, y){
        this.x = x;
        this.y = y
    }
}

function randColor () {
    let hexCode = Math.floor(Math.random()*16777215).toString(16);
    return hexCode;
}

function startGame() {
    inPos();
    let result = isGameOver();
    if(result){
        return
    }
    displayScreen();
    displaySnake();
    dropFood();
    isFoodTaken();
    // displayScore();
    // console.log("Snake head position is : "+ headPosX + " " +headPosX);
    setTimeout(startGame, 1000/speed);
}

function isGameOver() {
    let gameOverStatus = false;
    if(ySpeed === 0 && xSpeed === 0){
        return false;
    }
    if(headPosX < 0){
        gameOverStatus = true;
    }
    else if(headPosX >= tileCountX-1){
        gameOverStatus = true;
    }
    else if(headPosY < 0){
        gameOverStatus = true;
    }
    else if(headPosY >= tileCountY-1){
        gameOverStatus = true;
    }

    //to check if it eat itslef/colid with itself

    for(let i = 0; i < SnakeBody.length; i++){
        let snakeBodyPart = SnakeBody[i];
        if(snakeBodyPart.x === headPosX && snakeBodyPart.y === headPosY){
            gameOverStatus = true;
            break;
        }
    }

    if(gameOverStatus){
        win.fillStyle = "whitesmoke";
        win.font = "12px verdana";
        // win.fillText("Oops....Game Over! Your score is: "+ score, gameBox.clientWidth/6.5, gameBox.clientHeight/2);
        console.log("Game over! Score is: "+score)
        alert("Game Over! Your score is: "+ score);

        // Apply blur effect to the gameBox canvas
        gameBox.classList.add('blur');
        // Highlight the reset button
        document.getElementById('resetButton').classList.add('highlight');
    }

    return gameOverStatus;
}

function displayScreen() {
    win.fillStyle = "black";
    win.fillRect(0, 0, gameBox.clientWidth, gameBox.clientHeight);
}

function displaySnake() {
    win.fillStyle = `#${randColor()}`;

    for(let i = 0; i<SnakeBody.length; i++){
        let snakeBodyPart = SnakeBody[i];
        win.fillRect(snakeBodyPart.x * tileCountX, snakeBodyPart.y * tileCountY, tileSizeX, tileSizeY);
    }

    SnakeBody.push(new snakeBodyPart(headPosX, headPosY));
    if(SnakeBody.length > tailLenght) {
        SnakeBody.shift();
    }
    win.fillStyle = "red";
    win.fillRect(headPosX * tileCountX, headPosY * tileCountY, tileSizeX, tileSizeY);
}

function inPos() {
    headPosX = headPosX + xSpeed;
    headPosY = headPosY + ySpeed;
}

function dropFood() {
    win.fillStyle = "yellow";
    var circleRadiusX = tileSizeX / 2;
    var circleRadiusY = tileSizeY / 2;
    // Adjust the position of the food to fit the grid
    var circleCenterX = xFoodPos * tileSizeX + circleRadiusX;
    var circleCenterY = yFoodPos * tileSizeY + circleRadiusY;
    win.beginPath();
    win.arc(circleCenterX, circleCenterY, circleRadiusY, 0, 2 * Math.PI);
    win.fill();
    // win.fillRect(xFoodPos * tileCount, yFoodPos * tileCount, tileSize, tileSize);
}

function isFoodTaken() {
    if (xFoodPos == headPosX && yFoodPos == headPosY) {
        xFoodPos = Math.floor(Math.random() * (tileCountX-1));
        yFoodPos = Math.floor(Math.random() * (tileCountY-1));
        tailLenght++;
        score++;
    }
}

document.body.addEventListener('keydown', snakeMovement);

function snakeMovement(event) {
	const keyPressed = event.keyCode;
    const goingUp = ySpeed === -1;
    const goingDown = ySpeed === 1;
    const goingRight = xSpeed === 1;  
    const goingLeft = xSpeed === -1;

    if(event.keyCode === LEFT_KEY && !goingRight) {
        ySpeed = 0;
        xSpeed = -1;
    }

    if(event.keyCode === UP_KEY && !goingDown) {
        ySpeed = -1;
        xSpeed = 0;
    }

    if(event.keyCode === RIGHT_KEY && !goingLeft) {
        ySpeed = 0;
        xSpeed = 1;
    }

    if(event.keyCode === DOWN_KEY && !goingUp) {
        ySpeed = 1;
        xSpeed = 0;
    }
}

function reset() {
    console.log("The game has been reset!");
    SnakeBody.length = 0;
    tailLenght=2;

    headPosX = Math.floor(Math.random() * tileCountX); //Math.floor(Math.random() * tileCount)
    headPosY = Math.floor(Math.random() * tileCountY);

    xSpeed = 0;
    ySpeed = 0;

    xFoodPos = Math.floor(Math.random() * tileCountX);
    yFoodPos = Math.floor(Math.random() * tileCountY);

    score = 0;
    
    // Remove the blur effect from the gameBox canvas
    gameBox.classList.remove('blur');

    // Remove the highlight from the reset button
    document.getElementById('resetButton').classList.remove('highlight');

    startGame();
}

startGame();