
// 初始化数字华容道
const puzzleContainer = document.getElementById('puzzle-container');
const stepCounter = document.getElementById('step-counter');
let steps = 0;
let gridSize = 3;  // 初始阶数
let puzzleState = generatePuzzleState(gridSize);
let goalState = generatePuzzleState(gridSize);
randomPuzzle();
renderPuzzle();
function generatePuzzleState(size) {
    let puzzleState = [];
    let counter = 1;

    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push(counter++);
        }
        puzzleState.push(row);
    }

    puzzleState[size - 1][size - 1] = 0; // Set the last element as null
    return puzzleState;
}

function changeGridSize() {
    gridSize = parseInt(document.getElementById('grid-size').value);
    puzzleState = generatePuzzleState(gridSize);
    goalState = generatePuzzleState(gridSize);
    steps = 0;
    document.getElementById("puzzle-container").style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
    randomPuzzle();
    renderPuzzle();
}
document.getElementById("grid-size").addEventListener('change', () => changeGridSize());


// function renderPuzzle() {
//     puzzleContainer.innerHTML = '';
//     puzzleState.forEach((row, rowIndex) => {
//         row.forEach((number, colIndex) => {
//             const piece = document.createElement('div');
//             piece.className = 'puzzle-piece';
//             piece.textContent = number !== 0 ? number : '';
//             piece.addEventListener('click', () => movePiece(rowIndex, colIndex));
//             puzzleContainer.appendChild(piece);
//         });
//     });

//     stepCounter.textContent = `步数: ${steps}`;
// }

function renderPuzzle() {
    const fragment = document.createDocumentFragment();

    puzzleState.forEach((row, rowIndex) => {
        row.forEach((number, colIndex) => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.textContent = number !== 0 ? number : '';
            piece.addEventListener('click', () => movePiece(rowIndex, colIndex));
            fragment.appendChild(piece);
        });
    });

    // 移除旧的子元素
    while (puzzleContainer.firstChild) {
        puzzleContainer.removeChild(puzzleContainer.firstChild);
    }
    // 添加新的子元素
    puzzleContainer.appendChild(fragment);

    stepCounter.textContent = `步数: ${steps}`;
}


function randomPuzzle() {
    for (let i = 0; i < 1000; i++) {
        const emptyPosition = findEmptyPosition();
        const adjacentPositions = getAdjacentPositions(emptyPosition);
        let { row, col } = adjacentPositions[Math.floor(Math.random() * adjacentPositions.length)];
        puzzleState[emptyPosition.row][emptyPosition.col] = puzzleState[row][col];
        puzzleState[row][col] = 0;

    }
}
// function movePiece(row, col) {
//     const emptyPosition = findEmptyPosition();
//     const adjacentPositions = getAdjacentPositions(emptyPosition);
//     if (adjacentPositions.some(pos => pos.row === row && pos.col === col)) {
//         puzzleState[emptyPosition.row][emptyPosition.col] = puzzleState[row][col];
//         puzzleState[row][col] = 0;
//         steps++;
//         renderPuzzle();
//         checkWin();
//         setTimeout(() => {
//             // 这里放置需要延迟执行的代码
//         }, 1000);
//     }
// }

 async function movePiece(row, col) {
    const emptyPosition = findEmptyPosition();
    const adjacentPositions = getAdjacentPositions(emptyPosition);

    if (adjacentPositions.some(pos => pos.row === row && pos.col === col)) {
        // 获取被点击的方块元素
        const clickedPiece = document.querySelector(`#puzzle-container .puzzle-piece:nth-child(${row * 3 + col + 1})`);
        // 添加动画类名
        clickedPiece.classList.add('animate');

        // 更新数据模型
        puzzleState[emptyPosition.row][emptyPosition.col] = puzzleState[row][col];
        puzzleState[row][col] = 0;

        steps++;
        renderPuzzle();
       
        await delay(600);
        checkWin();
    }
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function findEmptyPosition() {
    for (let row = 0; row < puzzleState.length; row++) {
        for (let col = 0; col < puzzleState[row].length; col++) {
            if (puzzleState[row][col] === 0) {
                return { row, col };
            }
        }
    }
}

function getAdjacentPositions(position) {
    const { row, col } = position;
    const adjacentPositions = [];

    if (row > 0) adjacentPositions.push({ row: row - 1, col });
    if (row < puzzleState.length - 1) adjacentPositions.push({ row: row + 1, col });
    if (col > 0) adjacentPositions.push({ row, col: col - 1 });
    if (col < puzzleState[row].length - 1) adjacentPositions.push({ row, col: col + 1 });

    return adjacentPositions;
}

function checkWin() {
    const flattenedState = puzzleState.flat();
    if (flattenedState.every((number, index) => number === index + 1 || number === 0)) {
        alert(`恭喜！你赢了！\n总步数: ${steps}`);
    }
}
window.moveList= [];

export { puzzleState, movePiece, goalState };