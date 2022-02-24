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
                    let aiAttackIndex = aiController.bestAttack();
                    placeInGameArray(aiAttackIndex, _playerTwo.getSign());

                    // while(true){
                    //     let aiAttackIndex = aiController();
                    //     if(gameBoard.isIndexEmpty(aiAttackIndex)){
                    //         placeInGameArray(aiAttackIndex, _playerTwo.getSign());
                    //         break;
                    //     }
                    // }
                    
                }
            }
            
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
        if(checkWin(gameArray)["ifWin"]){
            //function display win
            displayController.endOfGame(checkWin(gameArray)["symbol"]);
        }
    }
    
    function checkWin(board) {
        for(let i = 0; i < _winningConditions.length; i++){       
            if(board[_winningConditions[i][0]] === board[_winningConditions[i][1]] &&
            board[_winningConditions[i][1]] === board[_winningConditions[i][2]] && 
            board[_winningConditions[i][0]] !== ""){
                return {
                    "ifWin": true,
                    "symbol": board[_winningConditions[i][0]],
                };
            }
        }
        if(!board.includes("")){
            return {
                "ifWin": true,
                "symbol": "tie",
            };
        }
        return {
            "ifWin": false,
            "symbol": "",
        };
    };

    

    return {
        checkWin: checkWin,
    }
})();

const aiController = ( () => {
    
    //create a function that will call yung minmax
    function bestAttack(){
        const boardArr = [...gameBoard.getArray()];
        let bestScore = -Infinity;
        let bestIndex;
        //loop in gameboard array
        for(let i = 0; i < 9; i++){
            if(boardArr[i] === ""){
                boardArr[i] = "O";
                let score = minimax(boardArr, 0, false);
                boardArr[i] = "";
                if(score > bestScore){
                    bestScore = score;
                    bestIndex = i;
                }
            };
        };
        return bestIndex;
    };


    function minimax(board, depth, isMax){ 
        if(gameController.checkWin(board)["ifWin"]){
            console.log(board);
            let symbol = gameController.checkWin(board)["symbol"];
            if(symbol === "X"){
                // console.log(`winner x!`)
                return -1;
            }
            else if(symbol === "O"){
                // console.log(`winner o!`)
                return 1;
            }
            else {
                console.log(`tie!`)
                return 0;
            }
        }

        
        //maximizing
        if(isMax){
            let bestScore = -Infinity;
            for(let i = 0; i < 9; i++){
                if(board[i] === ""){
                    board[i] = "O";
                    let score = minimax(board, depth + 1, false)
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                };
            };
            return bestScore;
        }
        else{//minimizing
            let bestScore = Infinity;
            for(let i = 0; i < 9; i++){
                if(board[i] === ""){
                    board[i] = "X";
                    let score = minimax(board, depth + 1, true)
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }

        
        
    }

    return {
        bestAttack: bestAttack,
    }
})();
