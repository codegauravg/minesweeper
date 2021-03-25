import { Cell } from "./cell.js";

class Spot extends Cell {
    constructor() {
        super();
        this.bombCnt = 0;
        this.class = "safe";
    }
}

export {Spot}
