const intro = document.querySelector(".intro");
const startGame = document.getElementById("start-game");


//change function to the one selecting a player
startGame.addEventListener('click', () => {
    intro.classList.remove("intro");
    intro.classList.add("display-none");
});

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

    populateArray();

    return {
        getArray : getArray,
        updateArray: updateArray
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
    const domArr = [..._board.children];

    function updateBoard () {
        domArr.forEach(element => {
            element.textContent = boardArr[domArr.indexOf(element)];
        })
    }
    
    return {
        updateBoard: updateBoard,

    }
})();

//module for game
const gameController = (() => {
    const playerOne = player("X");
    const playerTwo = player("Y");
    const _board = document.getElementById("game-board");
    const domArr = [..._board.children];
    let round = 0;

    domArr.forEach(element => {
        element.addEventListener('click', gameLoop)
    })
    
    function gameLoop() {
        if(round % 2 !== 0){
            placePiece(playerTwo.getSign(), this);
        }
        else{
            placePiece(playerOne.getSign(), this);
        }
        checkWin();
    }

    const winningConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    
    function placePiece(sign, that){  
        if(that.textContent === ""){
            round++;
            const index = domArr.indexOf(that);
            gameBoard.updateArray(index, sign);
            that.textContent = sign;
        }
    }
    
    function checkWin() {
        const gameArray = gameBoard.getArray();
        for(let i = 0; i < winningConditions.length; i++){       
            if(gameArray[winningConditions[i][0]] === gameArray[winningConditions[i][1]] &&
            gameArray[winningConditions[i][1]] === gameArray[winningConditions[i][2]] && 
            gameArray[winningConditions[i][0]] !== ""){
                // function here
                break;
            }
        }
    }
    
    return {
        
    }
})();

//working get index of div
// const test = document.getElementById("test");
// test.addEventListener('click', testFunction)

// function testFunction() {
//     const index = [...board.children].indexOf(this);
//     console.log(index)
// }

