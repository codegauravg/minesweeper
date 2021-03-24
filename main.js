document.addEventListener('DOMContentLoaded', () => {

    /* Query the HTML Elements */
    const mineField = document.querySelector('#minefield');

    /* Predefined gametypes, keeping it scalable */
    let gameTypes = {
        typeA: { xdim: 5, ydim: 5, bombCnt: 10 },
        typeB: { xdim: 10, ydim: 10, bombCnt: 20 },
        typeC: { xdim: 15, ydim: 15, bombCnt: 25 },
    };
})