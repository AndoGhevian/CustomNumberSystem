import JSBI from "jsbi"


/**
 * Represents new number system, with provided digits.
 */
export class NumberSystem {
    /**
     * Digits of current number system.
     */
    readonly digits: string[]
    /**
     * Base of Number System.
     */
    readonly base: number

    protected readonly baseBigInt: JSBI

    protected static readonly ZERO_BIG_INT = JSBI.BigInt(0)
    protected static readonly ONE_BIG_INT = JSBI.BigInt(1)

    /**
     * @param digits - Digits of new number system with at least one element.
     * Each must contain at least one character.
     * 
     * NOTE: Digits must be unique.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    constructor(digits: string[], validate?: boolean) {
        const validArgs = validateArguments({ digits, validate }, NumberSystemSchema)
        digits = validArgs.digits

        this.digits = digits

        this.base = this.digits.length

        this.baseBigInt = JSBI.BigInt(this.base)
    }

    /**
     * Returns array of digits in provided _base_ for given integer number.
     * Digits will be presented as decimals.
     * i.e. given number will be converted to _base_ and resulting digits will be presented in array as decimals.
     * @param decimal - Non negative Integer( decimal ) number represented eather by Allowed Number or String.
     * 
     * NOTE: 
     * - Allowed number means _number_ < _Number.MAX_SAFE_INTEGER_
     * - Any length number can be provided with _string_.
     * @param base - Base to calculate digits within.
     * i.e. if _base = 16_, digits will be integers of range [0, 15]. Base must be allowed number.
     * If string present, it will be converted to allowed number.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    static decimalToDecimalDigArr(decimal: string, base: number, validate?: boolean): number[]
    static decimalToDecimalDigArr(decimal: number, base: number, validate?: boolean): number[]
    static decimalToDecimalDigArr(decimal: any, base: number, validate?: boolean) {
        const validArgs = validateArguments({ decimal, base, validate }, decimalToDecimalDigArrSchema)
        decimal = validArgs.decimal
        base = validArgs.base

        const digDecArray = []
        let acc = JSBI.BigInt(decimal)
        if (JSBI.equal(acc, JSBI.BigInt(0))) {
            return [0]
        }

        const baseBigInt = JSBI.BigInt(base)
        for (let mul = baseBigInt; JSBI.GT(acc, 0); mul = JSBI.multiply(mul, baseBigInt)) {
            const remainder = JSBI.remainder(acc, mul)

            const digitDecNumBigInt = JSBI.divide(remainder, JSBI.divide(mul, baseBigInt))

            const digitDecNum = JSBI.toNumber(digitDecNumBigInt)
            digDecArray.push(digitDecNum)

            acc = JSBI.subtract(acc, remainder)
        }
        return digDecArray.reverse()
    }

    /**
     * Converts digits array given in decimal system for number in  _base_ system
     * to number in decimal system.
     * @param digArray - Array of digits in decimal system representing _base_ system number.
     * Digits must be less than given base.
     * @param base - represents considered number( given with digits array ) system base.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    static decimalDigArrToDecimal(digArray: number[], base: number, validate?: boolean) {
        const validArgs = validateArguments({ digArray, base, validate }, decimalDigArrToDecimalSchema)
        digArray = validArgs.digArray
        base = validArgs.base

        let sumBigInt: JSBI = NumberSystem.ZERO_BIG_INT
        const baseBigInt = JSBI.BigInt(base)
        for (const dig of digArray) {
            const digBigInt = JSBI.BigInt(dig)
            sumBigInt = JSBI.add(JSBI.multiply(sumBigInt, baseBigInt), digBigInt)
        }
        return sumBigInt.toString()
    }

    /**
     * Adds two _NSNumber_ instances in current _NumberSystem_.
     * i.e. result _NSNumber_ will be represented in current _NumberSystem_.
     * @param nsNumber1 - number to add.
     * @param nsNumber2 - number to add.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    add(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, opSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        const sumBigInt = JSBI.add(nsNumber1.bigInt, nsNumber2.bigInt)
        return new NSNumber(this, sumBigInt.toString())
    }

    /**
     * Subtract two _NSNumber_ instances in current _NumberSystem_.
     * i.e. result _NSNumber_ will be represented in current _NumberSystem_.
     * 
     * **NOTE: If result less than zero, _null_ will be returned.**
     * @param nsNumber1 - minuend number.
     * @param nsNumber2 - reducer number.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    subtract(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, opSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        const subtraction = JSBI.subtract(nsNumber1.bigInt, nsNumber2.bigInt)
        if (JSBI.lessThan(subtraction, NumberSystem.ZERO_BIG_INT)) {
            return null
        }
        return new NSNumber(this, subtraction.toString())
    }

    /**
     * Calculates _nsNumber1_ modulo _nsNumber2_ in current _NumberSystem_.
     * i.e. result _NSNumber_ will be represented in current _NumberSystem_.
     * @param nsNumber1 - dividend number.
     * @param nsNumber2 - divider number.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    remainder(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, opSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        const remainder = JSBI.remainder(nsNumber1.bigInt, nsNumber2.bigInt)
        return new NSNumber(this, remainder.toString())
    }

    /**
     * Multiply _nsNumber1_ by _nsNumber2_ in current _NumberSystem_.
     * i.e. result _NSNumber_ will be represented in current _NumberSystem_.
     * @param nsNumber1 - multipler number.
     * @param nsNumber2 - multipler number.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    multiply(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, opSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        const multiply = JSBI.multiply(nsNumber1.bigInt, nsNumber2.bigInt)
        return new NSNumber(this, multiply.toString())
    }

    /**
     * Divide _nsNumber1_ by _nsNumber2_ in current _NumberSystem_
     * and _NSNumber_ with integer part of division will be returned.
     * 
     * Result _NSNumber_ will be represented in current _NumberSystem_.
     * @param nsNumber1 - number to add.
     * @param nsNumber2 - number to add.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    divide(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, opSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        const division = JSBI.divide(nsNumber1.bigInt, nsNumber2.bigInt)
        return new NSNumber(this, division.toString())
    }

    /**
     * Returns string representation of provided number in current _NumberSystem_.
     * @param nsNumber - number to present in digits of current system.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    toString(nsNumber: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber, validate }, toStringSchema)
        nsNumber = validArgs.nsNumber

        return nsNumber.digitsDecimalRepresentation.reduce((acc, cur) => {
            return acc + this.digits[cur]
        }, '')
    }

    /**
     * Generates _NSNumbers_  based on custom function,
     * which must return _NSNumber_ to add
     * to last _NSNumber_ generated or null, to return from generator(to stop it).
     * @param startNsNumber - _NSNumber_ to start generating values from.
     * @param accumulator - Function which returns number, string representation of number, or _NSNumber_
     * to increment last value with, or null to stop generator.
     * @param optional - Optional arguments.
     * For more details see each optional argument description.
     * 
     * **Default -  _See each propery default_**
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    nsNumberManualGenerator(
        startNsNumber: NSNumber,
        accumulator: (
            /**
             * This argument will be or _NSNumber_, if after applying accumulator to last number result is positive,
             * or will be _null_ if its not.
             */
            lastNsNumber?: NSNumber | null,
            /**
             * String representation of last number after applying to it accumulator
             * ( negative numbers will also be presented as strings unlike first argument ).
             */
            lastNumberStr?: string,
        ) => number | string | NSNumber | null,
        optional?: {
            /**
             * Defines if to exclude start number when generating numbers.
             * 
             * **Default - _false_**
             */
            excludeStart?: boolean
            /**
             * Defines if to return _null_ if result after applying accumulator to last number is negative.
             * In this case memoized last number will be _NSNumber(0)_ and subsequent generated value will
             * be calculated against it.
             * 
             * If _false_ provided then returned number will be _NSNumber(0)_.
             * 
             * **Default - _true_**
             */
            onNegativeNull?: boolean
        }, validate?: boolean) {
        const validArgs = validateArguments(
            {
                startNsNumber,
                accumulator,
                optional,
                validate,
            },
            nsNumberManualGeneratorSchema,
            { base: this.base }
        )
        startNsNumber = validArgs.startNsNumber
        accumulator = validArgs.accumulator
        optional = validArgs.optional

        const sys = this
        const zeroNsNumber = sys.Number(0)

        let sumNsNumber = sys.Number(startNsNumber)
        return function* () {
            if(!optional!.excludeStart) {
                yield sumNsNumber
            }

            let acc = accumulator()
            while (true) {
                if (acc === null) return

                const accBigInt = acc instanceof NSNumber ? acc.bigInt : JSBI.BigInt(acc)

                const sumBigInt = JSBI.add(accBigInt, sumNsNumber.bigInt)
                const sumIsNegative = JSBI.lessThan(sumBigInt, NumberSystem.ZERO_BIG_INT)
                if (sumIsNegative) {
                    sumNsNumber = zeroNsNumber
                    if (optional!.onNegativeNull) {
                        yield null
                    } else {
                        yield sumNsNumber
                    }
                } else {
                    sumNsNumber = sys.Number(sumBigInt.toString())
                    yield sumNsNumber
                }

                switch (accumulator.length) {
                    case 2:
                        acc = accumulator(sumIsNegative ? null : sumNsNumber, sumBigInt.toString())
                        break
                    case 1:
                        acc = accumulator(sumIsNegative ? null : sumNsNumber)
                        break
                    case 0:
                    default:
                        acc = accumulator()
                }
            }
        }
    }

    // /**
    //  * 
    //  * @param startNsNumber - Decimal digits array in current base.
    //  * .i.e Each element in array must be from set of remainders of division on current _base_.
    //  * @param optional - Defines generator behavior. For more details see each option description.
    //  * 
    //  * **Default -  _See each propery default_**
    //  * @param validate - Defines if to validate arguments.
    //  * 
    //  * **Default - _false_**
    //  */
    // nsNumberGenerator(startNsNumber: NSNumber, optional?: {
    //     /**
    //      * Excluded end number represented in digits array of current base, to pause generator.
    //      * 
    //      * **NOTE:** For _stop_ or _continue_ after pause you must change _options.stopOnZeroOrEnd_ option.
    //      * 
    //      * **Default - _null_, i.e. generator will monotonously continue generation of digits arrays,**
    //      * **until zero(if its reached) and pause. So if its monotonously inceressing generator**
    //      * **or CONSTANT _NOTZERO_ it will not stop.**
    //      */
    //     endNsNumber?: NSNumber | null
    //     /**
    //      * Accumulator represented in number or string representation of number.
    //      */
    //     accumulator?: number | string | NSNumber
    //     /**
    //      * Customize generator behaviour.
    //      */
    //     options?: {
    //         /**
    //          * Defines if to return(stop) generator after pause state reached.
    //          * 
    //          * **Default - _true_**
    //          */
    //         stopOnZeroOrEnd?: boolean
    //         /**
    //          * **CURRENTLY NOT SUPPORTED**
    //          */
    //         mode?: DecimalDigsGeneratorMode
    //     }
    // }, validate?: boolean) {
    //     const validArgs = validateArguments(
    //         {
    //             startNsNumber,
    //             optional,
    //             validate,
    //         },
    //         decimalDigsGeneratorSchema,
    //         { base: this.base }
    //     )
    //     startNsNumber = validArgs.startNsNumber
    //     optional = validArgs.optional

    //     const sys = this
    //     const zeroNsNumber = sys.Number(0)
    //     const endNsNumber = optional!.endNsNumber !== null
    //         ? sys.Number(optional!.endNsNumber!)
    //         : null

    //     let sumNsNumber = sys.Number(startNsNumber)

    //     return function* () {
    //         const accNsNumber = optional!.accumulator!
    //         if (!endNsNumber) {
    //             if(JSBI.lessThan(accNsNumber.bigInt, NumberSystem.ZERO_BIG_INT)) {

    //             }

    //             let lastNsNumber = sumNsNumber
    //             while (true) {
    //                 if(JSBI.lessThan(sumNsNumber.bigInt, endNsNumber.))

    //                 if (JSBI.lessThan(sumBigInt, zeroBigInt)) {
    //                     yield [...zeroNsNumber.digitsDecimalRepresentation]
    //                 } else {
    //                     yield NumberSystem.decimalToDecimalDigArr(sumBigInt.toString(), base)
    //                 }
    //             }
    //         } else {
    //             // while (JSBI.lessThan(sumBigInt, endBigInt)) {
    //             //     const additionBigInt = JSBI.BigInt(optional!.accumulator!)
    //             //     sumBigInt = JSBI.add(sumBigInt, additionBigInt)

    //             //     if (JSBI.lessThan(sumBigInt, zeroBigInt)) {
    //             //         yield [...zeroNsNumber.digitsDecimalRepresentation]
    //             //     } else {
    //             //         yield NumberSystem.decimalToDecimalDigArr(sumBigInt.toString(), base)
    //             //     }
    //             // }
    //         }
    //     }
    // }

    /**
     * Returns _NSNumber_ object in current _NumberSystem_.
     * @param number - number, string( representation of number ), _NSNumber_ object, **OR**
     * Array of decimal digits in current _NumberSystem_.
     * 
     * **Default -**
     * - **If empty array provided  - _[0]_**
     * - **If nothing(_undefined_) -  _0_**
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    Number(number?: number, validate?: boolean): NSNumber
    Number(numberStr?: string, validate?: boolean): NSNumber
    Number(nsNumber: NSNumber, validate?: boolean): NSNumber
    Number(decimalDigArray?: number[], validate?: boolean): NSNumber
    Number(number?: any, validate?: boolean) {
        const validArgs = validateArguments({ number, validate }, NumberSchema)
        number = validArgs.number

        return new NSNumber(this, number)
    }
}


import { DecimalDigsGeneratorMode } from "../commonTypes"

import { NSNumber } from "../NSNumber"

// validation related imports
import { validateArguments } from "../utils"
import {
    NumberSystemSchema,
    decimalToDecimalDigArrSchema,
    decimalDigArrToDecimalSchema,
    opSchema,
    toStringSchema,
    decimalDigsGeneratorSchema,
    NumberSchema,
    nsNumberManualGeneratorSchema,
} from "../validations/NumberSystemValidations"