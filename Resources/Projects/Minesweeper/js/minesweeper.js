var time = 0;

var columns = 9,
    rows = 9,
    intervalStart = true,
    numberOfMines = 10,
    gameOver = false,
    gameWon = false,
    gameLost = false;

function buildGrid() {
    // Fetch grid and clear out old elements.
    var grid = document.getElementById("minefield");
    grid.innerHTML = "";

    // Build DOM Grid
    var tile;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            tile = createTile(x, y);
            grid.appendChild(tile);
        }
    }

    setMines();

    var style = window.getComputedStyle(tile);

    var width = parseInt(style.width.slice(0, -2));
    var height = parseInt(style.height.slice(0, -2));

    grid.style.width = columns * (1 + width) + "px";
    grid.style.height = rows * (1 + height) + "px";
}

function createTile(x, y) {
    var tile = document.createElement("div");

    tile.classList.add("tile");
    tile.classList.add("hidden");
    //Adding necessary attributes for communication between js and html
    tile.setAttribute("id", `${x}-${y}`);
    tile.setAttribute("data-ismine", "false");
    tile.setAttribute("data-isflag", "false");
    tile.setAttribute("data-isrevealed", "false");
    tile.setAttribute("onmousedown", "smileyLimbo()");
    tile.setAttribute("onmouseup", "smileyBack()");

    tile.addEventListener("auxclick", function (e) {
        e.preventDefault();
    }); // Middle Click
    tile.addEventListener("contextmenu", function (e) {
        e.preventDefault();
    }); // Right Click
    tile.addEventListener("mouseup", handleTileClick); // All Clicks

    return tile;
}

function startGame() {
    //check the difficulty to set the number of mines.
    let difficulty = document.getElementById("difficulty").selectedIndex;
    switch (difficulty) {
        case 0:
            numberOfMines = 10;
            break;
        case 1:
            numberOfMines = 40;
            break;
        case 2:
            numberOfMines = 99;
            break;
    }

    buildGrid();
    startTimer();
    gameOver = false;
    intervalStart = false;
    document.getElementById("flagCount").innerHTML = numberOfMines;

    document.getElementById("smiley").classList.remove("face_lose");
    document.getElementById("smiley").classList.remove("face_win");

    gameWon = false;
}

function smileyDown() {
    var smiley = document.getElementById("smiley");
    smiley.classList.add("face_down");
}

function smileyUp() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_down");
}

function handleTileClick(event) {
    // Left Click
    if (gameOver) return;

    // will get the id and retrieve the x and y from the id (They are all unique)
    const myArray = event.target.id.split("-");
    let xCurrentClickedTile = parseInt(myArray[0]),
        yCurrentClickedTile = parseInt(myArray[1]);

    if (event.which === 1) {
        //reveals the tile
        revealTile(xCurrentClickedTile, yCurrentClickedTile);
    }
    // Middle Click
    else if (event.which === 2) {
        // reveals around the specific tile with specific criteria
        handleMiddleClick(xCurrentClickedTile, yCurrentClickedTile);
    }
    // Right Click
    else if (event.which === 3) {
        // toggles flag
        toggleFlag(xCurrentClickedTile, yCurrentClickedTile);
    }

    checkForWin();
    setWinner();
}

function setDifficulty() {
    // will populate the numbers based on the difficulty selected
    var difficultySelector = document.getElementById("difficulty");
    var difficulty = difficultySelector.selectedIndex;
    if (difficulty === 0) {
        columns = 9;
        rows = 9;
        numberOfMines = 10;
    } else if (difficulty === 1) {
        columns = 16;
        rows = 16;
        numberOfMines = 40;
    } else if (difficulty === 2) {
        columns = 30;
        rows = 16;
        numberOfMines = 99;
    }
}

function startTimer() {
    timeValue = 0;
    //makes sure there is only 1 interval
    if (intervalStart) window.setInterval(onTimerTick, 1000);
}

function onTimerTick() {
    updateTimer();
    timeValue++;
}

function updateTimer() {
    document.getElementById("timer").innerHTML = timeValue;
}

// gets all the adjacent tiles (as a list of objects containing x and y)
const getAdjacentTiles = (x, y) => {
    let adjacentTiles = [];

    let noRight = x === columns - 1;
    let noLeft = x === 0;
    let noTop = y === 0;
    let noDown = y === rows - 1;

    if (!noRight) {
        adjacentTiles.push({ x: x + 1, y: y });

        if (!noDown) adjacentTiles.push({ x: x + 1, y: y + 1 });
        if (!noTop) adjacentTiles.push({ x: x + 1, y: y - 1 });
    }
    if (!noLeft) {
        adjacentTiles.push({ x: x - 1, y: y });

        if (!noDown) adjacentTiles.push({ x: x - 1, y: y + 1 });
        if (!noTop) adjacentTiles.push({ x: x - 1, y: y - 1 });
    }
    if (!noDown) adjacentTiles.push({ x: x, y: y + 1 });
    if (!noTop) adjacentTiles.push({ x: x, y: y - 1 });

    return adjacentTiles;
};

// this method will get the number of adjacent mines
const getNumberOfAdjacentMines = (x, y) => {
    let adjacentTiles = getAdjacentTiles(x, y);
    let counter = 0;
    for (let i = 0; i < adjacentTiles.length; i++) {
        let tile = document.getElementById(
            `${adjacentTiles[i].x}-${adjacentTiles[i].y}`
        );

        if (tile.getAttribute("data-ismine") === "true") counter++;
    }
    return counter;
};

// this method will get the number of adjacent flags
const getNumberOfAdjacentFlags = (x, y) => {
    let adjacentTiles = getAdjacentTiles(x, y);
    let counter = 0;
    for (let i = 0; i < adjacentTiles.length; i++) {
        let tile = document.getElementById(
            `${adjacentTiles[i].x}-${adjacentTiles[i].y}`
        );

        if (tile.getAttribute("data-isflag") === "true") counter++;
    }
    return counter;
};

// this method will set populate the board with mines
const setMines = () => {
    let allTiles = [],
        mineTiles = [];

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            allTiles.push(`${x}-${y}`);
        }
    }

    for (let i = 0; i < numberOfMines; i++) {
        let indexToRemove = Math.floor(Math.random() * allTiles.length);
        mineTiles.push(allTiles[indexToRemove]);
        allTiles.splice(indexToRemove, 1);
        setSingleMine(mineTiles[i]);
    }

    console.log(mineTiles);
};

// this method will set a specific tile with mine using id
const setSingleMine = (str) => {
    const myArray = str.split("-");
    let x = parseInt(myArray[0]),
        y = parseInt(myArray[1]);

    let tile = document.getElementById(`${x}-${y}`);
    tile.setAttribute("data-ismine", "true");
};

// this method will reveal tile
const revealTile = (x, y) => {
    let thisTile = document.getElementById(`${x}-${y}`);

    // if it is flag, do nothing
    if (thisTile.getAttribute("data-isflag") === "true") return;

    // if the tile is mine, stop the game and show all of the other mines
    if (thisTile.getAttribute("data-ismine") === "true") {
        thisTile.classList.add("mine_hit");
        showAllMines();
        return;
    }

    // gets the number of adjacent mines and will reveal the tile
    let numberOfAdjacentMines = getNumberOfAdjacentMines(x, y);
    if (numberOfAdjacentMines > 0 && numberOfAdjacentMines <= 8) {
        thisTile.classList.add(`tile_${numberOfAdjacentMines}`);
        thisTile.setAttribute("data-isrevealed", "true");
        return;
    }

    // there is a method use in here that if your tile has 0 adjacent mines
    // it will recursively go to find numbers and reveal all the tiles with 0
    // adjacent mines
    if (numberOfAdjacentMines === 0) {
        thisTile.classList.remove("hidden");
        if (thisTile.getAttribute("data-isrevealed") === "true") return;
        getUnrevealedAdjacentElements(x, y);
        thisTile.setAttribute("data-isrevealed", "true");
    }
};

// This method will set flag
const setFlag = (x, y) => {
    let tile = document.getElementById(`${x}-${y}`);
    if (tile.getAttribute("data-isrevealed") === "true") return;

    tile.classList.add("flag");
    tile.setAttribute("data-isflag", "true");
    numberOfMines--;
    document.getElementById("flagCount").innerHTML = numberOfMines;
};

// This method will remove flag
const removeFlag = (x, y) => {
    let tile = document.getElementById(`${x}-${y}`);
    if (tile.getAttribute("data-isrevealed") === "true") return;
    tile.classList.remove("flag");
    tile.setAttribute("data-isflag", "false");
    numberOfMines++;
    document.getElementById("flagCount").innerHTML = numberOfMines;
};

// This method will toggle those flags
const toggleFlag = (x, y) => {
    let tile = document.getElementById(`${x}-${y}`);
    tile.getAttribute("data-isflag") === "false"
        ? setFlag(x, y)
        : removeFlag(x, y);
};

// this method will terminate the game and shows all the mines
const showAllMines = () => {
    document.getElementById("smiley").classList.add("face_lose");
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            let tile = document.getElementById(`${x}-${y}`);

            let isFlag = tile.getAttribute("data-isflag") === "true";
            let isMine = tile.getAttribute("data-ismine") === "true";

            if (isMine && isFlag) {
                tile.classList.add("mine_marked");
            }
            if (isMine && !isFlag) {
                tile.classList.add("mine");
            }

            // tile.setAttribute("data-isrevealed", "true");
        }
    }
    gameOver = true;
    gameLost = true;
};

// this method is similar to reveal, however, it just reveals 1 mine rather than doing
// anything recursively
const revealSpecific = (x, y) => {
    let thisTile = document.getElementById(`${x}-${y}`);

    if (thisTile.getAttribute("data-isflag") === "true") return;

    if (thisTile.getAttribute("data-ismine") === "true") {
        thisTile.classList.add("mine_hit");
        gameOver = true;
        showAllMines();
        return;
    }

    let numberOfAdjacentMines = getNumberOfAdjacentMines(x, y);

    if (numberOfAdjacentMines > 0 && numberOfAdjacentMines <= 8) {
        thisTile.classList.add(`tile_${numberOfAdjacentMines}`);
    }

    if (numberOfAdjacentMines === 0) {
        thisTile.classList.remove("hidden");
    }

    thisTile.setAttribute("data-isrevealed", "true");
};

// this method will use other mehtods to make the middle click functional
const handleMiddleClick = (x, y) => {
    let currentElement = document.getElementById(`${x}-${y}`);
    let adjacentMinesNumber = getNumberOfAdjacentMines(x, y);
    let adjacentFlagNumber = getNumberOfAdjacentFlags(x, y);

    if (
        !currentElement.getAttribute("data-isrevealed") === "true" ||
        adjacentMinesNumber === 0 ||
        adjacentFlagNumber !== adjacentMinesNumber
    )
        return;

    let adjacentTiles = getAdjacentTiles(x, y);

    adjacentTiles.map((element) => {
        revealSpecific(element.x, element.y);
    });
};

// goes through every element to see if all are revealed, if they are and mines are
// not revealed, it will terminate the game and the player will win
const checkForWin = () => {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            let tile = document.getElementById(`${x}-${y}`);
            if (
                tile.getAttribute("data-isrevealed") === "false" &&
                tile.getAttribute("data-ismine") === "false"
            ) {
                return;
            }
        }
    }

    gameWon = true;
    document.getElementById("smiley").classList.add("face_win");

    gameOver = true;
};

// this method will change the face of smiley to winner with sunglasses
const setWinner = () => {
    if (gameWon) {
        document.getElementById("smiley").classList.add("face_win");
        console.log("Game Won");
    }
};

// This method will do recursion to reveal all of the adjacent tiles that have not adjacent bomb
const getUnrevealedAdjacentElements = (x, y) => {
    let currentTileNumberOfAdjacentMines = getNumberOfAdjacentMines(x, y);
    if (currentTileNumberOfAdjacentMines > 0) return;

    let adjacentTiles = getAdjacentTiles(x, y);
    let unRevealedAdjacent = [];

    unRevealedAdjacent = adjacentTiles.map((tile) => {
        let element = document.getElementById(`${tile.x}-${tile.y}`);
        if (element.getAttribute("data-isrevealed") === "false") {
            unRevealedAdjacent.push(element);
            revealSpecific(tile.x, tile.y);
            getUnrevealedAdjacentElements(tile.x, tile.y);
        }
    });
};

// limbo face functionality
function smileyLimbo() {
    if (!gameOver) {
        var smiley = document.getElementById("smiley");
        smiley.classList.add("face_limbo");
    }
}
// limbo face functionality
function smileyBack() {
    var smiley = document.getElementById("smiley");
    smiley.classList.remove("face_limbo");
}
