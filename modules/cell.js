class Cell {
    constructor() {
        this.ele = null;
        this.visible = false;
        this.isBomb = false;
    }

    reveal() {
        this.ele.classList.add("reveal");
        this.visible = true;
    }
}

export {Cell}