import {
    SystemDigitsConfig,
} from "../commonTypes"


/**
 * Creates _SystemDigitsConfig_ instance from visual characters of string, to use when creating _NumberSystem_.
 */
export class CharGroup implements SystemDigitsConfig {
    base: number = 0
    dinamicArity = true

    readonly maxBase: number


    protected readonly charArr: string[] = []

    /**
     * @param chars - string containing at least 2 characters.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    constructor(chars: string, validate?: boolean) {
        const validArgs = validateArguments({ chars, validate }, CharGroupSchema)
        chars = validArgs.chars

        for (const char of chars) {
            this.charArr[this.base] = char
            this.base++
        }

        this.maxBase = this.base
    }

    /**
     * This function returns digit of given power.
     * @param pow - power of digit to return.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    digGen(...powers: number[]) {
        const digits: (string | undefined)[] = []
        for(let powIndex = 0; powIndex < powers.length; powIndex++) {
            digits[powIndex] = this.charArr[powers[powIndex]]
        }
        return digits
    }
}


// validation related imports
import { validateArguments } from "../utils"
import {
    CharGroupSchema,
} from "../validations/CharGroup"