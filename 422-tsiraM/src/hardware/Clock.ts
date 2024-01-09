import { Cpu } from "./Cpu";
import { Hardware } from "./hardware";
import { ClockListener } from "./imp/ClockListener";
import { Memory } from "./Memory";

export class Clock extends Hardware {

    private clockListeners: ClockListener[];
    
    constructor() {
        super(0, "CLK", true);
        this.clockListeners = new Array<ClockListener>();
    }

    //Adds a clock listener into array
    public storeListeners(listener: ClockListener) {
        this.clockListeners.push(listener);
    }
    //Outputs each clock listener pulse every time the clock cycles after the timer expires
    public manageTimeout() {
        console.log("[HW - " + this.name + " id: " + this.id + " - " + Date.now() + "]: Clock Pulse Initialized");
        for (let i = 0; i < this.clockListeners.length; i++) {
            this.clockListeners[i].pulse();
        }
    }
}