import { Ascii } from "../Ascii";
import {System} from "../System";
import {Hardware} from "./hardware";
import {ClockListener} from "./imp/ClockListener";
import { InterruptController } from "./InterruptController";
import { MMU } from "./MMU";

export class Cpu extends Hardware implements ClockListener {

    private cpuClockCount: number = 0;
    private programCounter: number = 0x0000;
    
    //Variable to keep track of current pipeline step
    private pipelineStep: number = 1;
    //Registers
    private xRegister: number = 0x00;
    private yRegister: number = 0x00;
    private instructionRegister: number = 0x00;

    private zFlag: number = 0; //z flag

    private accNum: number = 0; //num in accumulator

    private secondDecode = false; //boolean for instructions that need a second decode
    private secondExecute = false; //boolean for instructions that need a second execute

    private mmu: MMU;

    private interruptController: InterruptController;

    private ascii: Ascii = new Ascii();
    
    constructor(mmu: MMU, controller: InterruptController) {
        super(0, "Cpu", true);
        this.mmu = mmu;
        this.interruptController = controller;
        
    }
    pulse(): void {
        this.cpuClockCount++;
        this.log("recieved clock pulse - CPU Clock Count: " + this.cpuClockCount);

        console.log("CPU STATE: | MODE: 0 PC: " + this.programCounter + " IR: " + this.instructionRegister + " Acc: " + this.accNum + " xReg: "
        + this.xRegister + " yReg: " + this.yRegister + " zFlag: " + this.zFlag + " Step: " + this.pipelineStep);       

        if (this.pipelineStep == 1) {
            this.fetch();
        }
        else if (this.pipelineStep == 2) {
            this.decode();
        }
        else if (this.pipelineStep == 3) {
            this.execute();
        }
        else if (this.pipelineStep == 4) {
           this.writeBack();
        }
        else if (this.pipelineStep == 5) {
            this.interruptCheck();
        }
    }
    public fetch(): void {
        //Loads the instruction register with memory address from the program counter
        this.instructionRegister = this.mmu.readImmediate(this.programCounter);
        this.programCounter++;
        this.pipelineStep = 2;
        console.log("FETCHING");
    }
    public decode(): void {
        console.log("DECODING");
        this.pipelineStep = 3; //default to go to next step, gets changed back if second decode is needed
        //check the instruction register for which instruction it is
        //instead of rewriting the same code instructions that have the same decode are grouped together 
        switch(this.instructionRegister) {
            //All of these instructions only load the current line into memory (dealing with constants)
            case(0xA2): //load x register with a constant
            case(0xA0): //load y register with a constant
            case(0xA9): //load accumulator with a constant
            case(0xD0): //branch n bites if z flag = 0
                this.mmu.setMdr(this.mmu.readImmediate(this.programCounter));
                this.programCounter++;
                break;
            
            //These instructions require the MAR to be set with little endian 
            case(0xEE): //increment memory byte, pulls it to the accumulator and adds 1
            case(0xEC): //compare memory to x reg. sets z flag to true if equal
            case(0xAE): //load x reg to memory
            case(0xAC): //load y reg to memory
            case(0x6D): //add memory to accumulator
            case(0xAD): //load accumulator with memory
            case(0x8D): //save accumulator to memory
                if (!this.secondDecode) {
                    this.secondDecode = true; //sets to true in order to do the second decode
                    this.mmu.setLowOrderByte(this.mmu.readImmediate(this.programCounter));
                    this.pipelineStep = 2;
                }
                else {
                    this.secondDecode = false;
                    this.mmu.setHighOrderByte(this.mmu.readImmediate(this.programCounter));
                }
                this.programCounter++;
                break;

            //These instructions have no decode step and doesn't get an op code or operand from memory so the program counter isn't incremented
            case(0xAA): //load the x reg from the accumulator
            case(0xA8): //load the y reg from the accumulator
            case(0x8A): //load the accumulator from the x reg
            case(0x98): //load the accumulator from the y reg
            case(0xFF): //system call
            case(0xEA): //no operation
            case(0x00): //halt
                break;
            
        }
    }
    public execute(): void {
        console.log("EXECUTING");
        this.pipelineStep = 5; //after instruction is executed the next step is interrupt checking
        //pipelineStep gets changed back to execute for instructions that need second execute, or changed to writeBack if needed
        switch(this.instructionRegister) {
            case(0xA9): //load accumulator with constant
                this.accNum = this.mmu.getMdr();
                console.log("A9 Execute");
                break;
            case(0xAD): //load accumulator with memory
                this.accNum = this.mmu.read();
                console.log("AD Execute");
                break;
            case(0x8D): //store the accumulator in memory
                this.mmu.write(this.accNum);
                console.log("8D Execute");
                break;
            case(0x8A): //load the accumulator from the x reg
                this.accNum = this.xRegister;
                console.log("8A Execute");
                break;
            case(0x98): //load the accumulator from the y reg
                this.accNum = this.yRegister;
                console.log("98 Execute");
                break;
            case(0x6D): //add memory to accumulator
                this.accNum = this.accNum + this.mmu.read();
                console.log("6D Execute");
                break;
            case(0xA2): //load the x reg with constant
                this.xRegister = this.mmu.getMdr();
                console.log("A2 Execute");
                break;
            case(0xAE): //load the x reg with memory
                this.xRegister = this.mmu.read();
                console.log("AE Execute");
                break;
            case(0xAA): //load the x reg from accumulator
                this.xRegister = this.accNum;
                console.log("AA Execute");
                break;
            case(0xA0): //load the y reg with constant
                this.yRegister = this.mmu.getMdr();
                console.log("A0 Execute");
                break;
            case(0xAC): //load the y reg with memory
                this.yRegister = this.mmu.read();
                console.log("AC Execute");
                break;
            case(0xA8): //load the y reg from accumulator
                this.yRegister = this.accNum;
                console.log("A8 Execute");
                break;
            case(0xEA): //no operation
                break;
            case(0x00): //halt
                process.exit();
            case(0xEC): //compare memory to x reg, sets xFlag if equal
            console.log("EC Execute");
                if (this.xRegister == this.mmu.read()) {
                    this.zFlag = 1;
                }
                break;
            case(0xD0): //branch n bytes if z flag = 0
            //twos complement number is given already, need to correctly add to the program counter
            console.log("D0 Execute");
                if (this.zFlag == 0) {
                    let branchDistance = this.mmu.read();
                    //need to check if its negative, then need to pad number
                    if (branchDistance <= 0x7F) {
                        this.programCounter += branchDistance;
                    }//if
                    else {
                        this.programCounter = this.programCounter - (0xFF - branchDistance);
                    }//else
        
                }//if
                break;
            case(0xEE): //increment the value of memory byte
            console.log("EE Execute");
                //this instruction needs 2 execution steps
                if (!this.secondExecute) {
                    this.accNum = this.mmu.read();
                    this.secondExecute = true;
                    this.pipelineStep = 3;
                }
                else {
                    //increment byte in accumulator
                    this.accNum++;
                    this.secondExecute = false;
                    //set pipeline step to write back
                    this.pipelineStep = 4;
                }
                break;
            case(0xFF): //system call
                if (this.xRegister == 0x01) {
                    console.log("Y register: " + this.yRegister);
                }
                else if (this.xRegister == 0x02) {
                    //print the 0x00 terminated string stored at address in the y reg
                    let yAddress = this.yRegister;
                    while (this.mmu.readImmediate(yAddress) != 0x00) {
                        console.log(this.ascii.toChar(this.mmu.readImmediate(yAddress)));
                        yAddress++;
                    }
                    
                }
                else if (this.xRegister == 0x03) {
                    //print the 0x00 terminated string from the address in the operand
                    //get the operands separately and increment program counter each time
                    let operands = this.hexLog(this.mmu.readImmediate(this.programCounter), 2);
                    this.programCounter++;
                    //combines both operands
                    operands = "0x" + this.hexLog(this.mmu.readImmediate(this.programCounter), 2) + operands;
                    this.programCounter++;
                    let address = parseInt(operands, 16);
                    while (this.mmu.readImmediate(address) != 0x00) {
                        console.log(this.ascii.toChar(this.mmu.readImmediate(address)));
                        address++;
                    }

                }
                break;
            
            
        }
    }
    public writeBack() {
        //write back only happens for incrementing a byte, sets MDR with accumulator
        this.mmu.write(this.accNum);
        this.pipelineStep = 5;
    }
    public interruptCheck(): void {
        if (this.interruptController.interruptFlag) {
            this.interruptController.runServiceInterrupt();
        }
        this.pipelineStep = 1;
    }
    
    
    
}
