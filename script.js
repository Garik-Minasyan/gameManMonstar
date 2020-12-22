const MONSTAR = "monstar";
const MAN = "man";
const COMP = "comp";
const LOCK = "lock"
const EMPTY = " ";
const X = 0;
const Y = 1;
let MATRIX_SIZE = 10;
const PERSONAJ_IMAGE_SRCS = {
    [MAN]: './images/manImg.jpg',
    [MONSTAR]: './images/monstarImg.jpg',
    [LOCK]: './images/lockImg.png',
    [COMP]: './images/compImg.jpg',
    [EMPTY]: './images/enpty.png'
};
const STEP_VALUE = {
    ArrowLeft: [0, -1],
    ArrowRight: [0, 1],
    ArrowDown: [1, 0],
    ArrowUp: [-1, 0],
};
const newGame = document.getElementById("newGame");
const body = document.getElementById('tableBoard');
const finishWinner = document.getElementById("finishWinner");
const finishGameOver = document.getElementById("finishGameOver");
const field = document.getElementById("field");
const gameTimer = document.getElementById("gameTimer");
const mp3 = document.getElementById('mp3');
const boardBoxPx = document.getElementsByClassName("boardBox");
const tableBoard = document.getElementById("tableBoard");
const MATRIX = [];
let mancoord;
let timer;
const selectedValue = document.getElementById("list");

selectedValue.addEventListener("change", (event) => {
    MATRIX_SIZE = +event.target.value;
    if (MATRIX_SIZE === 5) {
        tableBoard.style.width = "415px";
        tableBoard.style.height = '360px';
        field.style.marginLeft = "38%"
    }
    if (MATRIX_SIZE === 7) {
        console.log(MATRIX_SIZE)
        tableBoard.style.width = "565px";
        tableBoard.style.height = "500px";
        field.style.marginLeft = "32%";
    }
})
const createMatric = () => {
    for (let i = X; i < MATRIX_SIZE; i++) {
        MATRIX[i] = new Array(MATRIX_SIZE).fill(EMPTY);
    }
};

const setRandomPersons = length => {
    for (let i = X; i < length; i++) {
        const [lockX, lockY] = getRandomEmptyPair(MATRIX_SIZE, MATRIX_SIZE)
        MATRIX[lockX][lockY] = LOCK

        const [monstarX, monstarY] = getRandomEmptyPair(MATRIX_SIZE, MATRIX_SIZE)
        MATRIX[monstarX][monstarY] = MONSTAR;
    };
};

const setRandomPersonaj = () => {
    const [compX, compY] = getRandomEmptyPair(MATRIX_SIZE, MATRIX_SIZE)
    MATRIX[compX][compY] = COMP
}

const getRandomEmptyPair = () => {
    const pair = getRandomPair(MATRIX_SIZE, MATRIX_SIZE);
    if (MATRIX[pair[X]][pair[Y]] !== EMPTY) {
        return getRandomEmptyPair()
    }
    return pair;
}

const getRandomPair = (maxX, maxY) => {
    const a = Math.floor(Math.random() * maxX);
    const b = Math.floor(Math.random() * maxY);
    return [a, b];
};

const getPersonView = (person) => {
    return `<img class="img" src="${PERSONAJ_IMAGE_SRCS[person]}"/>`
}

const redrawGameBoard = () => {
    let rowS = '';
    for (let i = X; i < MATRIX.length; i++) {
        let colS = '';
        for (let j = X; j < MATRIX.length; j++) {
            rowS += `<div  class="boardBox">${getPersonView(MATRIX[i][j])}</div>`;
        }
        colS += `<div>${rowS}</div>`;
    }
    body.innerHTML = rowS;
};

const getSmallPath = (coordPair, destinationCoords) => {
    const shortestVariantX = destinationCoords[X] - coordPair[X];
    const shortestVariantY = destinationCoords[Y] - coordPair[Y];
    return Math.sqrt(
        Math.pow(shortestVariantX, 2) +
        Math.pow(shortestVariantY, 2)
    )
};

const getShortestWay = (srcCoords, destination) => {
    let minDistance = getSmallPath(srcCoords[X], destination);
    let minDistanceSrc = srcCoords[X];
    for (let i = Y; i < srcCoords.length; i++) {
        const distance = getSmallPath(srcCoords[i], destination);
        if (distance < minDistance) {
            minDistance = distance;
            minDistanceSrc = srcCoords[i];
        }
    }
    return minDistanceSrc;
};

const getSmallestWay = (destinationCoords, monstarCords) => {
    const currentX = monstarCords[X];
    const currentY = monstarCords[Y];
    const stepValueArrays = Object.values(STEP_VALUE);
    const possibleSteps = [];
    stepValueArrays.forEach(value => {
        const nextStepX = currentX + value[X];
        const nextStepY = currentY + value[Y];
        if (nextStepX < MATRIX.length &&
            nextStepX >= X &&
            nextStepY < MATRIX.length &&
            nextStepY >= X &&
            (MATRIX[nextStepX][nextStepY] === MAN ||
                MATRIX[nextStepX][nextStepY] === EMPTY)) {
            possibleSteps.push([nextStepX, nextStepY])
        }
    })
    if (!possibleSteps.length) {
        return null;
    }

    return getShortestWay(possibleSteps, destinationCoords)
};

const gameIsFinished = (deleteBoard, element, message) => {
    alert(message)
    deleteBoard.style.display = "none";
    element.style.height = "500px";
    element.style.transition = "1s";
    gameTimer.style.opacity = "-1"
}

const setGameTimer = () => {
    timer = setInterval(() => {
        gameTimer.innerHTML--;
        if (gameTimer.innerHTML === "0") {
            gameTimer.style.opacity = "-1";
            mp3.pause();
            mp3.currentTime = 0;
            gameIsFinished(field, finishGameOver, "Game Over...")
            return
        };
    }, 1000);
}


const callFunctionAddEvent = () => {
    if (timer) {
        clearInterval(timer)
    }
    gameTimer.style.opacity = "1"
    gameTimer.innerHTML = "530";
    setGameTimer()
    mp3.play()
    createMatric();
    mancoord = getRandomPair(MATRIX_SIZE, MATRIX_SIZE);
    MATRIX[mancoord[X]][mancoord[Y]] = MAN;
    setRandomPersons(MATRIX_SIZE / 2);
    setRandomPersonaj()
    redrawGameBoard();
}

newGame.addEventListener("click", () => {
    callFunctionAddEvent()
    finishGameOver.style.height = "0px";
    finishWinner.style.height = "0px";
    field.style.display = "block";
});


const moveMan = (step) => {
    const [manX, manY] = mancoord;
    let nextX = manX + step[X];
    let nextY = manY + step[Y];
    if (nextX < X) {
        nextX = MATRIX.length - Y
    }
    if (nextX >= MATRIX.length) {
        nextX = MATRIX.length - MATRIX.length;
    }
    if (nextY < X) {
        nextY = MATRIX.length - Y
    }
    if (nextY >= MATRIX.length) {
        nextY = MATRIX.length - MATRIX.length;
    }

    const manNextCoord = MATRIX[nextX][nextY];

    if (manNextCoord === EMPTY) {
        mancoord = [nextX, nextY];
        MATRIX[nextX][nextY] = MAN;
        MATRIX[manX][manY] = EMPTY
    }
    if (manNextCoord === COMP) {
        gameIsFinished(field, finishWinner, "You Win!");
        mp3.pause();
        mp3.currentTime = 0;
        return true;
    }
    if (manNextCoord === MONSTAR) {
        gameIsFinished(field, finishGameOver, "Game Over...");
        mp3.pause();
        mp3.currentTime = 0;
        return true;

    }

    return false;
}
const moveMonstar = (manNextCoord) => (monstarCords) => {
    const [nextX, nextY] = getSmallestWay(manNextCoord, monstarCords);
    const nextCoordPersonaj = MATRIX[nextX][nextY];
    const [prevX, prevY] = monstarCords;

    if (nextCoordPersonaj === EMPTY) {
        MATRIX[nextX][nextY] = MONSTAR;
        MATRIX[prevX][prevY] = EMPTY
    }

    if (nextCoordPersonaj === MAN) {
        gameIsFinished(field, finishGameOver, "Game Over...");
        mp3.pause();
        mp3.currentTime = 0;
        return;
    }
}

const getMonsterCoordinates = () => {
    let coords = []
    for (let i = X; i < MATRIX.length; i++) {
        for (let j = X; j < MATRIX[i].length; j++) {
            if (MATRIX[i][j] === MONSTAR) {
                coords.push([i, j]);
            };
        };
    }
    return coords;
}

window.addEventListener("keydown", event => {
    const step = STEP_VALUE[event.code];
    if (!step) {
        return;
    }

    const isFinished = moveMan(step);

    if (isFinished) {
        return;
    }
    getMonsterCoordinates().forEach(moveMonstar(mancoord))
    redrawGameBoard();
});
