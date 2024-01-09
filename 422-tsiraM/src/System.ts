// import statements for hardware
import {Cpu} from "./hardware/Cpu";
import {Hardware} from "./hardware/Hardware";
import {Memory} from "./hardware/Memory";
import { Clock } from "./hardware/Clock";
import { MMU } from "./hardware/MMU";
import { InterruptController } from "./hardware/InterruptController";
import { Keyboard } from "./hardware/Keyboard";


/*
    Constants
 */
// Initialization Parameters for Hardware
// Clock cycle interval
const CLOCK_INTERVAL= 500;               // This is in ms (milliseconds) so 1000 = 1 second, 100 = 1/10 second
                                        // A setting of 100 is equivalent to 10hz, 1 would be 1,000hz or 1khz,
                                        // .001 would be 1,000,000 or 1mhz. Obviously you will want to keep this
                                        // small, I recommend a setting of 100, if you want to slow things down
                                        // make it larger.


export class System extends Hardware {

    private _CPU : Cpu = null;

    private _mem : Memory = null;

    private _Clock : Clock = null;

    private _MMU : MMU = null;

    private interruptController: InterruptController = null;

    private keyboard: Keyboard = null;
    
    public running: boolean = false;

    constructor() {
        super(0, "System", true);
        console.log("Hello TSIRAM!");

        //Instantiate each member of the system class


        this._mem = new Memory();

        this._Clock = new Clock();
    
        this._MMU = new MMU(this._mem);

        this.interruptController = new InterruptController;

        this._CPU = new Cpu(this._MMU, this.interruptController);

        this.keyboard = new Keyboard(this.interruptController);
        this.interruptController.addDevice(this.keyboard);
        this.keyboard.monitorKeys();
        
        /*
        Start the system (Analogous to pressing the power button and having voltages flow through the components)
        When power is applied to the system clock, it begins sending pulses to all clock observing hardware
        components so they can act on each clock cycle.
         */

        this.startSystem();

    }

    public startSystem(): boolean {
        
        this._CPU.log("created");
        super.log("created");
        
        this._MMU.log("created");
        //Loads a program into memory and dumps it
        this._MMU.loadImmediate();
        this._MMU.memoryDump(0x0000, 0x000F);
        
        this._mem.log("created");
        //Call to display memory addresses 0x00 to 0x14
        this._mem.displayMemory(0x14);

        this._Clock.log("created");
        //Calls to store listeners in an array 
        this._Clock.storeListeners(this._CPU);
        this._Clock.storeListeners(this._mem);

        //Sets a timer with clock interval constant and calls manageTimeout to cycle the clock 
        setInterval(() => this._Clock.manageTimeout(), CLOCK_INTERVAL);

        return true;
    }

    public stopSystem(): boolean {

        return false;

    }
}

let system: System = new System();


