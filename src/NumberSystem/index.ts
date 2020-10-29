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

    static readonly ZERO_BIG_INT = JSBI.BigInt(0)
    static readonly ONE_BIG_INT = JSBI.BigInt(1)

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
     * Generates decimal digits arrays based on custom function,
     * which must return number or string representation of number to add
     * to last decimal digits array, or null to return from generator(to stop it).
     * @param startDecimalDigsArr - Decimal digits array in current base.
     * .i.e Each element in array must be from set of remainders of division on current _base_.
     * @param accumulator - Function which returnes number or string representation of number
     * to increment current value whith or null to stop generator.
     * @param optional - Defines generator behavior. For more details see each option description.
     * 
     * **Default -  _See each propery default_**
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    decimalDigsManualGenerator(
        startDecimalDigsArr: number[],
        accumulator: (lastNSNumber?: NSNumber) => NSNumber | null,
        optional?: {
            /**
             * Customize generator behaviour.
             */
            options?: {
                /**
                 * **CURRENTLY NOT SUPPORTED**
                 */
                mode?: DecimalDigsGeneratorMode
            }
        }, validate?: boolean) {
        const validArgs = validateArguments(
            {
                startDecimalDigsArr,
                accumulator,
                optional,
                validate,
            },
            decimalDigsManualGeneratorSchema,
            { base: this.base }
        )
        startDecimalDigsArr = validArgs.startDecimalDigsArr
        accumulator = validArgs.accumulator
        optional = validArgs.optional

        const zeroNsNumber = this.Number(0)
        const startNsNumber = this.Number(startDecimalDigsArr)

        const base = this.base

        let sumBigInt = startNsNumber.bigInt
        return function* () {
            let accNsNumber = accumulator()
            if (accumulator.length) {
                while (true) {
                    if (accNsNumber === null) return

                    let additionBigInt = accNsNumber.bigInt
                    sumBigInt = JSBI.add(sumBigInt, additionBigInt)

                    let lastDecimalDigsArr: number[]
                    if (JSBI.lessThan(sumBigInt, NumberSystem.ZERO_BIG_INT)) {
                        yield [...zeroNsNumber.digitsDecimalRepresentation]

                        lastDecimalDigsArr = [...zeroNsNumber.digitsDecimalRepresentation]
                    } else {
                        const yieldDecDigsArr = NumberSystem.decimalToDecimalDigArr(sumBigInt.toString(), base)
                        yield yieldDecDigsArr

                        lastDecimalDigsArr = [...yieldDecDigsArr]
                    }

                    accNsNumber = accumulator(lastDecimalDigsArr)
                }
            } else {
                while (true) {
                    if (accNsNumber === null) return

                    let additionBigInt = JSBI.BigInt(accNsNumber)
                    sumBigInt = JSBI.add(sumBigInt, additionBigInt)

                    if (JSBI.lessThan(sumBigInt, zeroBigInt)) {
                        yield [...zeroNsNumber.digitsDecimalRepresentation]
                    } else {
                        const yieldDecDigsArr = NumberSystem.decimalToDecimalDigArr(sumBigInt.toString(), base)
                        yield yieldDecDigsArr
                    }

                    accNsNumber = accumulator()
                }
            }
        }
    }

    /**
     * 
     * @param startDecimalDigsArr - Decimal digits array in current base.
     * .i.e Each element in array must be from set of remainders of division on current _base_.
     * @param optional - Defines generator behavior. For more details see each option description.
     * 
     * **Default -  _See each propery default_**
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    decimalDigsGenerator(startDecimalDigsArr: number[], optional?: {
        /**
         * Excluded end number represented in digits array of current base, to pause generator.
         * 
         * **NOTE:** For _stop_ or _continue_ after pause you must change _options.stopOnZeroOrEnd_ option.
         * 
         * **Default - _null_, i.e. generator will monotonously continue generation of digits arrays,**
         * **until zero(if its reached) and pause. So if its monotonously inceressing generator**
         * **or CONSTANT _NOTZERO_ it will not stop.**
         */
        endDecimalDigsArr?: number[] | null
        /**
         * Accumulator represented in number or string representation of number.
         */
        accumulator?: number | string
        /**
         * Customize generator behaviour.
         */
        options?: {
            /**
             * Defines if to return(stop) generator after pause state reached.
             * 
             * **Default - _true_**
             */
            stopOnZeroOrEnd?: boolean
            /**
             * **CURRENTLY NOT SUPPORTED**
             */
            mode?: DecimalDigsGeneratorMode
        }
    }, validate?: boolean) {
        const validArgs = validateArguments(
            {
                startDecimalDigsArr,
                optional,
                validate,
            },
            decimalDigsGeneratorSchema,
            { base: this.base }
        )
        startDecimalDigsArr = validArgs.startDecimalDigsArr
        optional = validArgs.optional

        const zeroNsNumber = this.Number(0)
        const startNsNumber = this.Number(startDecimalDigsArr)

        const base = this.base
        const zeroBigInt = zeroNsNumber.bigInt

        let sumBigInt = startNsNumber.bigInt

        const endBigInt = optional!.endDecimalDigsArr
            ? this.Number(startDecimalDigsArr).bigInt
            : null

        return function* () {
            if (!endBigInt) {
                if (typeof optional!.accumulator === 'function') {
                    while (true) {
                        const additionBigInt = JSBI.BigInt(optional!.accumulator())
                        sumBigInt = JSBI.add(sumBigInt, additionBigInt)

                        if (JSBI.lessThan(sumBigInt, zeroBigInt)) {
                            yield [...zeroNsNumber.digitsDecimalRepresentation]
                        } else {
                            yield NumberSystem.decimalToDecimalDigArr(sumBigInt.toString(), base)
                        }
                    }
                } else {
                    while (true) {
                        const additionBigInt = JSBI.BigInt(optional!.accumulator!)
                        sumBigInt = JSBI.add(sumBigInt, additionBigInt)

                        if (JSBI.lessThan(sumBigInt, zeroBigInt)) {
                            yield [...zeroNsNumber.digitsDecimalRepresentation]
                        } else {
                            yield NumberSystem.decimalToDecimalDigArr(sumBigInt.toString(), base)
                        }
                    }
                }
            } else {
                if (typeof optional!.accumulator === 'function') {
                    while (JSBI.lessThan(sumBigInt, endBigInt)) {
                        const additionBigInt = JSBI.BigInt(optional!.accumulator())
                        sumBigInt = JSBI.add(sumBigInt, additionBigInt)

                        if (JSBI.lessThan(sumBigInt, zeroBigInt)) {
                            yield [...zeroNsNumber.digitsDecimalRepresentation]
                        } else {
                            yield NumberSystem.decimalToDecimalDigArr(sumBigInt.toString(), base)
                        }
                    }
                } else {
                    while (JSBI.lessThan(sumBigInt, endBigInt)) {
                        const additionBigInt = JSBI.BigInt(optional!.accumulator!)
                        sumBigInt = JSBI.add(sumBigInt, additionBigInt)

                        if (JSBI.lessThan(sumBigInt, zeroBigInt)) {
                            yield [...zeroNsNumber.digitsDecimalRepresentation]
                        } else {
                            yield NumberSystem.decimalToDecimalDigArr(sumBigInt.toString(), base)
                        }
                    }
                }
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

        return new NSNumber(this, number)
    }

    /**
     * **WARNING: This is Experimental, but currently it works!!!**
     * 
     * Add give number to provided with decimal digits array number in current _NumberSystem_.
     * @param decimalDigsArr - number given in decimal digits array in current _NumberSystem_.
     * @param number - addition number. Must be non negative.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    addToDecimalDigsArr(decimalDigsArr: number[], number: number, validate?: boolean) {
        const validArgs = validateArguments(
            {
                decimalDigsArr,
                number,
                validate
            },
            addToDecimalDigsArrSchema,
            { base: this.base }
        )
        decimalDigsArr = validArgs.decimalDigsArr
        number = validArgs.number as number

        const base = this.base

        const endPortionReversed: number[] = []
        let lastSurplus = 0
        let index = decimalDigsArr.length - 1
        while (!(lastSurplus === 0 && number === 0)) {
            const currDig = index >= 0 ? decimalDigsArr[index] : 0
            const remainder = base - currDig - lastSurplus

            if (remainder === 0) {
                lastSurplus = 1
                const rmd = number % base
                if (index >= 0) {
                    decimalDigsArr[index] = rmd
                } else {
                    endPortionReversed.push(rmd)
                }
                number = (number - rmd) / base
            } else {
                const sbtr = number - remainder
                if (sbtr < 0) {
                    lastSurplus = 0
                    if (index >= 0) {
                        decimalDigsArr[index] = base - remainder + number
                    } else {
                        endPortionReversed.push(base - remainder + number)
                    }
                    number = 0
                } else {
                    lastSurplus = 1
                    const rmd = sbtr % base
                    if (index >= 0) {
                        decimalDigsArr[index] = rmd
                    } else {
                        endPortionReversed.push(rmd)
                    }
                    number = (sbtr - rmd) / base
                }
            }
            index--
        }

        decimalDigsArr.splice(0, 0, ...endPortionReversed.reverse())
        return decimalDigsArr
    }
}



import Joi from "joi"
import JSBI from "jsbi"
import { DecimalDigsGeneratorMode } from "../commonTypes"
import { NSNumber } from "../NSNumber"
import { validateArguments } from "../utils"
import { NSNumberSchema } from "../validations/NSNumberValidations"
import {
    addToDecimalDigsArrSchema,
    NumberSystemSchema,
    decimalToDecimalDigArrSchema,
    decimalDigArrToDecimalSchema,
    opSchema,
    toStringSchema,
    decimalDigsGeneratorSchema,
    NumberSchema,
    decimalDigsManualGeneratorSchema,
} from "../validations/NumberSystemValidations"


// // Testing NumberSystem
// const ns = new NumberSystem(['a',' b', 1] as any)
// console.log(ns)

// // Testing decimalToDecimalDigArr
// console.log(
//     NumberSystem.decimalToDecimalDigArr(
//         '99999999999999672519999999999999999999999999999999999999999999999999999999999999999999999999999999999'
//         +
//         '9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999'
//         +
//         '9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
//         Number.MAX_SAFE_INTEGER + 1,
//         true
//     )
// )

// // Testing decimalDigArrToDecimal
// console.log(
//     NumberSystem.decimalDigArrToDecimal([
//         1,0, 1, 1
//     ], 2, true)
// )

// Testing add
// const sys1 = new NumberSystem(['a','b'])
// const sys2 = new NumberSystem(['h','j', 'k'])
// const sys3 = new NumberSystem(['r','t', 'y', 'u'])
// const num1 = new NSNumber(sys1, 10)
// const num2 = new NSNumber(sys2, '10')
// console.log(
//     sys3.add(num1, num2).toSystem(sys1)
// )


// // Testing toString
// const sys1 = new NumberSystem(['a','b'])
// sys1.toString(undefined as any, true)