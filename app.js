//module for game board
const gameBoard = (function () {
    const _boardArray = [];
    
    function populateArray() {
        if(_boardArray.length === 0) {
            for(let i = 0; i < 9; i++){
                _boardArray.push("");
            }
        }
    }

    function updateArray(indexInArray, sign) {
        _boardArray[indexInArray] = sign;
    }

    function getArray() {
        return _boardArray;
    }

    function emptyArray() {
        _boardArray.length = 0;
        populateArray();
        displayController.updateBoard();
    }

    populateArray();

    return {
        getArray : getArray,
        updateArray: updateArray,
        emptyArray: emptyArray,
    }
})();


//factory for player
const player = (sign) => {
    const _sign = sign;

    function getSign() {
        return _sign;
    }

    return {
        getSign: getSign
    }
}

//module for display
const displayController = (() => {
    const boardArr = gameBoard.getArray();
    const _board = document.getElementById("game-board");
    const _domArr = [..._board.children];
    const intro = document.querySelector("#intro");
    const gameWindow = document.getElementById("game-window");
    

    function updateBoard () {
        _domArr.forEach(element => {
            element.textContent = boardArr[_domArr.indexOf(element)];
        })
    }

    function showBoard() {
        intro.style.display = "none";
        gameWindow.style.display = "flex";
        const selected = document.querySelector('input[name="player"]:checked').value;

        return selected;
    }

    function endOfGame(symbol) {
        let winner = "";

        if(symbol === "X"){
            winner = "Player1";
        }
        else{
            winner = "Player2";
        }

        const gameWindow = document.getElementById("game-window");
        gameWindow.style.display = "none";

        const endWindow = document.getElementById("end-window");
        endWindow.style.display = "flex";

        const winnerDiv = document.getElementById("winner");
        winnerDiv.textContent = `${winner} wins!`;

        const playAgain = document.getElementById("play-again");
        playAgain.addEventListener('click', () => {
            document.location.reload(true);
        })
    }
    
    return {
        updateBoard: updateBoard,
        endOfGame: endOfGame,
        showBoard: showBoard,

    }
})();

//module for game
const gameController = (() => {
    const _playerOne = player("X");
    const _playerTwo = player("Y");
    const _board = document.getElementById("game-board");
    let round = 0;
    let selected = "";

    const startButton = document.getElementById("start-game");
    startButton.addEventListener('click', getTypeOfPlayer);

    function getTypeOfPlayer() {
        selected = displayController.showBoard();
    }

    const _domArr = [..._board.children];
    _domArr.forEach(element => {
        element.addEventListener('click', roundChecker)
    })
    
    function roundChecker() {
        const index = _domArr.indexOf(this);
        if(round % 2 !== 0){ // ai should go here
            placeInGameArray(index, _playerTwo.getSign());
        }
        else{
            placeInGameArray(index, _playerOne.getSign());
        }
        checkWin();
    }

    const reset = document.getElementById("reset");
    reset.addEventListener('click', gameBoard.emptyArray);

    const _winningConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    
    function placeInGameArray(index, sign){  // should refactor dapat wala na ito
        console.log(gameBoard.getArray[index])
        // if(that.textContent === ""){
            round++;
            gameBoard.updateArray(index, sign);
            displayController.updateBoard();
        // }
    }
    
    function checkWin() {
        const gameArray = gameBoard.getArray();
        for(let i = 0; i < _winningConditions.length; i++){       
            if(gameArray[_winningConditions[i][0]] === gameArray[_winningConditions[i][1]] &&
            gameArray[_winningConditions[i][1]] === gameArray[_winningConditions[i][2]] && 
            gameArray[_winningConditions[i][0]] !== ""){
                //function display win
                displayController.endOfGame(gameArray[_winningConditions[i][0]]);
                break;
            }
        }

    }

    function aiController() {
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } //mdn 

        return getRandomInt(0,8);
    }

    return {
        selected: selected,
    }
})();

