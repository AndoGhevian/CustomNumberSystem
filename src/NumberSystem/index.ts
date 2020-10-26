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
    static decimalToDigDecimalArray(decimal: string, base: number, validate?: boolean): number[]
    static decimalToDigDecimalArray(decimal: number, base: number, validate?: boolean): number[]
    static decimalToDigDecimalArray(decimal: any, base: number, validate?: boolean) {
        const validArgs = validateArguments({ decimal, base, validate }, decimalToDigDecimalArraySchema)
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
    static digDecimalArrayToDecimal(digArray: number[], base: number, validate?: boolean) {
        const validArgs = validateArguments({ digArray, base, validate }, digDecimalArrayToDecimalSchema)
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
     **Default _false_**
     */
    add(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, addSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        const sumBigInt = JSBI.add(nsNumber1.bigInt, nsNumber2.bigInt)
        return new NSNumber(this, sumBigInt.toString())
    }

    subtract(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, subtractSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        const subtraction = JSBI.subtract(nsNumber1.bigInt, nsNumber2.bigInt)
        return new NSNumber(this, subtraction.toString())
    }

    remainder(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, remainderSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        const remainder = JSBI.remainder(nsNumber1.bigInt, nsNumber2.bigInt)
        return new NSNumber(this, remainder.toString())
    }

    multiply(nsNumber1: NSNumber, nsNumber2: NSNumber, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, multiplySchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        const multiply = JSBI.multiply(nsNumber1.bigInt, nsNumber2.bigInt)
        return new NSNumber(this, multiply.toString())
    }
}


import JSBI from "jsbi"
import { NSNumber } from "../NSNumber"
import { validateArguments } from "../utils"
import {
    addSchema,
    constructorSchema,
    decimalToDigDecimalArraySchema,
    digDecimalArrayToDecimalSchema,
    multiplySchema,
    remainderSchema,
    subtractSchema,
} from "../validations/NumberSystemValidations"


// // Testing NumberSystem
// const ns = new NumberSystem(['a',' b', 1] as any)
// console.log(ns)

// // Testing decimalToDigDecimalArray
// console.log(
//     NumberSystem.decimalToDigDecimalArray(
//         '99999999999999672519999999999999999999999999999999999999999999999999999999999999999999999999999999999'
//         +
//         '9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999'
//         +
//         '9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999',
//         Number.MAX_SAFE_INTEGER + 1,
//         true
//     )
// )

// // Testing digDecimalArrayToDecimal
// console.log(
//     NumberSystem.digDecimalArrayToDecimal([
//         1,0, 1, 1
//     ], 2, true)
// )

// // Testing add
// const sys1 = new NumberSystem(['a','b'])
// const sys2 = new NumberSystem(['h','j', 'k'])
// const sys3 = new NumberSystem(['r','t', 'y', 'u'])
// const num1 = new NSNumber(sys1, 10)
// const num2 = new NSNumber(sys2, '10')
// console.log(
//     sys3.add(num1, num2).toSystem(sys1)
// )