
export class Hardware {

    id: number;
    name: string;
    debug: boolean;

    constructor(id: number, name: string, debug: boolean) {
        this.id = id;
        this.name = name;
        this.debug = true;

    }
    public log(message: string) {
        if (this.debug) {
            console.log("[HW - " + this.name + " id: " + this.id + " - " + Date.now() + "]: " + message);

        }
    }
    // Takes in a hex number memory address and a length for the hex number to be formatted to when outputted
    public hexLog(hexNum: number, desiredLength: number): string {
        let output: string = hexNum.toString(16);
        try {
            //Check to see if the number is already at the desired length, if it isn't then add padding zeroes until it is
            if (output.length < desiredLength) {
                let numZero: number = desiredLength - output.length;
                for (let i = 0; i < numZero; i++) {
                    output = 0 + output;
                }
            }
        }
        catch {
            output = "ERR [hexValue conversion]: number undefined";
        }
        
        
        return output;
    }
}