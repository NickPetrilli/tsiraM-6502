import { Hardware } from "./hardware";
import { Interrupt } from "./imp/Interrupt";

export class InterruptController extends Hardware {

    //keeps track of all devices that generate interrupts
    private ioDevices = [];

    //keeps track of queue of interrupts
    private interruptQueue: any;

    public interruptFlag: boolean = false;
    
    constructor() {
        super(0, "Interrupt Controller", true);
    }

    //keeps track of all devices that generate interrupt
    public addDevice(object) {
        this.ioDevices.push(object);
    }

    public acceptInterrupt(interrupt) {
        if (!this.interruptQueue.includes(interrupt)) {
            this.interruptQueue.push(interrupt);
            this.interruptFlag = true;
        }//if
        
    }
    
    //sort the interrupt queue by priority, highest priority is the first element in the queue
    public sortInterruptQueue(): void {
        let length = this.interruptQueue.length;
        let temp = null;
        for (let i = 0; i < length - 2; i++) {
            for (let j = i + 1; j < length - 1; j++) {
                if (this.interruptQueue[i].priority < this.interruptQueue[j].priority) {
                    temp = this.interruptQueue[i];
                    this.interruptQueue[i] = this.interruptQueue[j];
                    this.interruptFlag[j] = temp;
                }
            }
        }
    }

    public runServiceInterrupt() {
        this.sortInterruptQueue();
        this.interruptQueue.shift.serviceInterrupt();
        //.shift takes the first interrupt in the queue which is the highest priority one since it was sorted, and removes it from the array
        //runs until there are no more interrupts in the array
        if (this.interruptQueue.length <= 0) {
            this.interruptFlag = false;
        }
    }
    

}