/* Utility functions goes here */

export default {
    randomPos(n, min, xmax, ymax) {
        let positions = [];
        let i = 0;
        
        while (i < n) {
            const x = Math.round(min + Math.random() * (xmax - min - 1));
            const y = Math.round(min + Math.random() * (ymax - min - 1));
            const random = `${x}/${y}`;
            if (positions.indexOf(random) < 0) {
                positions.push(random);
                i += 1;
            }
        }

        return { bombPositions: positions, bombCnt: positions.length };
    },

    findNearbyBombs({gameMatrix, i, j, xdim, ydim}) {
        let count = 0;
        /**
         * Logic to find nearby bombs of a spot goes here.
         * Look out for following places around a coordinate,
         *  > Check if its any of the corners, 3 spots at any 4 point
         *  > Check if its any of the extremes(i/j = 0 or i/j=matrix.length), 5 spots at any point
         *  > At any other pace there would be 8 spots to check for a bomb.
         */
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

        const filteredPositions = positions.filter(pos => {
            if (!(pos.x < 0 || pos.x > xdim - 1 || pos.y < 0 || pos.y > ydim - 1)) {
                return pos;
            }
        })

        filteredPositions.forEach(pos => {
            if (gameMatrix[pos.x][pos.y].isBomb) {
                count += 1;
            }
        });
        return count;
    },
}
