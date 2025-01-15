let turn = {'X': 0, 'O': 0};
let roles = {'X': 0, 'O': 0};
let win = false;
let turns = [];

function updateCell(id) {
    if (cellFilled(id) || win) return;
    updateTurnManage(id);
    if (!win)
        botMove()
}

function updateTurnManage(id) {
    setCell(id);
    updateTurns(id);
    checkWin();
    updateTurn();
}

function getCellText(id) {
    return id ? document.getElementById(id).firstElementChild.firstElementChild : null;
}

function getRole() {
    return document.getElementById('role').firstElementChild;
}

function getTurn() {
    return turn['X'] <= turn['O'] ? 'X' : 'O';
}

function setRole(char) {
    document.getElementById('role').firstElementChild.innerHTML = char;
}

function cellFilled(id) {
    return getCellValue(id) !== '-';
}

function getCellValue(id) {
    const text = getCellText(id).innerHTML;
    return ['X', 'O'].includes(text) ? text : '-';
}

function setCell(id) {
    getCellText(id).innerHTML = getTurn();
}

function updateRole() {
    let char = roles['X'] <= roles['O'] ? 'X' : 'O';
    roles[char]++;
    setRole(char);
}

function updateTurn() {
    let char = turn['X'] <= turn['O'] ? 'X' : 'O';
    turn[char]++;
}

function updateTurns(id) {
    turns.push(id);
}

function checkWin() {
    const boardStr = getBoardStr();
    const possibleWins = [
        [[boardStr[0], boardStr[1], boardStr[2]], [boardStr[3], boardStr[4], boardStr[5]], [boardStr[6], boardStr[7], boardStr[8]]],
        [[boardStr[0], boardStr[3], boardStr[6]], [boardStr[1], boardStr[4], boardStr[7]], [boardStr[2], boardStr[5], boardStr[8]]],
        [[boardStr[0], boardStr[4], boardStr[8]], [boardStr[2], boardStr[4], boardStr[6]]]
    ];
    const possibleWinsCell = [
        [['1:1', '2:1', '3:1'], ['1:2', '2:2', '3:2'], ['1:3', '2:3', '3:3']],
        [['1:1', '1:2', '1:3'], ['2:1', '2:2', '2:3'], ['3:1', '3:2', '3:3']],
        [['1:1', '2:2', '3:3'], ['3:1', '2:2', '1:3']]
    ];

    for (let i = 0; i < possibleWins.length; i++) {
        for (let j = 0; j < possibleWins[i].length; j++) {
            const str = possibleWins[i][j].join("");
            if (str === "XXX" || str === "OOO") {
                win = true;
                winLine(possibleWinsCell[i][j], () => {
                    updateStatus(getWinner(str));
                });
                return;
            }
        }
    }

    if (!win) checkTie();
}

function getBoardStr() {
    let board = [];
    for (let y = 1; y <= 3; y++) {
        for (let x = 1; x <= 3; x++) {
            let id = `${x}:${y}`;
            board.push(turns.includes(id) ? getCellText(id).innerHTML : '-');
        }
    }
    return board;
}

function checkTie() {
    if (turns.length === 9) {
        updateStatus('We Tied.');
    }
}

function winLine(cells, callback) {
    let completed = 0;
    cells.forEach((cell, index) => {
        setTimeout(() => {
            document.getElementById(cell).classList.add('win');
            if (++completed === cells.length) callback();
        }, index * 100);
    });
}

function getWinner(winnerStr) {
    return winnerStr[0] === getRole().innerHTML ? 'You Win!!!' : 'You Lose!';
}

function updateStatus(statusText) {
    document.getElementById('win-status').firstElementChild.innerHTML = statusText;
    if (statusText === 'You Win!!!') document.getElementById('win-stats').innerHTML++;
    else if (statusText === 'We Tied.') document.getElementById('ties-stats').innerHTML++;
    else if (statusText === 'You Lose!') document.getElementById('loss-stats').innerHTML++;
    toggleHideRestart();
}

function restartGame() {
    toggleHideRestart();
    document.getElementById('win-status').firstElementChild.innerHTML = '';
    turn = {'X': 0, 'O': 0};
    win = false;
    turns = []
    resetBoard();
    updateRole();
}

function toggleHideRestart() {
    document.getElementById('restart').hidden = !document.getElementById('restart').hidden;
}

function resetBoard() {
    document.querySelectorAll('.cell-button').forEach(cellButton => {
        let element = cellButton.parentNode;
        element.firstElementChild.firstElementChild.innerHTML = '';
        element.classList.remove('win');
    });

    if (getRole().innerHTML == getTurn()) botMove();
}

function botMove() {
    let availableCells = cellsFilled();

    if (availableCells.length == 0) return checkTie(); 
    setTimeout(() => {
        if (availableCells.length) {
            updateTurnManage(availableCells[Math.floor(Math.random() * availableCells.length)]);
        }
    }, 500);
}

function cellsFilled() {
    let cells = [];
    for (let y = 1; y <= 3; y++) {
        for (let x = 1; x <= 3; x++) {
            if (!cellFilled(`${x}:${y}`)) cells.push(`${x}:${y}`);
        }
    }
    return cells;
}

updateRole();