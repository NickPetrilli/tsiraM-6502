export interface Interrupt {
    irq: number;
    name: string;
    priority: number;

    //question marks at end of variables mean it is optional
    //because not all I/O devices need both an input and output buffer
    inputBuffer?: string[]
    outputBuffer?: string[];

    //all I/0 that implements interrupt need a serviceInterrupt function
    serviceInterrupt();
    
}