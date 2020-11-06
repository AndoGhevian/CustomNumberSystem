import JSBI from "jsbi"
import {
    RequireExceptFields,
    SystemDigitsConfig
} from "../commonTypes"


/**
 * Represents numbers in given _NumberSystem_ - _ns_.
 */
export class NSNumber<T extends string[] | SystemDigitsConfig> {
    /**
     * _NumberSystem_ instance in which represented current number.
     */
    readonly ns: NumberSystem<T> = null as any
    /**
     * _JSBI_ instance of current number. ( **_See NPM JSBI_** )
     * 
     * **NOTE: Consider to use this in critical cases,
     * when you cannot achieve the desired result
     * with this package.**
     */
    readonly bigInt: JSBI = null as any

    /**
     * Already calculated digits count.
     */
    protected _digitsCount: number = null as any

    /**
     * This will be immediately set to digits _powers_ array
     * when all digits of number in current _NumberSystem_
     * are calculated.
     * 
     * Initially set to _null_.
     */
    protected _digitsArr: number[] | null = null
    /**
     * Contains already calculated digits _powers_, maped to
     * their positions.
     * 
     * When all digits are calculated,
     * this will be immediately set to _null_.
     */
    protected _digitsMap: { [key: number]: number } | null = {}
    /**
     * Maximum power of calculated digits.
     * 
     * Initially set to _1_.
     * 
     * When all digits are calculated,
     * this will be immediately set to _null_.
     */
    protected _digitsMapMax: number | null = 1
    /**
     * Calculated digits count placed in
     * digits map.
     * 
     * When all digits are calculated,
     * this will be immediately set to _null_.
     */
    protected _digitsMapLength: number | null = 0

    /**
     * @param ns - _NumberSystem_ instance in which number and its digits will be represented.
     * @param number - Decimal number, string( representation of decimal number ),
     * _NSNumber_ instance, or array of digit powers, in provided as argument _NumberSystem_ - _ns_.
     * 
     * **Default -**
     * - **If empty array provided  - _[0]_**
     * - **If nothing(_undefined_) -  _0_**
     * 
     * @param validate - Defines if to validate arguments.
     * 
     * **Default _false_**
     */
    constructor(ns: NumberSystem<T>, number?: number, validate?: boolean)
    constructor(ns: NumberSystem<T>, numberStr?: string, validate?: boolean)
    constructor(ns: NumberSystem<T>, nsNumber: NSNumber<any>, validate?: boolean)
    constructor(ns: NumberSystem<T>, decimalDigArray?: number[], validate?: boolean)
    constructor(ns: NumberSystem<T>, number?: any, validate?: boolean) {
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
                    const numStr = NumberSystem.powersArrToDecimal(number, this.ns.base, false)

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
     * Compares two _NsNumbers_. Returnes true if _nsNumber1_ < _nsNumber2_.
     * 
     * @param nsNumber1 - NSNumber.
     * @param nsNumber2 - NSNumber.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    static lessThan(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, compareOpSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        return JSBI.lessThan(nsNumber1.bigInt, nsNumber2.bigInt)
    }

    /**
     * Compares two _NsNumbers_. Returnes true if _nsNumber1_ <= _nsNumber2_.
     * 
     * @param nsNumber1 - NSNumber.
     * @param nsNumber2 - NSNumber.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    static lessThanOrEqual(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, compareOpSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        return JSBI.lessThanOrEqual(nsNumber1.bigInt, nsNumber2.bigInt)
    }

    /**
     * Compares two _NsNumbers_. Returnes true if _nsNumber1_ == _nsNumber2_.
     * 
     * @param nsNumber1 - NSNumber.
     * @param nsNumber2 - NSNumber.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    static equal(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, compareOpSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        return JSBI.equal(nsNumber1.bigInt, nsNumber2.bigInt)
    }

    /**
     * Returns power of digit at give position of current number, or _null_ if not existing digit position provided.
     * @param position - Index of digit to return power for.
     * 
     * **MUST** be integer.
     * 
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    getPower(position: number, validate?: boolean) {
        const validArgs = validateArguments({ position, validate }, getPowerSchema)
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
     * Count digits of number in current _NumberSystem_.
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
    }

    /**
     * digitPowersGenerator Helper function.
     */
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

    /**
     * Generates digit powers of current number in current _NumberSystem_
     * starting from _startPosition_ and ending in _endPosition_
     * ( See **README** for more detatils ), using _accumulator_
     * value as _step_ of generation.
     * @param optional - Optional configurations for generator.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    digitPowersGenerator(optional?: {
        /**
         * Digit position to start generating powers from.
         * 
         * **MUST** be nonnegative integer.
         * 
         * NOTE: If _startPosition_ out of digits posions range
         * and it is monotonously increasing generator, i.e. accumulator > 0,
         * then after considering _startPosition_, generator will immediately stop.
         * 
         * **Default _0_**
         */
        startPosition?: number,
        /**
         * Digit position to finish generate powers on.
         * 
         * If provided, **MUST** be nonnegative integer.
         * 
         * **Default _undefined_ - It Means Generator will continue monotonously
         * generate powers until last reachable _edge position_ reached(0 or _Last Digit Position_).**
         */
        endPosition?: number,
        /**
         * Accumulator given in number.
         * 
         * **MUST** be nonzero integer.
         * 
         * **Default - _1_**
         */
        accumulator?: number,
        /**
         * Defines if to exclude _startPosition_ when start generating powers.
         * 
         * **Default - _false_**
         */
        excludeStartPosition?: boolean,
        /**
         * Defines if to exclude digit on _endPosition_ if reached.
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
            digitPowersGeneratorSchema,
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
                    endPos = monotonouslyIncressing ? digitsArr.length - 1 : 0
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

                if (pos === endPos) {
                    if (!excludeEndPosition) {
                        yield pos < digitsArr.length ? digitsArr[pos] : null
                    }
                }

                // if (endPosition !== undefined) {
                //     while (pos < endPosition) {
                //         yield null
                //         pos += accumulator
                //     }

                //     if (pos === endPosition && !excludeEndPosition) {
                //         yield null
                //     }
                // }
            }
            // ___________GeneratorEnd___________
        }
        //1. DigitsArrayExists End______________

        const currNsNumber = this

        // 2. DigitsMapExists (If performance optimized and digits map exists)
        //__________________________________________________
        if (this._digitsMap) {
            const numBigInt = this.bigInt
            if (this._digitsCount) {
                // 2.1 digitsCountCalcualted (If digits count calculated)
                const digitsMap = this._digitsMap
                const digitsCount = this._digitsCount
                // ___________Generator___________
                return function* () {
                    if (currNsNumber._digitsArr) {
                        return currNsNumber.digitPowersGenerator(optional, false)()
                    }
                    const monotonouslyIncressing = accumulator > 0 ? true : false
                    if (startPosition >= digitsCount) {
                        // 2.1.1--InGen startPosition >= digitsCount (If start position more or equal than digits count)
                        // CHECKED____________________________________________CHECKED
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


                        if (nullPos === nullEndPos) {
                            if (nullEndPos === endPosition) {
                                if (!excludeEndPosition) {
                                    yield null
                                }
                                return
                            }
                            yield null
                            nullPos += accumulator
                        }

                        startPos = nullPos
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
                                exp += Math.abs(accumulator)
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
                                exp = Math.abs(accumulator)
                            }
                            pos += accumulator
                            return decimalDigitResult
                        }

                        while (pos > endPos!) {
                            yield decressingAlgorithm()
                        }
                        if (!excludeEndPosition && pos === endPos) {
                            yield decressingAlgorithm()
                        }
                        // CHECKED____________________________________________CHECKED
                        // 2.1.1--InGen startPosition >= digitsCount End_____________
                    } else {
                        // 2.1.2--InGen startPosition < digitsCount (If start position less than digits count)
                        if (monotonouslyIncressing) {
                            // 2.1.2--InGen Incressing ( startPosition < digitsCount )
                            // CHECKED____________________________________________CHECKED
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
                            let start: number
                            if (startPosition in digitsMap) {
                                start = digitsMap[startPosition]
                                expReducer += Math.abs(accumulator)
                            } else {
                                lastBaseExp = JSBI.divide(lastBaseExp, JSBI.exponentiate(baseBigInt, JSBI.BigInt(expReducer)))

                                const digitBigInt = JSBI.remainder(JSBI.divide(lastNum, lastBaseExp), baseBigInt)
                                digitsMap[startPosition] = JSBI.toNumber(digitBigInt)
                                if (currNsNumber._digitsMapLength !== null) {
                                    currNsNumber._digitsMapMax = notNullStartPos
                                    currNsNumber._digitsMapLength++
                                    currNsNumber._mapToArr()
                                }
                                start = digitsMap[startPosition]

                                lastNum = JSBI.remainder(lastNum, lastBaseExp)
                                expReducer = Math.abs(accumulator)
                            }
                            notNullStartPos += accumulator

                            if (!excludeStartPosition) {
                                yield start
                            }


                            let pos = notNullStartPos
                            const incressAlgorithm = () => {
                                let decimalDigitResult: number
                                if (pos in digitsMap) {
                                    decimalDigitResult = digitsMap[pos]
                                    expReducer += Math.abs(accumulator)
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
                                    expReducer = Math.abs(accumulator)
                                }
                                pos += accumulator
                                return decimalDigitResult
                            }

                            while (pos < notNullEndPos!) {
                                yield incressAlgorithm()
                            }


                            if (pos === notNullEndPos) {
                                if (endPosition === undefined || notNullEndPos === endPosition) {
                                    if (!excludeEndPosition) {
                                        yield incressAlgorithm()
                                    }
                                    return
                                }
                                yield incressAlgorithm()
                                pos += accumulator
                            }


                            if (endPosition !== undefined) {
                                while (pos < endPosition) {
                                    yield null
                                    pos += accumulator
                                }

                                if (pos === endPosition && !excludeEndPosition) {
                                    yield null
                                }
                            }
                            // CHECKED____________________________________________CHECKED
                            // 2.1.2--InGen Incressing END_____________
                        } else {
                            // 2.1.2--InGen Decressing ( startPosition < digitsCount )
                            // CHECKED____________________________________________CHECKED
                            let endPos = endPosition
                            if (endPosition === undefined) {
                                endPos = 0
                            }

                            let exp = digitsCount - startPosition
                            let lastNum = numBigInt

                            let startPos = startPosition

                            let start: number
                            if (startPosition in digitsMap) {
                                start = digitsMap[startPosition]
                                exp += Math.abs(accumulator)
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
                                start = digitsMap[startPosition]

                                lastNum = JSBI.divide(lastNum, baseExp)
                                exp = Math.abs(accumulator)
                            }
                            startPos += accumulator

                            if (!excludeStartPosition) {
                                yield start
                            }

                            let pos = startPos
                            const decressingAlgorithm = () => {
                                let decimalDigitResult: number
                                if (pos in digitsMap) {
                                    decimalDigitResult = digitsMap[pos]
                                    exp += Math.abs(accumulator)
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
                                    exp = Math.abs(accumulator)
                                }
                                pos += accumulator
                                return decimalDigitResult
                            }

                            while (pos > endPos!) {
                                yield decressingAlgorithm()
                            }

                            if (!excludeEndPosition && pos === endPos) {
                                yield decressingAlgorithm()
                            }
                            return
                            // CHECKED____________________________________________CHECKED
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
                return this.digitPowersGenerator(optional, false)
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


                if (nullPos === nullEndPos) {
                    if (nullEndPos === endPosition) {
                        if (!excludeEndPosition) {
                            yield null
                        }
                        return
                    }
                    yield null
                    nullPos += accumulator
                }

                startPos = nullPos
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
                    exp = Math.abs(accumulator)
                    pos += accumulator
                    return decimalDigitResult
                }

                while (pos > endPos!) {
                    yield decressingAlgorithm()
                }
                if (!excludeEndPosition && pos === endPos) {
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
                    let start: number
                    lastBaseExp = JSBI.divide(lastBaseExp, JSBI.exponentiate(baseBigInt, JSBI.BigInt(expReducer)))

                    const digitBigInt = JSBI.remainder(JSBI.divide(lastNum, lastBaseExp), baseBigInt)
                    start = JSBI.toNumber(digitBigInt)

                    lastNum = JSBI.remainder(lastNum, lastBaseExp)
                    expReducer = Math.abs(accumulator)
                    notNullStartPos += accumulator

                    if (!excludeStartPosition) {
                        yield start
                    }


                    let pos = notNullStartPos
                    const incressAlgorithm = () => {
                        let decimalDigitResult: number
                        lastBaseExp = JSBI.divide(lastBaseExp, JSBI.exponentiate(baseBigInt, JSBI.BigInt(expReducer)))

                        const digitBigInt = JSBI.remainder(JSBI.divide(lastNum, lastBaseExp), baseBigInt)
                        decimalDigitResult = JSBI.toNumber(digitBigInt)

                        lastNum = JSBI.remainder(lastNum, lastBaseExp)
                        expReducer = Math.abs(accumulator)
                        pos += accumulator
                        return decimalDigitResult
                    }

                    while (pos < notNullEndPos!) {
                        yield incressAlgorithm()
                    }


                    if (pos === notNullEndPos) {
                        if (endPosition === undefined || notNullEndPos === endPosition) {
                            if (!excludeEndPosition) {
                                yield incressAlgorithm()
                            }
                            return
                        }
                        yield incressAlgorithm()
                        pos += accumulator
                    }


                    if (endPosition !== undefined) {
                        while (pos < endPosition) {
                            yield null
                            pos += accumulator
                        }

                        if (pos === endPosition && !excludeEndPosition) {
                            yield null
                        }
                    }
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

                    let start: number
                    const baseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(exp))

                    const numberRight = JSBI.remainder(lastNum, baseExp)
                    const digitBigInt = JSBI.divide(numberRight, JSBI.divide(baseExp, baseBigInt))
                    start = JSBI.toNumber(digitBigInt)

                    lastNum = JSBI.divide(lastNum, baseExp)
                    exp = Math.abs(accumulator)
                    startPos += accumulator

                    if (!excludeStartPosition) {
                        yield start
                    }

                    let pos = startPos
                    const decressingAlgorithm = () => {
                        let decimalDigitResult: number
                        const baseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(exp))

                        const numberRight = JSBI.remainder(lastNum, baseExp)
                        const digitBigInt = JSBI.divide(numberRight, JSBI.divide(baseExp, baseBigInt))
                        decimalDigitResult = JSBI.toNumber(digitBigInt)

                        lastNum = JSBI.divide(lastNum, baseExp)
                        exp = Math.abs(accumulator)
                        pos += accumulator
                        return decimalDigitResult
                    }

                    while (pos > endPos!) {
                        yield decressingAlgorithm()
                    }
                    if (!excludeEndPosition && pos === endPos) {
                        yield decressingAlgorithm()
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
     * Returns string representation of number in current _NumberSystem_.
     */
    toString() {
        let iterable: Generator<number | null> | string
        if (this.ns.base === 10) {
            iterable = this.bigInt.toString()
            this._digitsCount = iterable.length
        } else {
            iterable = this.digitPowersGenerator()()
        }

        let numStr = ''
        if (typeof this.ns.digits === 'function') {
            const digGen = this.ns.digits as (...powers: number[]) => (string | undefined)[]
            for (const dig of iterable) {
                const charMassive = digGen.call(this, dig as number)
                numStr += charMassive[0]
            }
            return numStr
        } else {
            const digCharArr = this.ns.digits as string[]
            for (const dig of iterable) {
                numStr += digCharArr[dig as number]
            }
            return numStr
        }
    }

    /**
     * Adds two _NSNumber_ instances in current _NumberSystem_.
     * 
     * Result will be represented in current _NumberSystem_.
     * @param nsNumber - _NSNumber_ to add.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    add(nsNumber: NSNumber<any>, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber, validate }, opSchema)
        nsNumber = validArgs.nsNumber

        const sys = this.ns
        const sum = JSBI.add(this.bigInt, nsNumber.bigInt)

        return sys.Number(sum.toString(), false)
    }

    /**
     * Subtract two _NSNumber_ instances in current _NumberSystem_.
     * 
     * Result will be represented in current _NumberSystem_.
     * 
     * **NOTE: If result less than zero, _null_ will be returned.**
     * @param nsNumber - reducer number.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    subtract(nsNumber: NSNumber<any>, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber, validate }, opSchema)
        nsNumber = validArgs.nsNumber

        const sys = this.ns
        const subtraction = JSBI.subtract(this.bigInt, nsNumber.bigInt)
        if (JSBI.lessThan(subtraction, NumberSystem['ZERO_BIG_INT'])) {
            return null
        }
        return sys.Number(subtraction.toString(), false)
    }

    /**
     * Calculates current number _modulo nsNumber2_  in current _NumberSystem_.
     * 
     * Result will be represented in current _NumberSystem_.
     * @param nsNumber - divider number.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    remainder(nsNumber: NSNumber<any>, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber, validate }, opSchema)
        nsNumber = validArgs.nsNumber

        const sys = this.ns
        const remainder = JSBI.remainder(this.bigInt, nsNumber.bigInt)

        return sys.Number(remainder.toString(), false)
    }

    /**
     * Multiply current number by _nsNumber_ in current _NumberSystem_.
     * 
     * Result will be represented in current _NumberSystem_.
     * @param nsNumber - multipler number.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    multiply(nsNumber: NSNumber<any>, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber, validate }, opSchema)
        nsNumber = validArgs.nsNumber

        const sys = this.ns
        const multiply = JSBI.multiply(this.bigInt, nsNumber.bigInt)

        return sys.Number(multiply.toString(), false)
    }

    /**
     * Divide current number by _nsNumber_ in current _NumberSystem_.
     * _NSNumber_ of integer part of division will be returned.
     * 
     * Result will be represented in current _NumberSystem_.
     * @param nsNumber - Divider _NSNumber_.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    divide(nsNumber: NSNumber<any>, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber, validate }, opSchema)
        nsNumber = validArgs.nsNumber

        const sys = this.ns
        const division = JSBI.divide(this.bigInt, nsNumber.bigInt)

        return sys.Number(division.toString(), false)
    }

    /**
     * Converts current number to given _NumberSystem_ - _ns_.
     * 
     * Result will be represented in provided _NumberSystem_ - _ns_.
     * @param ns - _NumberSystem_ instance to convert to.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    toSystem(ns: NumberSystem<T>, validate?: boolean): NSNumber<T> {
        const validArgs = validateArguments({ ns, validate }, toSystemSchema)
        ns = validArgs.ns

        return ns.Number(this, false)
    }
}


import { NumberSystem } from "../NumberSystem"

// validation related imports
import { validateArguments } from "../utils"
import {
    compareOpSchema,
    digitPowersGeneratorSchema,
    getPowerSchema,
    NSNumberSchema,
    opSchema,
    toSystemSchema,
} from "../validations/NSNumber"