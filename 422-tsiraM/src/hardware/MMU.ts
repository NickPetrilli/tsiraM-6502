import { Hardware } from "./hardware";
import { Memory } from "./Memory";
import { Cpu } from "./Cpu";

// MMU needs to know cpu and memory
export class MMU extends Hardware {
    private mem : Memory;
    private lob: number; //low order byte
    private hob: number; //high order byte

    constructor(memory: Memory) {
        super(0, "MMU", true);
        this.mem = memory;
    }

    //Reading and writing memory
    public read() {
        this.mem.read();
        return this.mem.getMdr();
    }
    public write(data: number): void {
        this.mem.setMdr(data);
        this.mem.write();
    }
    
    //Getters and setters for mar and mdr
    //this is for setting mar with correctly formatted 16 bit address
    public setMar(address: number) {
        this.mem.setMar(address)
    }
    public setMdr(input: number) {
        this.mem.setMdr(input);
    }
    public getMar(): number {
        return this.mem.getMar();
    }
    public getMdr(): number {
        return this.mem.getMdr();
    }
    public getLowOrderByte(): number {
        return this.lob;
    }
    public getHighOrderByte(): number {
        return this.hob;
    }
    public setLowOrderByte(value: number) {
        this.lob = value;
    }
    public setHighOrderByte(value: number) {
        this.hob = value;
        //if setHighOrderBit is called that means the low order byte has already been set
        //so call to set the Mar with the low and high order bytes
        this.setMarLittleEndian();
    }
    
    public setMarLittleEndian(): void {
        //eliminates the 0x before the hex number
        let lowOrderString = this.hexLog(this.lob, 2).substring(2,4);
        let highOrderString = this.hexLog(this.hob, 2).substring(2, 4);

        let stringAddress = "0x" + lowOrderString + highOrderString;
        let numAddress = parseInt(stringAddress);
        this.mem.setMar(numAddress);
    }
    
    //Writes static program to memory address and memory data registers
    public writeImmediate(address: number, data: number) {
        this.mem.setMar(address);
        this.mem.setMdr(data);
        this.mem.write();
    }
    //
    public readImmediate(address: number) {
        this.mem.setMar(address);
        this.mem.read();
        return this.mem.getMdr();
    }
    //Loads a static program into memory
    public loadImmediate(): void {

        this.writeImmediate(0x0000, 0xA2);
        this.writeImmediate(0x0001, 0x03);
        this.writeImmediate(0x0002, 0xFF);
        this.writeImmediate(0x0003, 0x06);
        this.writeImmediate(0x0004, 0x00);
        this.writeImmediate(0x0005, 0x00);
        this.writeImmediate(0x0006, 0x48);
        this.writeImmediate(0x0007, 0x65);
        this.writeImmediate(0x0008, 0x6C);
        this.writeImmediate(0x0009, 0x6C);
        this.writeImmediate(0x000A, 0x6F);
        this.writeImmediate(0x000B, 0x20);
        this.writeImmediate(0x000C, 0x57);
        this.writeImmediate(0x000D, 0x6F);
        this.writeImmediate(0x000E, 0x72);
        this.writeImmediate(0x000F, 0x6C);
        this.writeImmediate(0x0010, 0x64);
        this.writeImmediate(0x0011, 0x21);
        this.writeImmediate(0x0012, 0x0A);
        this.writeImmediate(0x0013, 0x00);


    }
    //Displays the content of memory starting at first parameter and ending at the second
    public memoryDump(fromAddr: number, toAddr: number): void {
        this.log("Initialized Memory");
        this.log("Memory Dump: Debug");
        this.log("-------------------------------------");
        //Iterate through memory addresses
        for (let i = fromAddr; i <= toAddr; i+=0x0001) {
            let addr = this.hexLog(i, 4);
            let data = this.hexLog(this.mem.memArr[i], 4);
            this.log("Addr: " + addr + ": | " + data);
        }
        this.log("-------------------------------------");
        this.log("Memory Dump: Complete");
    }
 
}