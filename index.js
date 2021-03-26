import { Spot } from "./modules/spot.js";
import { Bomb } from "./modules/bomb.js";
import utility from "./modules/utility.js";

document.addEventListener('DOMContentLoaded', () => {

    /* Query the HTML Elements */
    const mineField = document.querySelector('#minefield');
    const mineGrid = mineField.getElementsByClassName("grid")[0];
    const resetBtn = document.getElementsByClassName("reset")[0];
    const flagCntEle = document.querySelector("#flagCount");
    const bombCntEle = document.querySelector("#bombCount");
    
    /* Capture event using Event Bubbling */
    mineGrid.addEventListener('click', ev => {
      clickSpot(ev.target);
    });

    mineGrid.addEventListener('contextmenu', ev => {
      ev.preventDefault();
      flagTheSpot(ev.target);
    });

    resetBtn.addEventListener('click', ev => {
      resetGame();
    })

    /* Predefined gametypes, keeping it scalable */
    let gameTypes = {
        typeA: { xdim: 5, ydim: 5, bombCnt: 5 },
        typeB: { xdim: 10, ydim: 10, bombCnt: 8 },
        typeC: { xdim: 15, ydim: 15, bombCnt: 10 },
    };

    const { xdim, ydim, bombCnt } = gameTypes.typeB;
    let gameOverFlag = false;
    let flags = 0

    bombCntEle.innerHTML = bombCnt;
    
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
     * Assign bomb counts to the spots 
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
          const noOfBombs = utility.findNearbyBombs({gameMatrix, i, j, xdim, ydim});
          gameMatrix[i][j].bombCnt = noOfBombs;
          const spot = document.createElement('div');
          spot.setAttribute('id', `${i * j}-${i}-${j}`);
          spot.setAttribute('data', JSON.stringify({ i, j, noOfBombs, isBomb: gameMatrix[i][j].isBomb ? true : false }));
          spot.classList.add(gameMatrix[i][j].class);

          spot.style.flexBasis = `${`calc(${100/xdim}%)`}`;
          spot.style.width = `${`calc(${100/xdim}%)`}`;
          spot.style.height = `${`calc(${100/ydim}%)`}`;

          mineGrid.appendChild(spot);
        }
    }


    function clickSpot(spot) {
      // check if spot is revealed or is flagged
      if (spot.classList.contains('reveal') || spot.classList.contains('flag')) return;
      // check if spot has a bomb placed
      if (spot.classList.contains('bomb')) {
        spot.innerHTML = '💣';
        spot.classList.add('reveal');
        if (!gameOverFlag) {
          gameOver();
        }
      } else {
        let total = Number(JSON.parse(spot.getAttribute('data')).noOfBombs);
        if (total !== 0) {
          spot.classList.add('reveal');
          spot.innerHTML = total;
        } else {
          checkNearbySpotForBomb(gameMatrix, spot);
        }
      }
      spot.classList.add('reveal');
    }

    function checkNearbySpotForBomb(matrix, spot) {
      
      // Reveal current spot
      spot.classList.add('reveal');

      const {i, j} = JSON.parse(spot.getAttribute('data'));
      //  Similar Logic for findingNearbyBombs
      let positions = [
        { x: i - 1, y: j - 1 }, // Upper Left Corner
        { x: i - 1, y: j }, // Upper Middle
        { x: i - 1, y: j + 1 }, // Upper Right Corner
        { x: i, y: j + 1 }, // Right Side
        { x: i, y: j - 1 }, // Left Side
        { x: i + 1, y: j + 1 }, // Bottom Right Corner
        { x: i + 1, y: j }, // Bottom Middle
        { x: i + 1, y: j - 1 }, // Bottom Left Corner
      ];

      const fltrPos = positions.filter(pos => {
        if (!(pos.x < 0 || pos.x > xdim - 1 || pos.y < 0 || pos.y > ydim - 1)) {
            return pos;
        }
      });


      // reveal if next spots have a zero bomb count or nearby bomb counts
      const myPromises = [];

      if (fltrPos && fltrPos.length > 0) {
        for (let n = 0; n < fltrPos.length; n++) {
          if (matrix && matrix[fltrPos[n].x][fltrPos[n].y]) {
            const nextSpot = document.getElementById(`${fltrPos[n].x * fltrPos[n].y}-${fltrPos[n].x}-${fltrPos[n].y}`);
            myPromises.push(
              setTimeout(() => {
                clickSpot(nextSpot);
              }, 20)
            );
          }
        }
        Promise.all(myPromises);
      }

    }

    /* Add Flag to the spot on right click */
    function flagTheSpot(spot) {
      // check if gameOver?
      if (gameOverFlag) return;
      // check if spot is revealed
      if (spot.classList.contains('reveal')) return;
      // check if bomb count is greater than flag count
      if (flags < bombCnt) {
        if (!spot.classList.contains('flag')) {
          spot.classList.add('flag');
          spot.innerHTML= '🚩';
          flags += 1;
          // if bomb count is equal to flag count, check for win
          if (flags === bombCnt) {
            checkIfWon();
          }
        } else {
          spot.classList.remove('flag');
          spot.innerHTML = '';
          flags -= 1;
        }
        flagCntEle.innerHTML = flags;

      }
    }


    /**
     * Check if player won
     */
    function checkIfWon() {
      let count = 0;
      for (const spot of mineGrid.children) {
        if (spot.classList.contains('bomb') && spot.classList.contains('flag')) {
          count += 1;
        }
      }
      if (count === bombCnt) {
        alert('You Won !');
        gameOverFlag = true;
      }
    }


    function gameOver() {
      /** 
       * Reveal the mine field
       * mineGrid.children is a HTMLCollection
       * */

      const myPromises = [];
      for (const spot of mineGrid.children) {
        myPromises.push(
          setTimeout(() => {
            clickSpot(spot);
          }, 50)
        );
      }
      Promise.all(myPromises)
      .then(() => {
        gameOverFlag = true;
        alert('Game Over! You are dead!');
      });

    }

    function resetGame() {
      location.reload();
    }
})
