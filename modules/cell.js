class Cell {
    constructor() {
        this.ele = null;
        this.visible = false;
        this.isBomb = false;
    }

    reveal() {
        this.ele.classList.add("visible");
        this.visible = true;
    }
}

export {Cell}