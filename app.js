const intro = document.querySelector(".intro");
const startGame = document.getElementById("start-game");
const board = document.getElementById("game-board");

//change function to the one selecting a player
startGame.addEventListener('click', () => {
    intro.classList.remove("intro");
    intro.classList.add("display-none");
});

//module for game board
const gameBoard = (function () {
    const _boardArray = []
    
    function populateArray() {
        if(_boardArray.length === 0) {
            for(let i = 0; i < 9; i++){
                _boardArray.push("_");
            }
        }
    }

    function getArray() {
        return _boardArray;
    }

    populateArray();

    return {
        getArray : getArray
    }
})();


//factory for player
const player = () => {
    const _xAttack = "X";
    const _oAttack = "O";


}

//module for display
const displayController = (() => {
    let boardArr = gameBoard.getArray();
    //do something
    function populateBoard() {
        for(let i = 0; i < boardArr.length; i++){
            if(boardArr[i] !== "_"){

            }
        }
    }
})();


//working get index of div
const test = document.getElementById("test");
test.addEventListener('click', testFunction)

function testFunction() {
    const index = [...board.children].indexOf(this);
    console.log(index)
}

