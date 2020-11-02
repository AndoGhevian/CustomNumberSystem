import JSBI from "jsbi"
import { start } from "repl"
import { RequireExceptFields } from ".."
import { RequireFields } from "../commonTypes"


/**
 * Represents provided number in given number system.
 */
export class NSNumber {
    readonly ns: NumberSystem = null as any
    readonly bigInt: JSBI = null as any

    private _digitsCount: number = null as any

    private _digitsArr: number[] | null = null
    private _digitsMap: { [key: number]: number } | null = {}
    private _digitsMapMax: number | null = 1
    private _digitsMapLength: number | null = 0

    /**
     * @param ns - Number System object, in which number ( number digits array ) represented.
     * @param number - number, string( representation of number ), _NSNumber_ object, **OR**
     * Array of decimal digits in provided as argument Number System - _ns_.
     * 
     * **Default -**
     * - **If empty array provided  - _[0]_**
     * - **If nothing(_undefined_) -  _0_**
     * @param validate - Defines if to validate arguments.
     * 
     * **Default _false_**
     */
    constructor(ns: NumberSystem, number?: number, validate?: boolean)
    constructor(ns: NumberSystem, numberStr?: string, validate?: boolean)
    constructor(ns: NumberSystem, nsNumber: NSNumber, validate?: boolean)
    constructor(ns: NumberSystem, decimalDigArray?: number[], validate?: boolean)
    constructor(ns: NumberSystem, number?: any, validate?: boolean) {
        const validArgs = validateArguments({ ns, number, validate }, NSNumberSchema)
        ns = validArgs.ns
        number = validArgs.number

        this.ns = ns

        const isPerformanceOptimized = this.ns.optimizationMode === 'performanceOptimized'
        if (!isPerformanceOptimized) {
            this._digitsMap = null
            this._digitsMapMax = null
            this._digitsMapLength = null
        }

        switch (typeof number) {
            case 'number':
            case 'string':
                this.bigInt = JSBI.BigInt(number)
                break
            case 'object':
            default:
                if (number instanceof NSNumber) {
                    this.bigInt = number.bigInt
                    if (this.ns.base === number.ns.base) {
                        this._digitsCount = number._digitsCount

                        if (isPerformanceOptimized && number.ns.optimizationMode === 'performanceOptimized') {
                            this._digitsArr = number._digitsArr
                            this._digitsMap = number._digitsMap
                            this._digitsMapMax = number._digitsMapMax
                            this._digitsMapLength = number._digitsMapLength
                        }
                    }
                    break
                }
                if (number instanceof Array) {
                    const numStr = NumberSystem.decDigitsArrToDecimal(number, this.ns.base, false)

                    this.bigInt = JSBI.BigInt(numStr)
                    this._digitsCount = number.length

                    if (isPerformanceOptimized) {
                        this._digitsArr = [...number]
                        this._digitsMap = null
                        this._digitsMapMax = null
                        this._digitsMapLength = null
                    }
                    break
                }
        }
    }


    /**
     * Returns digit at give position of current _NSNumber_ or _null_ if not existing digit position provided.
     * @param position - index of digit in current _NumberSystem_.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    getDigit(position: number, validate?: boolean) {
        const validArgs = validateArguments({ position, validate }, getDigitSchema)
        position = validArgs.position

        if (position < 0) {
            return null
        }

        const isPerformanceOptimized = this.ns.optimizationMode === 'performanceOptimized'

        if (isPerformanceOptimized) {
            if (this._digitsArr) {
                return this._digitsArr.length > position
                    ? this._digitsArr[position]
                    : null
            }
            if (position in this._digitsMap!) {
                return this._digitsMap![position]
            }
        }


        const digitsCount = this.countDigits()
        if (position >= digitsCount) {
            return null
        }

        const base = this.ns['baseBigInt']
        const baseExp = JSBI.exponentiate(base, JSBI.BigInt(digitsCount - position))
        const numRight = JSBI.remainder(this.bigInt, baseExp)

        const digit = JSBI.toNumber(JSBI.divide(numRight, JSBI.divide(baseExp, base)))
        if (isPerformanceOptimized) {
            this._digitsMap![position] = digit
            this._digitsMapLength!++

            const newMaxDigit = position + 1
            if (newMaxDigit > this._digitsMapMax!) {
                this._digitsMapMax = newMaxDigit
            }
        }
        return digit
    }

    /**
     * Calculates digits count for current _NSNumber_.
     */
    countDigits() {
        if (this._digitsCount) {
            return this._digitsCount
        }

        const isPerformanceOptimized = this.ns.optimizationMode === 'performanceOptimized'

        let minDigitsCount = 1
        if (isPerformanceOptimized) {
            minDigitsCount = this._digitsMapMax!
        }

        if (this.ns.base === 10) {
            this._digitsCount = this.bigInt.toString().length
            return this._digitsCount
        }

        const base = this.ns['baseBigInt']
        const baseExp = JSBI.exponentiate(base, JSBI.BigInt(minDigitsCount))

        let divideNumber = JSBI.divide(this.bigInt, baseExp)
        let digitsCount = minDigitsCount
        while (!JSBI.equal(divideNumber, NumberSystem['ZERO_BIG_INT'])) {
            digitsCount++
            divideNumber = JSBI.divide(divideNumber, base)
        }
        
        this._digitsCount = digitsCount

        return digitsCount
        // if (this._digitsMapMax) {
        //     // const digitPosArr = Object.keys(this._digitsMap) as any[]

        //     // minDigitsCount = digitPosArr.length ? Math.max(...digitPosArr) : 1
        // }
    }


    private _mapToArr() {
        if (this._digitsMapLength === this._digitsCount) {
            this._digitsArr = []
            for (let key in this._digitsMap) {
                this._digitsArr.push(this._digitsMap[key as any])
            }
            this._digitsMap = null
            this._digitsMapMax = null
            this._digitsMapLength = null
        }
    }

    decDigitsGenerator(optional?: {
        /**
         * Digit position to start generating from.
         * Must be greaterOrEqual to zero integer.
         * 
         * **Default _0_ - It Means Generator will continue monotonously
         * generate digits until edge position reached(0 or _Last Digit Position_).**
         */
        startPosition?: number,
        /**
         * End digit position to generate.
         * Must be greaterOrEqual to zero integer.
         * 
         * **Default _undefined_ - It Means Generator will continue monotonously
         * generate digits until edge position reached(0 or _Last Digit Position_).**
         */
        endPosition?: number,
        /**
         * Accumulator given in number.
         * Must be nonzero integer.
         * 
         * **Default - _1_**
         */
        accumulator?: number,
        /**
         * Defines if to exclude start position when start generating digits.
         * 
         * **Default - _false_**
         */
        excludeStartPosition?: boolean,
        /**
         * Defines if to exclude end position when reached generating digits.
         * 
         * **Default - _false_**
         */
        excludeEndPosition?: boolean,
    }, validate?: boolean): () => Generator<number | null> {
        const validArgs = validateArguments(
            {
                optional,
                validate,
            },
            decDigitsGeneratorSchema,
        )
        optional = validArgs.optional

        const {
            startPosition,
            endPosition,
            accumulator,
            excludeEndPosition,
            excludeStartPosition,
        } = optional as RequireExceptFields<typeof optional, 'endPosition'>

        const baseBigInt = this.ns['baseBigInt']
        const isPerformanceOptimized = this.ns.optimizationMode === 'performanceOptimized'

        // 1. DigitsArrayExists (If performance optimized and digits array exists)
        //__________________________________________________
        if (this._digitsArr) {
            const digitsArr = this._digitsArr
            // ___________Generator___________
            return function* () {
                const monotonouslyIncressing = accumulator > 0 ? true : false
                if (!excludeStartPosition) {
                    yield startPosition < digitsArr.length ? digitsArr[startPosition] : null
                }

                const startPos = startPosition + accumulator
                let endPos = endPosition
                if (endPosition === undefined) {
                    endPos = monotonouslyIncressing ? digitsArr.length : 0
                }

                let pos = startPos
                const accAlgorithm = () => {
                    const result = pos < digitsArr.length ? digitsArr[pos] : null
                    pos += accumulator
                    return result
                }

                if (monotonouslyIncressing) {
                    while (pos < endPos!) {
                        yield accAlgorithm()
                    }
                } else {
                    while (pos > endPos!) {
                        yield accAlgorithm()
                    }
                }

                if (pos === endPos && !excludeEndPosition) {
                    yield pos < digitsArr.length ? digitsArr[pos] : null
                }
            }
            // ___________GeneratorEnd___________
        }
        //1. DigitsArrayExists End______________

        // 2. DigitsMapExists (If performance optimized and digits map exists)
        //__________________________________________________
        if (this._digitsMap) {
            const numBigInt = this.bigInt
            if (this._digitsCount) {
                // 2.1 digitsCountCalcualted (If digits count calculated)
                const digitsMap = this._digitsMap
                const digitsCount = this._digitsCount
                const currNsNumber = this
                // ___________Generator___________
                return function* () {
                    const monotonouslyIncressing = accumulator > 0 ? true : false
                    if (startPosition >= digitsCount) {
                        // 2.1.1--InGen startPosition >= digitsCount (If start position more or equal than digits count)
                        let startPos: number, endPos: number

                        if (!excludeStartPosition) {
                            yield null
                        }
                        if (monotonouslyIncressing) {
                            return
                        }

                        // NOTE: Always decressing below.
                        const nullStartPos = startPosition + accumulator
                        let nullEndPos = endPosition
                        if (endPosition === undefined) {
                            nullEndPos = digitsCount
                        } else if (endPosition < digitsCount) {
                            nullEndPos = digitsCount
                        }

                        let nullPos = nullStartPos
                        while (nullPos > nullEndPos!) {
                            yield null
                            nullPos += accumulator
                        }

                        if (endPosition === nullPos) {
                            if (!excludeEndPosition) {
                                yield null
                            }
                            return
                        }

                        yield null

                        startPos = nullPos + accumulator
                        endPos = endPosition !== undefined ? endPosition : 0

                        if (startPos > endPos || (startPos === endPos && !excludeEndPosition)) {
                            if (currNsNumber._digitsMapMax !== null) {
                                currNsNumber._digitsMapMax = startPos
                            }
                        }

                        let exp = digitsCount - startPos
                        let lastNum = numBigInt

                        let pos = startPos
                        const decressingAlgorithm = () => {
                            let decimalDigitResult: number
                            if (pos in digitsMap) {
                                decimalDigitResult = digitsMap[pos]
                                exp += accumulator
                            } else {
                                const baseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(exp))

                                const numberRight = JSBI.remainder(lastNum, baseExp)
                                const digitBigInt = JSBI.divide(numberRight, JSBI.divide(baseExp, baseBigInt))
                                digitsMap[pos] = JSBI.toNumber(digitBigInt)
                                if (currNsNumber._digitsMapLength !== null) {
                                    currNsNumber._digitsMapLength++
                                    currNsNumber._mapToArr()
                                }
                                decimalDigitResult = digitsMap[pos]

                                lastNum = JSBI.divide(lastNum, baseExp)
                                exp = 1
                            }
                            pos += accumulator
                            return decimalDigitResult
                        }

                        while (pos > endPos!) {
                            yield decressingAlgorithm()
                        }
                        if (!excludeEndPosition) {
                            yield decressingAlgorithm()
                        }
                        // 2.1.1--InGen startPosition >= digitsCount End_____________
                    } else {
                        // 2.1.2--InGen startPosition < digitsCount (If start position less than digits count)
                        if (monotonouslyIncressing) {
                            // 2.1.2--InGen Incressing ( startPosition < digitsCount )
                            let notNullEndPos = endPosition
                            if (endPosition === undefined) {
                                notNullEndPos = digitsCount - 1
                            } else if (endPosition >= digitsCount) {
                                notNullEndPos = digitsCount - 1
                            }

                            let expReducer = 1

                            let lastBaseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(digitsCount - startPosition))
                            let lastNum = numBigInt

                            let notNullStartPos = startPosition
                            if (!excludeStartPosition) {
                                if (startPosition in digitsMap) {
                                    yield digitsMap[startPosition]
                                    expReducer += accumulator
                                } else {
                                    lastBaseExp = JSBI.divide(lastBaseExp, JSBI.exponentiate(baseBigInt, JSBI.BigInt(expReducer)))

                                    const digitBigInt = JSBI.remainder(JSBI.divide(lastNum, lastBaseExp), baseBigInt)
                                    digitsMap[startPosition] = JSBI.toNumber(digitBigInt)
                                    if (currNsNumber._digitsMapLength !== null) {
                                        currNsNumber._digitsMapMax = notNullStartPos
                                        currNsNumber._digitsMapLength++
                                        currNsNumber._mapToArr()
                                    }
                                    yield digitsMap[startPosition]

                                    lastNum = JSBI.remainder(lastNum, lastBaseExp)
                                    expReducer = 1
                                }
                            }
                            notNullStartPos += accumulator

                            let pos = notNullStartPos
                            const incressAlgorithm = () => {
                                let decimalDigitResult: number
                                if (pos in digitsMap) {
                                    decimalDigitResult = digitsMap[pos]
                                    expReducer += accumulator
                                } else {
                                    lastBaseExp = JSBI.divide(lastBaseExp, JSBI.exponentiate(baseBigInt, JSBI.BigInt(expReducer)))

                                    const digitBigInt = JSBI.remainder(JSBI.divide(lastNum, lastBaseExp), baseBigInt)
                                    digitsMap[pos] = JSBI.toNumber(digitBigInt)
                                    if (currNsNumber._digitsMapLength !== null) {
                                        currNsNumber._digitsMapMax = currNsNumber._digitsMapMax! > pos ? currNsNumber._digitsMapMax : pos
                                        currNsNumber._digitsMapLength++
                                        currNsNumber._mapToArr()
                                    }
                                    decimalDigitResult = digitsMap[pos]

                                    lastNum = JSBI.remainder(lastNum, lastBaseExp)
                                    expReducer = 1
                                }
                                pos += accumulator
                                return decimalDigitResult
                            }
                            console.log(pos)
                            console.log('notNullStartPos')
                            console.log(notNullStartPos)
                            console.log('notNullEndPos')
                            console.log(notNullEndPos)
                            while (pos < notNullEndPos!) {
                                yield incressAlgorithm()
                            }
                            
                            if (endPosition === undefined || endPosition === notNullEndPos) {
                                if (!excludeEndPosition) {
                                    yield incressAlgorithm()
                                }
                                return
                            }

                            while (pos < endPosition) {
                                yield null
                                pos += accumulator
                            }
                            return
                            // 2.1.2--InGen Incressing END_____________
                        } else {
                            // 2.1.2--InGen Decressing ( startPosition < digitsCount )
                            let endPos = endPosition
                            if (endPosition === undefined) {
                                endPos = 0
                            }


                            let exp = digitsCount - startPosition
                            let lastNum = numBigInt

                            let startPos = startPosition
                            if (!excludeStartPosition) {
                                if (startPosition in digitsMap) {
                                    yield digitsMap[startPosition]
                                    exp += accumulator
                                } else {
                                    const baseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(exp))

                                    const numberRight = JSBI.remainder(lastNum, baseExp)
                                    const digitBigInt = JSBI.divide(numberRight, JSBI.divide(baseExp, baseBigInt))
                                    digitsMap[startPosition] = JSBI.toNumber(digitBigInt)
                                    if (currNsNumber._digitsMapLength !== null) {
                                        currNsNumber._digitsMapMax = currNsNumber._digitsMapMax! > startPos ? currNsNumber._digitsMapMax : startPos
                                        currNsNumber._digitsMapLength++
                                        currNsNumber._mapToArr()
                                    }
                                    yield digitsMap[startPosition]

                                    lastNum = JSBI.divide(lastNum, baseExp)
                                    exp = 1
                                }
                            }
                            startPos += accumulator

                            let pos = startPos
                            const decressingAlgorithm = () => {
                                let decimalDigitResult: number
                                if (pos in digitsMap) {
                                    decimalDigitResult = digitsMap[pos]
                                    exp += accumulator
                                } else {
                                    const baseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(exp))

                                    const numberRight = JSBI.remainder(lastNum, baseExp)
                                    const digitBigInt = JSBI.divide(numberRight, JSBI.divide(baseExp, baseBigInt))
                                    digitsMap[pos] = JSBI.toNumber(digitBigInt)
                                    decimalDigitResult = digitsMap[pos]
                                    if (currNsNumber._digitsMapLength !== null) {
                                        currNsNumber._digitsMapMax = currNsNumber._digitsMapMax! > pos ? currNsNumber._digitsMapMax : pos
                                        currNsNumber._digitsMapLength++
                                        currNsNumber._mapToArr()
                                    }

                                    lastNum = JSBI.divide(lastNum, baseExp)
                                    exp = 1
                                }
                                pos += accumulator
                                return decimalDigitResult
                            }

                            while (pos > endPos!) {
                                yield decressingAlgorithm()
                            }
                            if (endPosition === undefined || endPosition === endPos) {
                                if (!excludeEndPosition) {
                                    yield decressingAlgorithm()
                                }
                            }
                            return
                            // 2.1.2--InGen Decressing END_____________
                        }
                        // 2.1.2--InGen startPosition >= digitsCount END_____________
                    }
                }
                // ___________GeneratorEnd___________
                // 2.1 digitsCountCalcualted END_____________
            } else {
                // 2.2 digitsCountNotCalcualted, digitsMapExists (If digits count not calculated)
                this.countDigits()
                return this.decDigitsGenerator(optional, false)
                // 2.2 digitsCountNotCalcualted, digitsMapExists END_____________
            }
        }
        // 2. DigitsMapExists END_____________

        if (!this._digitsCount) {
            this.countDigits()
        }

        const digitsCount = this._digitsCount
        const numBigInt = this.bigInt
        // ___________Generator___________
        return function* () {
            const monotonouslyIncressing = accumulator > 0 ? true : false
            if (startPosition >= digitsCount) {
                // 3.1.1--InGen startPosition >= digitsCount (If start position more or equal than digits count)
                let startPos: number, endPos: number

                if (!excludeStartPosition) {
                    yield null
                }
                if (monotonouslyIncressing) {
                    return
                }

                // NOTE: Always decressing below.
                const nullStartPos = startPosition + accumulator
                let nullEndPos = endPosition
                if (endPosition === undefined) {
                    nullEndPos = digitsCount
                } else if (endPosition < digitsCount) {
                    nullEndPos = digitsCount
                }

                let nullPos = nullStartPos
                while (nullPos > nullEndPos!) {
                    yield null
                    nullPos += accumulator
                }

                if (endPosition === nullPos) {
                    if (!excludeEndPosition) {
                        yield null
                    }
                    return
                }

                yield null

                startPos = nullPos + accumulator
                endPos = endPosition !== undefined ? endPosition : 0

                let exp = digitsCount - startPos
                let lastNum = numBigInt

                let pos = startPos
                const decressingAlgorithm = () => {
                    let decimalDigitResult: number
                    const baseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(exp))

                    const numberRight = JSBI.remainder(lastNum, baseExp)
                    const digitBigInt = JSBI.divide(numberRight, JSBI.divide(baseExp, baseBigInt))

                    decimalDigitResult = JSBI.toNumber(digitBigInt)

                    lastNum = JSBI.divide(lastNum, baseExp)
                    exp = 1
                    pos += accumulator
                    return decimalDigitResult
                }

                while (pos > endPos!) {
                    yield decressingAlgorithm()
                }
                if (!excludeEndPosition) {
                    yield decressingAlgorithm()
                }
                // 3.1.1--InGen startPosition >= digitsCount End_____________
            } else {
                // 3.1.2--InGen startPosition < digitsCount (If start position less than digits count)
                if (monotonouslyIncressing) {
                    // 3.1.2--InGen Incressing ( startPosition < digitsCount )
                    let notNullEndPos = endPosition
                    if (endPosition === undefined) {
                        notNullEndPos = digitsCount - 1
                    } else if (endPosition >= digitsCount) {
                        notNullEndPos = digitsCount - 1
                    }

                    let expReducer = 1

                    let lastBaseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(digitsCount - startPosition))
                    let lastNum = numBigInt

                    let notNullStartPos = startPosition
                    if (!excludeStartPosition) {
                        lastBaseExp = JSBI.divide(lastBaseExp, JSBI.exponentiate(baseBigInt, JSBI.BigInt(expReducer)))

                        const digitBigInt = JSBI.remainder(JSBI.divide(lastNum, lastBaseExp), baseBigInt)
                        yield JSBI.toNumber(digitBigInt)

                        lastNum = JSBI.remainder(lastNum, lastBaseExp)
                        expReducer = 1
                    }
                    notNullStartPos += accumulator

                    let pos = notNullStartPos
                    const incressAlgorithm = () => {
                        let decimalDigitResult: number
                        lastBaseExp = JSBI.divide(lastBaseExp, JSBI.exponentiate(baseBigInt, JSBI.BigInt(expReducer)))

                        const digitBigInt = JSBI.remainder(JSBI.divide(lastNum, lastBaseExp), baseBigInt)
                        decimalDigitResult = JSBI.toNumber(digitBigInt)

                        lastNum = JSBI.remainder(lastNum, lastBaseExp)
                        expReducer = 1
                        pos += accumulator
                        return decimalDigitResult
                    }

                    while (pos < notNullEndPos!) {
                        yield incressAlgorithm()
                    }
                    if (endPosition === undefined || endPosition === notNullEndPos) {
                        if (!excludeEndPosition) {
                            yield incressAlgorithm()
                        }
                        return
                    }

                    while (pos < endPosition) {
                        yield null
                        pos += accumulator
                    }
                    return
                    // 3.1.2--InGen Incressing END_____________
                } else {
                    // 3.1.2--InGen Decressing ( startPosition < digitsCount )
                    let endPos = endPosition
                    if (endPosition === undefined) {
                        endPos = 0
                    }


                    let exp = digitsCount - startPosition
                    let lastNum = numBigInt

                    let startPos = startPosition
                    if (!excludeStartPosition) {
                        const baseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(exp))

                        const numberRight = JSBI.remainder(lastNum, baseExp)
                        const digitBigInt = JSBI.divide(numberRight, JSBI.divide(baseExp, baseBigInt))
                        yield JSBI.toNumber(digitBigInt)

                        lastNum = JSBI.divide(lastNum, baseExp)
                        exp = 1
                    }
                    startPos += accumulator

                    let pos = startPos
                    const decressingAlgorithm = () => {
                        let decimalDigitResult: number
                        const baseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(exp))

                        const numberRight = JSBI.remainder(lastNum, baseExp)
                        const digitBigInt = JSBI.divide(numberRight, JSBI.divide(baseExp, baseBigInt))
                        decimalDigitResult = JSBI.toNumber(digitBigInt)

                        lastNum = JSBI.divide(lastNum, baseExp)
                        exp = 1
                        pos += accumulator
                        return decimalDigitResult
                    }

                    while (pos > endPos!) {
                        yield decressingAlgorithm()
                    }
                    if (endPosition === undefined || endPosition === endPos) {
                        if (!excludeEndPosition) {
                            yield decressingAlgorithm()
                        }
                    }
                    return
                    // 3.1.2--InGen Decressing END_____________
                }
                // 3.1.2--InGen startPosition >= digitsCount END_____________
            }
        }
        // ___________GeneratorEnd___________
        // 3.1 digitsCountCalcualted END_____________
    }

    /**
     * Returns string representation of provided number in current _NumberSystem_.
     */
    toString() {
        let iterable: Generator<number | null> | string
        if (this.ns.base === 10) {
            iterable = this.bigInt.toString()
        } else {
            iterable = this.decDigitsGenerator()()
        }

        let numStr = ''
        for (const dig of iterable) {
            numStr += this.ns.digits[dig as number]
        }
        return numStr
    }



    // /**
    //  * Converts _NSNumber_ to another system _NSNumber_
    //  * @param ns - _NumberSystem_ to convert to.
    //  * @param validate - Defines if to validate arguments.
    //  * 
    //  * **Default _false_**
    //  */
    // toSystem(ns: NumberSystem, validate?: boolean) {
    //     const validArgs = validateArguments({ ns, validate }, toSystemSchema)
    //     ns = validArgs.ns

    //     return ns.Number(this, false)
    // }



    // get digitsCount() {
    //     if (!this._digitsCount) {
    //         this._digitsCount = this.ns.countDigits(this, false)
    //     }
    //     return this._digitsCount
    // }



    // get digitsArr() {
    //     const isPerformanceOptimized = this.ns.optimizationMode === 'performanceOptimized'
    //     if (isPerformanceOptimized) {
    //         if (!this._digitsArr) {
    //             const decDigits = NumberSystem.decimalToDecDigitsArr(
    //                 this.bigInt.toString(),
    //                 this.ns.base,
    //                 false
    //             )
    //             this._digitsArr = decDigits
    //             this._digitsMap = null

    //             this._digitsCount = this._digitsArr.length
    //         }
    //         return this._digitsArr
    //     }

    //     const decDigits = NumberSystem.decimalToDecDigitsArr(
    //         this.bigInt.toString(),
    //         this.ns.base,
    //         false
    //     )
    //     this._digitsCount = decDigits.length
    //     return decDigits
    // }
}


import { NumberSystem } from "../NumberSystem"

// validation related imports
import { validateArguments } from "../utils"
import {
    decDigitsGeneratorSchema,
    getDigitSchema,
    NSNumberSchema,
    toSystemSchema,
} from "../validations/NSNumberValidations"
import { NumberSchema } from "../validations/NumberSystemValidations"




// // 2.1.1
// let lastNum = numBigInt
// let expReducer = 1

// let lastBaseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(startPos))

// let pos = startPos
// while (pos > endPos) {
//     if (pos in digitsMap) {
//         yield digitsMap[pos]
//         expReducer++
//     } else {
//         lastBaseExp = JSBI.divide(lastBaseExp, JSBI.exponentiate(baseBigInt, JSBI.BigInt(expReducer)))

//         const digitBigInt = JSBI.remainder(JSBI.divide(lastNum, lastBaseExp), baseBigInt)
//         digitsMap[pos] = JSBI.toNumber(digitBigInt)
//         yield digitsMap[pos]

//         lastNum = JSBI.remainder(lastNum, lastBaseExp)
//         expReducer = 1
//     }
//     pos += accumulator
// }

// if (!excludeEndPosition) {
//     if (pos in digitsMap) {
//         yield digitsMap[pos]
//         expReducer++
//     } else {
//         lastBaseExp = JSBI.divide(lastBaseExp, JSBI.exponentiate(baseBigInt, JSBI.BigInt(expReducer)))

//         const digitBigInt = JSBI.remainder(JSBI.divide(lastNum, lastBaseExp), baseBigInt)
//         digitsMap[pos] = JSBI.toNumber(digitBigInt)
//         yield digitsMap[pos]

//         lastNum = JSBI.remainder(lastNum, lastBaseExp)
//         expReducer = 1
//     }
//     pos += accumulator
// }
// return