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

    function isIndexEmpty(index) {
        return _boardArray[index] === "" ? true: false;
    }

    populateArray();

    return {
        getArray : getArray,
        updateArray: updateArray,
        emptyArray: emptyArray,
        isIndexEmpty: isIndexEmpty,
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
            winner = "Player1 wins!";
        }
        else if(symbol === "O"){
            winner = "Player2 wins!";
        }
        else{
            winner = "It's a TIE!"
        }

        const gameWindow = document.getElementById("game-window");
        gameWindow.style.display = "none";

        const endWindow = document.getElementById("end-window");
        endWindow.style.display = "flex";

        const winnerDiv = document.getElementById("winner");
        winnerDiv.textContent = `${winner}`;

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
    const _playerTwo = player("O");
    const gameArray = gameBoard.getArray();
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
        if(gameBoard.isIndexEmpty(index) === true){
            if(round % 2 !== 0){ 
                placeInGameArray(index, _playerTwo.getSign());
            }
            else{
                placeInGameArray(index, _playerOne.getSign());
                // ai attacks after human
                if(selected === "ai" && round < 9){
                    while(true){
                        let aiAttackIndex = aiController();
                        if(gameBoard.isIndexEmpty(aiAttackIndex)){
                            placeInGameArray(aiAttackIndex, _playerTwo.getSign());
                            break;
                        }
                    }
                    
                }
            }
            
        }
        if(round === 9){
            displayController.endOfGame("");
        }
    }

    const reset = document.getElementById("reset");
    reset.addEventListener('click', gameBoard.emptyArray);
    reset.addEventListener('click', () => {
        round = 0;
    })

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
    
    function placeInGameArray(index, sign){
        round++;
        gameBoard.updateArray(index, sign);
        displayController.updateBoard();
        if(checkWin()["ifWin"]){
            //function display win
            displayController.endOfGame(checkWin()["symbol"]);
        }
    }
    
    function checkWin() {
        for(let i = 0; i < _winningConditions.length; i++){       
            if(gameArray[_winningConditions[i][0]] === gameArray[_winningConditions[i][1]] &&
            gameArray[_winningConditions[i][1]] === gameArray[_winningConditions[i][2]] && 
            gameArray[_winningConditions[i][0]] !== ""){
                return {
                    "ifWin": true,
                    "symbol": gameArray[_winningConditions[i][0]],
                };
            }
        }
        return {
            "ifWin": false,
            "symbol": "",
        };
    }

    function aiController() {
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        } //mdn 

        function minimax(board, isMax){

        }

        return getRandomInt(0,8);
    }

    return {
        selected: selected,
        round: round,
    }
})();

