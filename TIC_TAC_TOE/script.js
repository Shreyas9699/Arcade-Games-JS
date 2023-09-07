const statusDisplay = document.querySelector('.status');
let gameActive = true;
let currPlayer = "X";
let gameState = ["","","","","","","","",""];
const winMsg = () => `Player ${currPlayer} has won!`;
const drawMsg = () => `Game has ended in DRAW!`;
const currPlayerTrun = () => `It's ${currPlayer}'s turn`;

// console.log(statusDisplay, currPlayer, currPlayerTrun, gameActive, gameState);

statusDisplay.innerHTML = currPlayerTrun();

function handleCellPlayed (clickedCell, clickedCellIndex){
	console.log("Player clicked: ",currPlayer);
	gameState[clickedCellIndex] = currPlayer;
	console.log("After click: ",gameState);
	clickedCell.innerHTML = currPlayer;
}

function handlePlayerChange(){
	currPlayer = currPlayer === "X" ? "O" : "X";
	statusDisplay.innerHTML = currPlayerTrun();
}

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleResultVal() {
	// console.log("Inside handleResultVal");
	let roundWon = false;
	for (let i = 0; i<=7; i++) {
		const WinCond = winningConditions[i];
		let a = gameState[WinCond[0]];
		let b = gameState[WinCond[1]];
		let c = gameState[WinCond[2]];
		// console.log(a, b, c, "RoundWon = ",roundWon);
		// console.log(a===b);
		if(a===b && b===c && c!=="") {
			console.log(currPlayer, " Won the match, ending the game");
			roundWon = true;
			break;
		}
	}
	if(roundWon){
		statusDisplay.innerHTML = winMsg();
		gameState = false;
		return;
	}

	let roundDraw = !gameState.includes("");
	// console.log("RoundDraw = ",roundDraw);
	if (roundDraw) {
		statusDisplay.innerHTML = drawMsg();
		console.log("Game Draw!");
		gameActive = false;
		return;
	}
	handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
	// console.log(currPlayer);
	const clickedCell = clickedCellEvent.target;
	// console.log(clickedCell);
	const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
	// console.log(clickedCellIndex);
	if (gameState[clickedCellIndex] !== "" || !gameActive) {
		console.log("Is empty/game inactive, click restart fr new game!");
		return;
	}

	handleCellPlayed(clickedCell, clickedCellIndex);
	handleResultVal();
}

function handleGameRestart() {
	gameActive = true;
	currPlayer = "X";
	gameState = ["","","","","","","","",""];
	statusDisplay.innerHTML = currPlayerTrun();
	document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = ""); 
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.restart').addEventListener('click', handleGameRestart);