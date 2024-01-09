import { System } from "../System";
import {Hardware} from "./hardware";
import {ClockListener} from "./imp/ClockListener";

export class Memory extends Hardware implements ClockListener {

    public memArr : number[];
    private element : number = 0x00;
    private size : number = 0x10000;
    private mar: number = 0x0000;
    private mdr: number = 0x00;

    constructor() {
        super(0, "RAM", true);
        this.memArr = new Array<number>();
        for (let i = 0; i < this.size; i++)
        {
            this.memArr[i] = this.element;
        }
        this.log("Created - Addressable space :" + this.size);
    }
    //Pulse function from ClockListener interface
    pulse(): void {
        this.log("recieved clock pulse");
    }

    //Outputs memory addresses 
    public displayMemory(length) {
        for (let j = 0x00; j < length; j++) {
            let location = this.hexLog(j, 4);
            let value = this.hexLog(this.memArr[j], 2);

            this.log("Address : " + location + " Contains Value: " + value);
        }

    }
    //Resets all of the memory addresses to 00
    public reset() {
        for (let i = 0; i < this.size; i++) {
            this.memArr[i] = this.element;
        }
    }
    //Getters and setters for mar and mdr
    public setMar(address: number) {
        this.mar = address;
    }
    public getMar() {
        return this.mar;
    }
    public setMdr(input: number) {
        this.mdr = input;
    }
    public getMdr() {
        return this.mdr;
    }  
    public read() {
        this.mdr = this.memArr[this.mar];
    }
    public write() {
        this.memArr[this.mar] = this.mdr;
    }
    

    
}