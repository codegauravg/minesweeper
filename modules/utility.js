/* Utility functions goes here */

export default {
    randomPos(n, min, max) {
        let randomNumber = null;
        const positions = [];
        for (let i = n; i > 0; i--) {
            //  To generate random numbers between min and maximum.
            randomNumber = Math.floor(min + Math.random() * (max - min));
            if(positions.indexOf(randomNumber) === -1) {
                positions.push(randomNumber);
            }
        }
        return positions;
    },

    findNearbyBombs(matrix, i, j) {
        const count = 0;
        // Logic to find nearby bombs of a spot goes here.

        return count;
    },

    checkNearbySpotForBomb(matrix, spot) {},
}