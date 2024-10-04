let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let difficulty = 'easy';  // Valor por defecto

const gameBoard = document.getElementById("game-board");
const cells = document.querySelectorAll(".cell");
const restartButton = document.getElementById("restart-game");
const startButton = document.getElementById("start-game");

// Modo de dificultad (botones)
document.getElementById("easy").addEventListener("click", () => {
    difficulty = "easy";
    document.getElementById("easy").style.backgroundColor = "#28a745";
    document.getElementById("hard").style.backgroundColor = "#007BFF";
});
document.getElementById("hard").addEventListener("click", () => {
    difficulty = "hard";
    document.getElementById("hard").style.backgroundColor = "#28a745";
    document.getElementById("easy").style.backgroundColor = "#007BFF";
});

// Iniciar juego
startButton.addEventListener("click", () => {
    document.querySelector(".menu").style.display = "none";
    gameBoard.style.display = "block";
});

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleClick(index));
});

restartButton.addEventListener("click", resetGame);

function handleClick(index) {
    if (!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;
    cells[index].textContent = currentPlayer;

    if (checkWinner(currentPlayer)) {
        endGame(`${currentPlayer} gana!`);
    } else if (board.every(cell => cell !== "")) {
        endGame("Empate!");
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        if (currentPlayer === "O") computerMove();
    }
}

function computerMove() {
    if (difficulty === 'easy') {
        let available = board.map((val, index) => val === "" ? index : null).filter(v => v !== null);
        let move = available[Math.floor(Math.random() * available.length)];
        makeMove(move);
    } else if (difficulty === 'hard') {
        let move = minimax(board, "O").index;
        makeMove(move);
    }
}

function makeMove(index) {
    setTimeout(() => {
        board[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        if (checkWinner(currentPlayer)) {
            endGame(`${currentPlayer} gana!`);
        } else if (board.every(cell => cell !== "")) {
            endGame("Empate!");
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
        }
    }, 1000);
}

function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => pattern.every(index => board[index] === player));
}

function endGame(message) {
    gameActive = false;
    setTimeout(() => {
        alert(message);
        restartButton.style.display = "block";
    }, 500);
}

function resetGame() {
    board.fill("");
    currentPlayer = "X";
    gameActive = true;
    cells.forEach(cell => cell.textContent = "");
    restartButton.style.display = "none";
    document.querySelector(".menu").style.display = "block";
    gameBoard.style.display = "none";
}

// Algoritmo Minimax
function minimax(newBoard, player) {
    const emptyIndexes = newBoard.map((val, index) => val === "" ? index : null).filter(v => v !== null);
    if (checkWinner("X")) return { score: -10 };
    if (checkWinner("O")) return { score: 10 };
    if (emptyIndexes.length === 0) return { score: 0 };

    let moves = [];
    emptyIndexes.forEach(index => {
        let move = { index };
        newBoard[index] = player;
        if (player === "O") {
            let result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            let result = minimax(newBoard, "O");
            move.score = result.score;
        }
        newBoard[index] = "";
        moves.push(move);
    });

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        moves.forEach(move => {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach(move => {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        });
    }
    return bestMove;
}
