import { Cell } from "./cell.js";

class Bomb extends Cell {
    constructor () {
        super();
        this.isBomb = true;
        this.ele = "💣";
        this.class = "bomb";
    }
}

export { Bomb }