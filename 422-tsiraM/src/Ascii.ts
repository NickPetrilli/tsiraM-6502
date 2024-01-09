export class Ascii {
    
    private library: String[] = [

        "[NULL]",
        "[START OF HEADING]",
        "[START OF TEXT]",
        "[END OF TEXT]",
        "[END OF TRANSMISSION]",
        "[ENQUIRY]",
        "[ACKNOWLEDGE]",
        "[BELL]",
        "[BACKSPACE]",
        "\t",
        "[LINE FEED]",
        "[VERTICAL TAB]",
        "[FORM FEED]",
        "[CARRIAGE RETURN]",
        "[SHIFT OUT]",
        "[SHIFT IN]",
        "[DATA LINK ESCAPE]",
        "[DEVICE CONTROL 1]",
        "[DEVICE CONTROL 2]",
        "[DEVICE CONTROL 3]",
        "[DEVICE CONTROL 4]",
        "[NEGATIVE ACKNOWLEDGE]",
        "[SYNCRONOUS IDLE]",
        "[ENG OF TRANS. BLOCK]",
        "[CANCEL]",
        "[END OF MEDIUM]",
        "[SUBSTITUTE]",
        "[ESCAPE]",
        "[FILE SEPARATOR]",
        "[GROUP SEPARATOR]",
        "[RECORD SEPARATOR]",
        "[UNIT SEPARATOR]",

        // special characters
        " ",
        "!",
        '"',
        "#",
        "$",
        "%",
        "&",
        "'",
        "(",
        ")",
        "*",
        "+",
        ",",
        "-",
        ".",
        "/",

        //numbers
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        
        //symbols
        ":",
        ";",
        "<",
        "=",
        ">",
        "?",
        "@",


        //letters
        "A", 
        "B", 
        "C", 
        "D", 
        "E", 
        "F", 
        "G", 
        "H", 
        "I", 
        "J", 
        "K", 
        "L", 
        "M", 
        "N", 
        "O",
        "P", 
        "Q", 
        "R", 
        "S", 
        "T", 
        "U", 
        "V", 
        "W", 
        "X", 
        "Y", 
        "Z", 

        "[",
        "\\",
        "]",
        "^",
        "_",
        "`",


        "a", 
        "b", 
        "c", 
        "d", 
        "e", 
        "f", 
        "g", 
        "h", 
        "i", 
        "j", 
        "k", 
        "l", 
        "m", 
        "n", 
        "o", 
        "p", 
        "q", 
        "r", 
        "s", 
        "t", 
        "u", 
        "v", 
        "w", 
        "x", 
        "y", 
        "z",


        "{",
        "|",
        "}",
        "~",

        "[DEL]"

    ];

    constructor() {

    }

    public toChar(byte: number): String {
        return this.library[byte];
    }

    public toByte(char: String): number {
        return this.library.indexOf(char);
    }


}