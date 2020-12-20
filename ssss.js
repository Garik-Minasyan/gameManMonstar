
const getShortestWay = (srcCoords, destination) => {
    let minDistance = getSmallPath(srcCoords[0], destination);
    let minDistanceSrc = srcCoords[0];
    for (let i = 1; i < srcCoords.length; i++) {
        const distance = getSmallPath(srcCoords[i], destination);
        if (distance < minDistance) {
            minDistance = distance;
            minDistanceSrc = srcCoords[i];
        }
    }
    return minDistanceSrc;
};

const determineWolfMove = (monstarCords, destinationCoords) => {
    const possibleMoves = getPossibleMoves(monstarCords, destinationCoords)

    return getShortestWay(possibleMoves, destinationCoords)
}

const getSmallestWay = (monstarCords, destinationCoords) => {
    const currentX = monstarCords[0];
    const currentY = monstarCords[1];
    const emptyArrays = Object.values(STEP_VALUE);
    const emptyN = [];
    emptyArrays.forEach(value => {
        const nextStepX = currentX + value[0];
        const nextStepY = currentY + value[1];
        if (nextStepX < MATRIX.length &&
            nextStepX >= 0 &&
            nextStepY < MATRIX.length &&
            nextStepY >= 0 &&
            MATRIX[nextStepX][nextStepY] === MAN ||
            MATRIX[nextStepX][nextStepY] === EMPTY) {
            emptyN.push([nextStepX, nextStepY])
        }
    })

    if (!emptyN.length) {
        return null;
    }
    return getShortestMove(emptyN, destinationCoords)
};

const moveMonstar = (manNextCoord) => (monstarCords) => {
    const [nextX, nextY] = getSmallestWay(monstarCords, manNextCoord);
    const nextCoordPersonaj = MATRIX[nextX][nextY];
    const [prevX, prevY] = monstarCords;

    if (nextCoordPersonaj === EMPTY) {
        MATRIX[nextX][nextY] = MONSTAR;
        MATRIX[prevX][prevY] = EMPTY
    }

    if (nextCoordPersonaj === MAN) {
        loose();
    }
}


