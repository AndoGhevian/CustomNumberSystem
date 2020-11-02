import { options } from "joi"
import JSBI from "jsbi"
import { OptimizaionMode } from ".."


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
    readonly optimizationMode: OptimizaionMode

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
    constructor(digits: string[], options?: {
        optimization?: 'memoiryOptimized' | 'performanceOptimized'
    }, validate?: boolean) {
        const validArgs = validateArguments({ digits, options, validate }, NumberSystemSchema)
        digits = validArgs.digits
        options = validArgs.options

        this.optimizationMode = options!.optimization!

        this.digits = digits
        this.base = this.digits.length
        this.baseBigInt = JSBI.BigInt(this.base)
    }

    /**
     * Compares two _NsNumbers_. Returnes true if _nsNumber1_ < _nsNumber2_
     * 
     * @param nsNumber1 - NSNumber.
     * @param nsNumber2 - NSNumber.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    static lessThan(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, opSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        return JSBI.lessThan(nsNumber1.bigInt, nsNumber2.bigInt)
    }

    /**
     * Compares two _NsNumbers_. Returnes true if _nsNumber1_ <= _nsNumber2_
     * 
     * @param nsNumber1 - NSNumber.
     * @param nsNumber2 - NSNumber.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    static lessThanOrEqual(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, opSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        return JSBI.lessThanOrEqual(nsNumber1.bigInt, nsNumber2.bigInt)
    }

    /**
     * Compares two _NsNumbers_. Returnes true if _nsNumber1_ == _nsNumber2_
     * 
     * @param nsNumber1 - NSNumber.
     * @param nsNumber2 - NSNumber.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    static equal(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, opSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        return JSBI.equal(nsNumber1.bigInt, nsNumber2.bigInt)
    }

    /**
     * Returns array of digits in provided _base_ for given non negative integer number.
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
    static decimalToDecDigitsArr(decimal: string, base: number, validate?: boolean): number[]
    static decimalToDecDigitsArr(decimal: number, base: number, validate?: boolean): number[]
    static decimalToDecDigitsArr(decimal: any, base: number, validate?: boolean) {
        const validArgs = validateArguments({ decimal, base, validate }, decimalToDecDigitsArrSchema)
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
    static decDigitsArrToDecimal(digArray: number[], base: number, validate?: boolean) {
        const validArgs = validateArguments({ digArray, base, validate }, decDigitsArrToDecimalSchema)
        digArray = validArgs.digArray
        base = validArgs.base

        const baseBigInt = JSBI.BigInt(base)
        let sumBigInt = NumberSystem.ZERO_BIG_INT
        for (const dig of digArray) {
            const digBigInt = JSBI.BigInt(dig)
            sumBigInt = JSBI.add(JSBI.multiply(sumBigInt, baseBigInt), digBigInt)
        }
        return sumBigInt.toString()
    }

    /**
     * Calculates digits count for number within system with given _base_.
     * @param base - Base to calculate digits within. Must be integer greater than _1_.
     * @param nsNumber - _NSNumber_ in any system.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    static countDigits(base: number, nsNumber: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ base, nsNumber, validate }, countDigitsStaticSchema)
        base = validArgs.base
        nsNumber = validArgs.nsNumber

        const sameBase = base === nsNumber.ns.base
        if (sameBase) {
            return nsNumber.countDigits()
        }

        const baseBigInt = JSBI.BigInt(base)

        let dividedBigInt = nsNumber.bigInt
        let digitsCount = 0
        do {
            digitsCount++
            dividedBigInt = JSBI.divide(dividedBigInt, baseBigInt)
        } while (!JSBI.equal(dividedBigInt, NumberSystem.ZERO_BIG_INT))

        return digitsCount
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

        const sys = this
        const sum = JSBI.add(nsNumber1.bigInt, nsNumber2.bigInt)

        return sys.Number(sum.toString(), false)
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

        const sys = this

        const subtraction = JSBI.subtract(nsNumber1.bigInt, nsNumber2.bigInt)
        if (JSBI.lessThan(subtraction, NumberSystem.ZERO_BIG_INT)) {
            return null
        }
        return sys.Number(subtraction.toString(), false)
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

        const sys = this
        const remainder = JSBI.remainder(nsNumber1.bigInt, nsNumber2.bigInt)

        return sys.Number(remainder.toString(), false)
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

        const sys = this
        const multiply = JSBI.multiply(nsNumber1.bigInt, nsNumber2.bigInt)

        return sys.Number(multiply.toString(), false)
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

        const sys = this
        const division = JSBI.divide(nsNumber1.bigInt, nsNumber2.bigInt)

        return sys.Number(division.toString(), false)
    }

    /**
     * Generates _NSNumbers_  based on custom function,
     * which must return number, string representation of number, or _NSNumber_ to add
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
             * ( negative numbers will also be presented unlike first argument ).
             */
            lastNumberStr?: string,
        ) => number | string | NSNumber | null,
        optional?: {
            /**
             * Defines if to exclude start number when generating numbers.
             * 
             * **Default - _false_**
             */
            excludeStart?: boolean,
            /**
             * Defines if to return _null_ if result after applying accumulator to last number is negative.
             * In this case memoized last number will be _NSNumber(0)_ and subsequent generated value will
             * be calculated against it.
             * 
             * If _false_ provided then returned number will be _NSNumber(0)_.
             * 
             * **Default - _true_**
             */
            onNegativeNull?: boolean,
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
        const zeroNsNumber = sys.Number(0, false)

        let sumNsNumber = sys.Number(startNsNumber, false)
        return function* () {
            if (!optional!.excludeStart) {
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
                    sumNsNumber = sys.Number(sumBigInt.toString(), false)
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

    /**
     * Monotonic _NSNumbers_ sequence generator.
     * @param startNsNumber - _NSNumber_ to start generating values from.
     * @param optional - Optional arguments.
     * For more details see each optional argument description.
     * 
     * **Default -  _See each property default_**
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    nsNumberGenerator(startNsNumber: NSNumber, optional?: {
        /**
         * End number represented with _NSNumber_.
         * 
         * **Default _undefined_ - It Means Generator will continue monotonously
         * generate _NSNumbers_, and pause only if zero reached.**
         * 
         * **So if its monotonously inceressing generator,**
         * **it will never stop.**
         */
        endNsNumber?: NSNumber,
        /**
         * Accumulator given in number, string representation of number, or _NSNumber_.
         * Must be nonzero integer or its representation.
         * 
         * **Default - _1_**
         */
        accumulator?: number | string | NSNumber,
        /**
             * Defines if to exclude start number when generating numbers.
             * 
             * **Default - _false_**
             */
        excludeStart?: boolean,
        /**
         * Defines if to exclude end number when reached generating numbers.
         * 
         * **Default - _false_**
         */
        excludeEnd?: boolean,
    }, validate?: boolean) {
        const validArgs = validateArguments(
            {
                startNsNumber,
                optional,
                validate,
            },
            nsNumberGeneratorSchema,
            { base: this.base }
        )
        startNsNumber = validArgs.startNsNumber
        optional = validArgs.optional

        const sys = this
        const zeroNsNumber = sys.Number(0, false)

        startNsNumber = sys.Number(startNsNumber, false)

        const accumulator = optional!.accumulator!
        const accBigInt = accumulator instanceof NSNumber ? accumulator.bigInt : JSBI.BigInt(accumulator)

        if (JSBI.lessThan(accBigInt, NumberSystem.ZERO_BIG_INT)) {
            const endNsNumber = optional!.endNsNumber
                ? sys.Number(optional!.endNsNumber!, false)
                : zeroNsNumber

            return function* () {
                if (!optional!.excludeStart) {
                    yield startNsNumber
                }

                let sumBigInt = JSBI.add(startNsNumber.bigInt, accBigInt)
                while (JSBI.lessThan(endNsNumber.bigInt, sumBigInt)) {
                    yield sys.Number(sumBigInt.toString(), false)

                    sumBigInt = JSBI.add(sumBigInt, accBigInt)
                }
                if (!optional!.excludeEnd && JSBI.equal(endNsNumber.bigInt, sumBigInt)) {
                    yield sys.Number(sumBigInt.toString(), false)
                }
            }
        } else {
            const accNsNumber = sys.Number(accBigInt.toString(), false)

            if (optional!.endNsNumber) {
                const endNsNumber = sys.Number(optional!.endNsNumber, false)

                return function* () {
                    if (!optional!.excludeStart) {
                        yield startNsNumber
                    }

                    let sumNsNumber = sys.add(startNsNumber, accNsNumber, false)

                    while (JSBI.lessThan(sumNsNumber.bigInt, endNsNumber.bigInt)) {
                        yield sumNsNumber

                        sumNsNumber = sys.add(sumNsNumber, accNsNumber, false)
                    }

                    if (!optional!.excludeEnd && JSBI.equal(endNsNumber.bigInt, sumNsNumber.bigInt)) {
                        yield sumNsNumber
                    }
                }
            }

            return function* () {
                if (!optional!.excludeStart) {
                    yield startNsNumber
                }

                let sumNsNumber = startNsNumber
                do {
                    sumNsNumber = sys.add(sumNsNumber, accNsNumber, false)
                    yield sumNsNumber
                } while (true);
            }
        }
    }

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

        const sys = this
        return new NSNumber(sys, number, false)
    }
}


import { NSNumber } from "../NSNumber"

// validation related imports
import { validateArguments } from "../utils"
import {
    NumberSystemSchema,
    decimalToDecDigitsArrSchema,
    decDigitsArrToDecimalSchema,
    opSchema,
    toStringSchema,
    NumberSchema,
    nsNumberManualGeneratorSchema,
    nsNumberGeneratorSchema,
    countDigitsSchema,
    getDigitSchema,
    countDigitsStaticSchema,
    decDigitsGeneratorSchema,
} from "../validations/NumberSystemValidations"