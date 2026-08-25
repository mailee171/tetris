// Piece shapes defined
function getShapes() {
    const I = [
        [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
        ],
        [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ]
    ];

    const J = [
        [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 1, 1],
            [0, 1, 0],
            [0, 1, 0]
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 1]
        ],
        [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ]
    ];

    const L = [
        [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [1, 0, 0]
        ],
        [
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ]
    ];

    const O = [
        [
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0],
        ]
    ];

    const S = [
        [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        [
            [0, 1, 0],
            [0, 1, 1],
            [0, 0, 1]
        ],
        [
            [0, 0, 0],
            [0, 1, 1],
            [1, 1, 0]
        ],
        [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0]
        ]
    ];

    const T = [
        [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 0]
        ],
        [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ],
        [
            [0, 1, 0],
            [1, 1, 0],
            [0, 1, 0]
        ]
    ];

    const Z = [
        [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        [
            [0, 0, 1],
            [0, 1, 1],
            [0, 1, 0]
        ],
        [
            [0, 0, 0],
            [1, 1, 0],
            [0, 1, 1]
        ],
        [
            [0, 1, 0],
            [1, 1, 0],
            [1, 0, 0]
        ]
    ];

    return { I, J, L, O, S, T, Z };
}

const { I, J, L, O, S, T, Z } = getShapes();

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const gameOverModal = document.getElementById('gameOverModal');
const finalScoreElement = document.getElementById('finalScore');
const modalRestartBtn = document.getElementById('modalRestartBtn');

const ROW = 20;
const COL = 10;
const SQ = 30; // Square size
const VACANT = "rgba(0, 0, 0, 0.1)"; // vacant square color

// Draw a square
function drawSquare(x, y, color, context = ctx) {
    // Clear the previous content in this square
    context.clearRect(x * SQ, y * SQ, SQ, SQ);

    context.fillStyle = color;
    context.fillRect(x * SQ, y * SQ, SQ, SQ);

    context.strokeStyle = "rgba(255, 255, 255, 0.1)";
    context.strokeRect(x * SQ, y * SQ, SQ, SQ);

    // Add a highlight for "pretty" effect
    if (color !== VACANT) {
        context.fillStyle = "rgba(255, 255, 255, 0.2)";
        context.fillRect(x * SQ + 2, y * SQ + 2, SQ - 4, 4);
        context.fillRect(x * SQ + 2, y * SQ + 2, 4, SQ - 4);
    }
}

// Create the board
let board = [];
for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

// Draw the board
function drawBoard() {
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

// The pieces and their colors
const PIECES = [
    [Z, "#ff7b72"],
    [S, "#7ee787"],
    [T, "#d2a8ff"],
    [O, "#e3b341"],
    [L, "#ffa657"],
    [I, "#58a6ff"],
    [J, "#1f6feb"]
];

// Generate random pieces
let pieceSequence = [];

function generateNextPiece() {
    if (pieceSequence.length === 0) {
        pieceSequence = [0, 1, 2, 3, 4, 5, 6];
        // Shuffle
        for (let i = pieceSequence.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pieceSequence[i], pieceSequence[j]] = [pieceSequence[j], pieceSequence[i]];
        }
    }
    const r = pieceSequence.pop();
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

// The Piece Object
function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0; // we start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // control the pieces
    this.x = 3;
    this.y = -2;
}

// Fill function
Piece.prototype.fill = function (color, context = ctx) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            // we draw only occupied squares
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color, context);
            }
        }
    }
};

// Draw a piece to the board
Piece.prototype.draw = function () {
    this.fill(this.color);
};

// Undraw a piece
Piece.prototype.unDraw = function () {
    this.fill(VACANT);
};

// Move Down the piece
Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        // we lock the piece and generate a new one
        this.lock();
        p = nextP;
        nextP = generateNextPiece();
        drawNextPreview();
    }
};

// Move Right the piece
Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
};

// Move Left the piece
Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
};

// Rotate the piece
Piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            // it's the right wall
            kick = -1;
        } else {
            // it's the left wall
            kick = 1;
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
};

let score = 0;

Piece.prototype.lock = function () {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            // we skip the vacant squares
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            // pieces to lock on top = game over
            if (this.y + r < 0) {
                gameOver = true;
                showGameOver();
                break;
            }
            // we lock the piece
            board[this.y + r][this.x + c] = this.color;
        }
    }
    // remove full rows
    let fullRows = 0;
    for (let r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (let c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] !== VACANT);
        }
        if (isRowFull) {
            fullRows++;
            // if the row is full, we move down all the rows above it
            for (let y = r; y > 1; y--) {
                for (let c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            // the top row board[0][c] has no row above it
            for (let c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
        }
    }

    if (fullRows > 0) {
        updateScore(fullRows);
        drawBoard();
    }
};

function updateScore(rows) {
    const scores = { 1: 50, 2: 150, 3: 250, 4: 500 };
    score += scores[rows] || 0;
    scoreElement.innerHTML = score;
}

// Collision detection
Piece.prototype.collision = function (x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece.length; c++) {
            // if the square is empty, we skip it
            if (!piece[r][c]) {
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // conditions
            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            // newY < 0; we only check if the piece hit something below
            if (newY < 0) {
                continue;
            }
            // check if there is a locked piece already in place
            if (board[newY][newX] !== VACANT) {
                return true;
            }
        }
    }
    return false;
};

// Control the piece
document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (gameOver || isPaused || !gameStarted) return;

    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
}

// Game State
let p = generateNextPiece();
let nextP = generateNextPiece();
let gameOver = false;
let isPaused = false;
let gameStarted = false;
let dropStart = Date.now();

function drawNextPreview() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    // Center the next piece in preview
    const offsetX = (nextCanvas.width / SQ - nextP.activeTetromino.length) / 2;
    const offsetY = (nextCanvas.height / SQ - nextP.activeTetromino.length) / 2;

    for (let r = 0; r < nextP.activeTetromino.length; r++) {
        for (let c = 0; c < nextP.activeTetromino.length; c++) {
            if (nextP.activeTetromino[r][c]) {
                drawSquare(offsetX + c, offsetY + r, nextP.color, nextCtx);
            }
        }
    }
}

function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver && !isPaused) {
        requestAnimationFrame(drop);
    }
}

// UI Buttons
startBtn.addEventListener('click', () => {
    if (!gameStarted) {
        gameStarted = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        drawBoard();
        p.draw();
        drawNextPreview();
        dropStart = Date.now();
        drop();
    }
});

pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.innerText = isPaused ? '계속' : '멈춤';
    if (!isPaused) {
        dropStart = Date.now();
        drop();
    }
});

restartBtn.addEventListener('click', resetGame);
modalRestartBtn.addEventListener('click', resetGame);

function resetGame() {
    gameOver = false;
    isPaused = false;
    gameStarted = true;
    score = 0;
    scoreElement.innerHTML = score;
    gameOverModal.classList.add('hidden');
    board = [];
    for (let r = 0; r < ROW; r++) {
        board[r] = [];
        for (let c = 0; c < COL; c++) {
            board[r][c] = VACANT;
        }
    }
    drawBoard();
    p = generateNextPiece();
    nextP = generateNextPiece();
    drawNextPreview();
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.innerText = '멈춤';
    dropStart = Date.now();
    drop();
}

function showGameOver() {
    finalScoreElement.innerText = score;
    gameOverModal.classList.remove('hidden');
    pauseBtn.disabled = true;
}

