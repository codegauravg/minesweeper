import { Spot } from "./modules/spot.js";
import { Bomb } from "./modules/bomb.js";
import utility from "./modules/utility.js";

document.addEventListener('DOMContentLoaded', () => {

    /* Query the HTML Elements */
    const mineField = document.querySelector('#minefield');
    const mineGrid = mineField.getElementsByClassName("grid")[0];

    /* Predefined gametypes, keeping it scalable */
    let gameTypes = {
        typeA: { xdim: 5, ydim: 5, bombCnt: 5 },
        typeB: { xdim: 10, ydim: 10, bombCnt: 10 },
        typeC: { xdim: 15, ydim: 15, bombCnt: 15 },
    };

    const { xdim, ydim, bombCnt } = gameTypes.typeA;
    let gameOverFlag = false;
    
    /** 
     * Generate safe spots & bomb spots in the mine field 
     * [
     *  [v,v,v,v,b,v,v,v,v,v],
     *  [v,v,v,v,v,v,v,v,v,v],
     *  [v,v,b,v,b,v,v,v,v,v],
     *  [v,v,v,v,v,v,v,v,v,v],
     *  [v,v,v,v,v,b,v,v,v,v],
     *  [v,b,v,v,v,v,v,b,v,v],
     *  [v,v,v,v,v,v,v,v,v,v],
     *  [v,v,v,v,v,b,v,v,v,v],
     *  [v,v,v,b,v,v,v,b,v,v],
     *  [v,v,v,v,v,v,b,v,v,v],
     * ]
     * */
    const gameArray = Array(xdim * ydim).fill(new Spot());
    const bombPositions = utility.randomPos(bombCnt, 0, xdim * ydim - 1);
    
    bombPositions.forEach((pos) => {
      gameArray[pos] = new Bomb();
    });
    
    const gameMatrix = new Array(Math.ceil(xdim))
    .fill()
    .map(_ => gameArray.splice(0, xdim))

    console.log(gameMatrix);

    /** 
     * Assign bomb conts to the spots 
     * [
     *  [v,v,v,1,b,1,v,v,v,v],
     *  [v,1,1,3,2,2,v,v,v,v],
     *  [v,1,b,2,b,1,v,v,v,v],
     *  [v,1,1,2,2,2,1,v,v,v],
     *  [1,1,1,v,1,b,1,1,1,v],
     *  [1,b,1,v,1,1,2,b,1,v],
     *  [1,1,1,v,v,1,1,1,1,v],
     *  [v,v,1,1,2,b,2,1,1,v],
     *  [v,v,1,b,2,2,3,b,1,v],
     *  [v,v,1,1,v,1,b,2,1,v],
     * ]
     * */
     for (let i = 0; i < ydim; i++) {
        for (let j = 0; j < xdim; j++) {
          // find count of bombs in neighbour
          const noOfBombs = utility.findNearbyBombs(gameMatrix, i, j);
          const spot = document.createElement('div');
          spot.setAttribute('id', `${i * j}-${i}-${j}`);
          spot.setAttribute('data', JSON.stringify({ i, j, noOfBombs, isBomb: gameMatrix[i][j].isBomb ? true : false }));
          spot.classList.add(gameMatrix[i][j].class);

          spot.style.flexBasis = `${`calc(${100/xdim}%)`}`;
          spot.style.width = `${`calc(${100/xdim}%)`}`;
          spot.style.height = `${`calc(${100/ydim}%)`}`;

          spot.addEventListener('click', function(e) {
            clickSpot(spot)
          })

          mineGrid.appendChild(spot);
        }
     }

    function clickSpot(spot) {
      if (gameOverFlag) return;
      if (spot.classList.contains('reveal') || spot.classList.contains('flag')) return;
      if (spot.classList.contains('bomb')) {
        gameOver();
      } else {
        console.log(JSON.parse(spot.getAttribute('data')));
        let total = Number(JSON.parse(spot.getAttribute('data')).noOfBombs);
        if (total !== 0) {
          spot.classList.add('reveal');
          spot.innerHTML = total;
          return;
        }
        utility.checkNearbySpotForBomb(gameMatrix, spot);
      }
      spot.classList.add('reveal')
    }

    function gameOver() {
      gameOverFlag = true;
      alert('Game Over! You are dead!');

      /** 
       * Reveal the mine field
       * Legacy loop cause mineGrid.children is a HTMLCollection
       * */
      for (const spot of mineGrid.children) {
        console.log(spot);
        if (spot.classList.contains('bomb')) {
          spot.innerHTML = '💣';
        }
        spot.classList.add('reveal');
      }
    }

})
