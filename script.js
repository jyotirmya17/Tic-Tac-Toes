let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let gameMode = null;
const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function showModal(message) {
    document.querySelector('.modal-content').textContent = message;
    document.querySelector('.modal').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';
}

function closeModal() {
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
    showMenu();
}

function startGame(mode) {
    gameMode = mode;
    gameActive = true;
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    document.querySelector('.menu-buttons').style.display = 'none';
    document.querySelector('.game-board').style.display = 'grid';
    document.querySelector('.back-btn').style.display = 'block';
    updateStatus();
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.removeAttribute('data-player');
        cell.addEventListener('click', handleCellClick);
    });
}

function showMenu() {
    document.querySelector('.menu-buttons').style.display = 'flex';
    document.querySelector('.game-board').style.display = 'none';
    document.querySelector('.back-btn').style.display = 'none';
    document.querySelector('.status').textContent = '';
    gameActive = false;
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (gameBoard[index] || !gameActive) return;

    makeMove(index);
    
    if (gameMode === 'ai' && gameActive) {
        setTimeout(() => {
            makeAIMove();
        }, 500);
    }
}

function makeMove(index) {
    gameBoard[index] = currentPlayer;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.textContent = currentPlayer;
    cell.setAttribute('data-player', currentPlayer);
    cell.style.transform = 'scale(1.1)';
    setTimeout(() => cell.style.transform = 'scale(1)', 200);
    
    if (checkWin()) {
        gameActive = false;
        showModal(`Player ${currentPlayer} Wins!`);
        return;
    }
    
    if (gameBoard.every(cell => cell !== '')) {
        gameActive = false;
        showModal('DRAW!!');
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

function updateStatus() {
    document.querySelector('.status').textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    return winCombos.some(combo => {
        return combo.every(index => {
            return gameBoard[index] === currentPlayer;
        });
    });
}

function makeAIMove() {
    const bestMove = minimax(gameBoard, 'O').index;
    makeMove(bestMove);
}

function minimax(board, player) {
    const availableSpots = getEmptyIndexes(board);
    
    if (checkWinning(board, 'X')) {
        return { score: -10 };
    } else if (checkWinning(board, 'O')) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    
    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];
        board[availableSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(board, 'X');
            move.score = result.score;
        } else {
            const result = minimax(board, 'O');
            move.score = result.score;
        }

        board[availableSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function getEmptyIndexes(board) {
    return board.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
}

function checkWinning(board, player) {
    return winCombos.some(combo => {
        return combo.every(index => {
            return board[index] === player;
        });
    });
}