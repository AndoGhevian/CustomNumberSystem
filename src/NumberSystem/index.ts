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

    /**
     * @param digits - Digits of new number system with at least one element.
     * Each must contain at least one character.
     * 
     * NOTE: Digits must be unique.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default _false_**
     */
    constructor(digits: string[], validate?: boolean) {
        const validArgs = validateArguments({ digits, validate }, constructorSchema)
        digits = validArgs.digits

        this.digits = digits
        this.base = this.digits.length
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
     * **Default _false_**
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
     * **Default _false_**
     */
    static decimalDigArrToDecimal(digArray: number[], base: number, validate?: boolean) {
        const validArgs = validateArguments({ digArray, base, validate }, decimalDigArrToDecimalSchema)
        digArray = validArgs.digArray
        base = validArgs.base

        let numBigInt: JSBI = JSBI.BigInt(0)
        const lastBase = JSBI.BigInt(base)
        for (const dig of digArray) {
            const digBigInt = JSBI.BigInt(dig)
            numBigInt = JSBI.add(JSBI.multiply(numBigInt, lastBase), digBigInt)
        }
        return numBigInt.toString()
    }

    /**
     * Adds two _NSNumber_ instances in current _NumberSystem_.
     * i.e. result _NSNumber_ will be represented in current _NumberSystem_.
     * @param nsNumber1 - number to add.
     * @param nsNumber2 - number to add.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default _false_**
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
     * **Default _false_**
     */
    subtract(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, opSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        const subtraction = JSBI.subtract(nsNumber1.bigInt, nsNumber2.bigInt)
        if (JSBI.lessThan(subtraction, JSBI.BigInt(0))) {
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
     * **Default _false_**
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
     * **Default _false_**
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
     * **Default _false_**
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
     * **Default _false_**
     */
    toString(nsNumber: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber, validate }, toStringSchema)
        nsNumber = validArgs.nsNumber

        return nsNumber.digitsDecimalRepresentation.reduce((acc, cur) => {
            return acc + this.digits[cur]
        }, '')
    }

    /**
     * Add give number to provided with decimal digits array number in current _NumberSystem_.
     * @param decimalDigsArr - number given in decimal digits array in current _NumberSystem_.
     * @param number - addition number.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default _false_**
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

    /**
     * Increment digit at given position in provided decimal Digits array in current _NumberSystem_
     * and returns result digits array.
     * @param decimalDigsArr - decimal digits array in current _NumberSystem_.
     * @param positionFromRight - Position of digit to increment read from the right.
     * 
     * **Default _0_**
     * @param validate - Defines if to validate arguments.
     * 
     * **Default _false_**
     */
    incrementDecimalDigsArr(decimalDigsArr: number[], positionFromRight?: number, validate?: boolean) {
        const validArgs = validateArguments(
            {
                decimalDigsArr,
                positionFromRight,
                validate
            },
            incrementDecimalDigsArrSchema,
            { base: this.base }
        )
        decimalDigsArr = validArgs.decimalDigsArr
        positionFromRight = validArgs.positionFromRight as number

        const base = this.base
        if (positionFromRight >= decimalDigsArr.length) {
            decimalDigsArr.splice(0, 0, 1, ...[...Array(positionFromRight - decimalDigsArr.length)].map(_ => 0))
            return decimalDigsArr
        }

        let leftPos = decimalDigsArr.length - 1 - positionFromRight
        let remainder = base - decimalDigsArr[leftPos]
        while (positionFromRight < decimalDigsArr.length && remainder === 1) {
            decimalDigsArr[leftPos] = 0
            positionFromRight++
            if (positionFromRight !== decimalDigsArr.length) {
                leftPos = decimalDigsArr.length - 1 - positionFromRight
                remainder = base - decimalDigsArr[leftPos]
            }
        }
        if (positionFromRight === decimalDigsArr.length) {
            decimalDigsArr.splice(0, 0, 1)
        } else {
            decimalDigsArr[leftPos]++
        }
        return decimalDigsArr
    }

    decimalDigsGenerator(startDecimalDigsArr: number[], optional?: {
        endDecimalDigsArr?: number[] | null
        accumulator?: (...args: any[]) => number | number
        options?: {
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
        // if ()
        return validArgs
    }

    /**
     * **WARNING: This is Experimental, it needes banchmark test before official support!!!**
     * 
     * In an immutable way increment digit at given position in provided decimal digits array in current _NumberSystem_
     * and return result digits array.
     * @param decimalDigsArr - decimal digits array in current _NumberSystem_.
     * @param positionFromRight - Position of digit to increment read from the right.
     * 
     * **Default _0_**
     * @param validate - Defines if to validate arguments.
     * 
     * **Default _false_**
     */
    incrementDecimalDigsArrImmutable(decimalDigsArr: number[], positionFromRight?: number, validate?: boolean) {
        const validArgs = validateArguments(
            {
                decimalDigsArr,
                positionFromRight,
                validate
            },
            incrementDecimalDigsArrSchema,
            { base: this.base }
        )
        decimalDigsArr = validArgs.decimalDigsArr
        positionFromRight = validArgs.positionFromRight as number

        const base = this.base
        if (positionFromRight >= decimalDigsArr.length) {
            const endPortion = []
            for (let i = 0; i < positionFromRight - decimalDigsArr.length; i++) {
                endPortion.push(0)
            }
            endPortion.unshift(1)
            endPortion.push(...decimalDigsArr)
            return endPortion
        }

        let endPortion: number[] = []
        const startPortion: number[] = positionFromRight === 0
            ? []
            : decimalDigsArr.slice(-positionFromRight)
        const middlePortion = []

        let leftPos = decimalDigsArr.length - 1 - positionFromRight
        let remainder = base - decimalDigsArr[leftPos]
        while (positionFromRight < decimalDigsArr.length && remainder === 1) {
            middlePortion.push(0)
            positionFromRight++
            if (positionFromRight !== decimalDigsArr.length) {
                leftPos = decimalDigsArr.length - 1 - positionFromRight
                remainder = base - decimalDigsArr[leftPos]
            }
        }
        if (positionFromRight === decimalDigsArr.length) {
            middlePortion.unshift(1)
        } else {
            leftPos = decimalDigsArr.length - 1 - positionFromRight
            middlePortion.unshift(decimalDigsArr[leftPos] + 1)

            endPortion = decimalDigsArr.slice(0, leftPos)
        }

        if (endPortion.length) {
            endPortion.push(...middlePortion, ...startPortion)
            return endPortion
        }
        middlePortion.push(...startPortion)
        return middlePortion
    }



    // decimalDigsGenerator(nsNumber: NSNumber, optional?: {
    //     nsEndNumber?: NSNumber,
    //     addition?: number | string
    // }) {
    //     const additionSchema = Joi.alternatives()
    //         .try(
    //             Joi.number().max(Number.MAX_SAFE_INTEGER).min(Number.MIN_SAFE_INTEGER),
    //             Joi.string().pattern(/^(-|\+)?\d+$/, 'pos/neg number string')
    //         )
    //         .failover(1)
    //         .default(1)
    //     const currNsNumber = nsNumber.ns === this ? nsNumber : nsNumber.toSystem(this)

    //     let currBigInt = currNsNumber.bigInt
    //     let oneBigInt = JSBI.BigInt(1)

    //     return function* (): Generator<number[], any, number | string> {
    //         let addition = yield [...currNsNumber.digitsDecimalRepresentation]

    //         while (true) {
    //             const { value: addValue } = additionSchema.validate(addition)
    //             addition = addValue
    //         }
    //     }
    // }
}



import Joi from "joi"
import JSBI from "jsbi"
import { DecimalDigsGeneratorMode } from "../commonTypes"
import { NSNumber } from "../NSNumber"
import { validateArguments } from "../utils"
import {
    addToDecimalDigsArrSchema,
    constructorSchema,
    decimalToDecimalDigArrSchema,
    decimalDigArrToDecimalSchema,
    incrementDecimalDigsArrSchema,
    opSchema,
    toStringSchema,
    decimalDigsGeneratorSchema,
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