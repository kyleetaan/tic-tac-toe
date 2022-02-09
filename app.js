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

}


const displayController = (() => {
    //do something
})();