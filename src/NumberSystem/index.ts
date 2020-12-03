import JSBI from "jsbi"
import {
    isDigitsConfig,
    powersArrToDecimal,
} from "../utils"

import {
    IDigitsConfig,
} from "../commonTypes"


export function isNsNumber(obj: any): obj is NSNumberInstance<NumberSystemInstance<IDigitsConfig | string[]>> {
    if (obj instanceof Object
        && Object.getPrototypeOf(obj).constructor
        && Object.getPrototypeOf(Object.getPrototypeOf(obj).constructor) === NumberSystem.prototype) {
        return true
    }
    return false
}

export interface NSNumberInstance<S extends NumberSystemInstance<any>> {
    readonly system: S
    readonly digitsCount: number
    digPowGenerator(start: number, end: number, step?: number): Generator<number | undefined>
    getPower(position: number): number

    add(nsNumber: NSNumberInstance<any>): NSNumberInstance<S>
    subtract(nsNumber: NSNumberInstance<any>): NSNumberInstance<S> | undefined
    remainder(nsNumber: NSNumberInstance<any>): NSNumberInstance<S>
    multiply(nsNumber: NSNumberInstance<any>): NSNumberInstance<S>
    divide(nsNumber: NSNumberInstance<any>): NSNumberInstance<S>

    toString(): string
    toSystem<T extends IDigitsConfig | string[]>(sys: NumberSystemInstance<T>): NSNumberInstance<NumberSystemInstance<T>>
}
export interface NSNumberPrivate<S extends NumberSystemInstance<any>> extends NSNumberInstance<S> {
    system: S
    bigInt: JSBI
    _digitsCount: number
    _digitsArr: number[] | undefined
    _digitsMap: { [key: number]: number } | undefined
    _digitsMapLength: number | undefined

    mapToArr(): void
}


export interface NumberSystemInstance<T extends IDigitsConfig | string[]> {
    readonly digits: T
    readonly base: number

    nsNumberGenerator(start: NSNumberInstance<any>, end: NSNumberInstance<any>, step?: NSNumberInstance<any>): NSNumberInstance<NumberSystemInstance<T>>
    maxInRank(rank: number): NSNumberInstance<NumberSystemInstance<T>>
    minInRank(rank: number): NSNumberInstance<NumberSystemInstance<T>>

    (number: number): NSNumberInstance<NumberSystemInstance<T>>
    (number: string): NSNumberInstance<NumberSystemInstance<T>>
    (number: number[]): NSNumberInstance<NumberSystemInstance<T>>
    new(number: number): NSNumberInstance<NumberSystemInstance<T>>
    new(number: string): NSNumberInstance<NumberSystemInstance<T>>
    new(number: number[]): NSNumberInstance<NumberSystemInstance<T>>
}
export interface NumberSystemPrivate<T extends IDigitsConfig | string[]> extends NumberSystemInstance<T> {
    digits: T
    base: number
    baseBigInt: JSBI

    _maxInRankMap: { [key: number]: NSNumberInstance<NumberSystemInstance<T>> }
    _minInRankMap: { [key: number]: NSNumberInstance<NumberSystemInstance<T>> }
}


export interface NumberSystemConstructor {
    lt(nsNumber1: NSNumberInstance<any>, nsNumber2: NSNumberInstance<any>): boolean
    le(nsNumber1: NSNumberInstance<any>, nsNumber2: NSNumberInstance<any>): boolean
    gt(nsNumber1: NSNumberInstance<any>, nsNumber2: NSNumberInstance<any>): boolean
    ge(nsNumber1: NSNumberInstance<any>, nsNumber2: NSNumberInstance<any>): boolean
    ne(nsNumber1: NSNumberInstance<any>, nsNumber2: NSNumberInstance<any>): boolean
    e(nsNumber1: NSNumberInstance<any>, nsNumber2: NSNumberInstance<any>): boolean

    new <T extends IDigitsConfig | string[]>(digits: T): NumberSystemInstance<T>
}
export interface NumberSystemConstructorPrivate extends NumberSystemConstructor { }



const NumberSystem: NumberSystemConstructor = (function (): NumberSystemConstructor {
    const NumberSystem: NumberSystemConstructorPrivate = function <T extends IDigitsConfig | string[]>(this: NumberSystemPrivate<T>, digits: T) {
        if (!new.target) return new (NumberSystem as any)(digits)

        const NumberSystemInstance: NumberSystemPrivate<T> = (function (): NumberSystemPrivate<T> {
            const NumberSystemInstance: NumberSystemPrivate<T> = function (this: NSNumberPrivate<NumberSystemPrivate<T>>, number: number | string | number[]) {
                if (!new.target) return new (NumberSystemInstance as any)(number)
                this.system = NumberSystemInstance
                this._digitsArr = undefined
                this._digitsMap = {}
                this._digitsMapLength = 0
                switch (typeof number) {
                    case 'number':
                    case 'string':
                        this.bigInt = JSBI.BigInt(number)
                        break
                    case 'object':
                    default:
                        if (!(number instanceof Array)) {
                            number = [0]
                        }
                        const numStr = powersArrToDecimal(number, this.system.base)

                        this.bigInt = JSBI.BigInt(numStr)
                        this._digitsCount = number.length
                        this._digitsArr = [...number]

                        this._digitsMap = undefined
                        this._digitsMapLength = undefined
                        break
                }
            } as any

            Object.defineProperties(NumberSystemInstance.prototype, {
                mapToArr: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>,) {
                        if (this._digitsMapLength === this._digitsCount) {
                            const digitsMap = this._digitsMap!
                            this._digitsMap = undefined
                            this._digitsMapLength = undefined

                            this._digitsArr = []
                            for (let key in digitsMap) {
                                this._digitsArr.push(digitsMap[key as any])
                            }
                        }
                    }
                },
                digPowGenerator: {
                    value: function* (this: NSNumberPrivate<NumberSystemPrivate<T>>, start: number, end: number, step?: number) {
                        if (start < 0) start = 0
                        if (end < 0) end = 0
                        if (!step || step < 0) step = 1

                        const digitsCount = this.digitsCount
                        if (start >= digitsCount) start = digitsCount - 1
                        if (end >= digitsCount) end = digitsCount - 1

                        if (this._digitsArr) {
                            const digitsArr = this._digitsArr
                            let pos = start
                            if (start <= end) {
                                while (pos <= end) {
                                    yield digitsArr[pos]
                                    pos += step
                                }
                            } else {
                                while (pos >= end) {
                                    yield digitsArr[pos]
                                    pos -= step
                                }
                            }
                        } else {
                            const digitsMap = this._digitsMap!
                            const baseBigInt = this.system.baseBigInt
                            const numBigInt = this.bigInt

                            if (start <= end) {
                                let expReducer = 1
                                let lastBaseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(digitsCount - start))

                                let lastNum = numBigInt
                                let pos = start
                                while (pos <= end) {
                                    let yieldRes!: number
                                    if (pos in digitsMap) {
                                        expReducer += step
                                        yieldRes = digitsMap[pos]
                                    } else {
                                        lastBaseExp = JSBI.divide(lastBaseExp, JSBI.exponentiate(baseBigInt, JSBI.BigInt(expReducer)))

                                        const digitBigInt = JSBI.remainder(JSBI.divide(lastNum, lastBaseExp), baseBigInt)
                                        digitsMap[pos] = JSBI.toNumber(digitBigInt)
                                        if (this._digitsMapLength !== undefined) {
                                            this._digitsMapLength++
                                            this.mapToArr()
                                        }
                                        yieldRes = digitsMap[pos]

                                        lastNum = JSBI.remainder(lastNum, lastBaseExp)
                                        expReducer = step
                                    }
                                    pos += step
                                    yield yieldRes
                                }
                            } else {
                                let exp = digitsCount - start

                                let lastNum = numBigInt
                                let pos = start
                                while (pos >= end) {
                                    let yieldRes!: number
                                    if (pos in digitsMap) {
                                        exp += step
                                        yieldRes = digitsMap[pos]
                                    } else {
                                        const baseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(exp))

                                        const numberRight = JSBI.remainder(lastNum, baseExp)
                                        const digitBigInt = JSBI.divide(numberRight, JSBI.divide(baseExp, baseBigInt))
                                        digitsMap[pos] = JSBI.toNumber(digitBigInt)
                                        if (this._digitsMapLength !== undefined) {
                                            this._digitsMapLength++
                                            this.mapToArr()
                                        }
                                        yieldRes = digitsMap[pos]

                                        lastNum = JSBI.divide(lastNum, baseExp)
                                        exp = step
                                    }
                                    pos -= step
                                    yield yieldRes
                                }
                            }
                        }
                    }
                },
                getPower: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, position: number) {
                        if (position < 0) {
                            return undefined
                        }

                        if (this._digitsArr) {
                            return this._digitsArr.length > position
                                ? this._digitsArr[position]
                                : undefined
                        }
                        if (position in this._digitsMap!) {
                            return this._digitsMap![position]
                        }

                        const digitsCount = this.digitsCount
                        if (position >= digitsCount) {
                            return undefined
                        }

                        const base = this.system.baseBigInt
                        const baseExp = JSBI.exponentiate(base, JSBI.BigInt(digitsCount - position))
                        const numRight = JSBI.remainder(this.bigInt, baseExp)

                        const digit = JSBI.toNumber(JSBI.divide(numRight, JSBI.divide(baseExp, base)))
                        this._digitsMap![position] = digit
                        this._digitsMapLength!++

                        return digit
                    }
                },
                digitsCount: {
                    get: function (this: NSNumberPrivate<NumberSystemPrivate<T>>) {
                        if (!this._digitsCount) {
                            const base = this.system.baseBigInt

                            let divideNumber = JSBI.divide(this.bigInt, base)
                            let digitsCount = 1
                            while (!JSBI.equal(divideNumber, JSBI.BigInt(0))) {
                                digitsCount++
                                divideNumber = JSBI.divide(divideNumber, base)
                            }
                            this._digitsCount = digitsCount
                        }
                        return this._digitsCount
                    },
                    set: () => { },
                    enumerable: true
                },
                add: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, nsNumber: NSNumberPrivate<any>) {
                        const sys = this.system
                        const resultBigInt = JSBI.add(this.bigInt, nsNumber.bigInt)

                        return new sys(resultBigInt.toString())
                    }
                },
                subtract: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, nsNumber: NSNumberPrivate<any>) {
                        const sys = this.system
                        const resultBigInt = JSBI.remainder(this.bigInt, nsNumber.bigInt)

                        if (JSBI.lessThan(resultBigInt, JSBI.BigInt(0))) {
                            return undefined
                        }
                        return new sys(resultBigInt.toString())
                    }
                },
                remainder: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, nsNumber: NSNumberPrivate<any>) {
                        const sys = this.system
                        const resultBigInt = JSBI.remainder(this.bigInt, nsNumber.bigInt)

                        return new sys(resultBigInt.toString())
                    }
                },
                multiply: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, nsNumber: NSNumberPrivate<any>) {
                        const sys = this.system
                        const resultBigInt = JSBI.multiply(this.bigInt, nsNumber.bigInt)

                        return new sys(resultBigInt.toString())
                    }
                },
                divide: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, nsNumber: NSNumberPrivate<any>) {
                        const sys = this.system
                        const resultBigInt = JSBI.divide(this.bigInt, nsNumber.bigInt)

                        return new sys(resultBigInt.toString())
                    }
                },
                toString: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>) {
                        const powGen = this.digPowGenerator(0, this.digitsCount)

                        let numStr = ''
                        if (isDigitsConfig(this.system.digits)) {
                            for (const pow of powGen) {
                                const charMassive = this.system.digits.digGen(pow!)
                                numStr += charMassive[0]
                            }
                            return numStr
                        } else {
                            const digCharArr = this.system.digits as string[]
                            for (const pow of powGen) {
                                numStr += digCharArr[pow!]
                            }
                            return numStr
                        }
                    }
                },
                toSystem: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, system: NumberSystemPrivate<any>) {
                        return system(this.bigInt.toString())
                    }
                },
            })
            return NumberSystemInstance
        })()
        Object.setPrototypeOf(NumberSystemInstance, NumberSystem.prototype)


        if (isDigitsConfig(digits)) {
            NumberSystemInstance.digits = digits
            NumberSystemInstance.base = digits.base
        } else {
            const digitsArr = digits as string[]
            NumberSystemInstance.digits = digitsArr as any
            NumberSystemInstance.base = digitsArr.length
        }
        NumberSystemInstance.baseBigInt = JSBI.BigInt(NumberSystemInstance.base)

        NumberSystemInstance._maxInRankMap = {}
        NumberSystemInstance._minInRankMap = {}


        return NumberSystemInstance
    } as any

    Object.defineProperties(NumberSystem.prototype, {
        nsNumberGenerator: {
            value: function* (this: NumberSystemPrivate<any>, start: NSNumberPrivate<any>, end: NSNumberPrivate<any>, step?: NSNumberPrivate<any>) {
                if (!isNsNumber(step)) {
                    step = new this(1) as NSNumberPrivate<any>
                }

                let sumBigInt = start.bigInt
                if (NumberSystem.le(start, end)) {
                    while (JSBI.greaterThanOrEqual(end.bigInt, sumBigInt)) {
                        yield new this(sumBigInt.toString())

                        sumBigInt = JSBI.add(sumBigInt, step.bigInt)
                    }
                } else {
                    while (JSBI.greaterThanOrEqual(sumBigInt, end.bigInt)) {
                        yield new this(sumBigInt.toString())

                        sumBigInt = JSBI.subtract(sumBigInt, step.bigInt)
                    }
                }
            }
        },
        maxInRank: {
            value: function (this: NumberSystemPrivate<any>, rank: number) {
                if (rank <= 0) {
                    return undefined
                }
                if (!(rank in this._maxInRankMap)) {
                    const powArr: number[] = []
                    const maxPow = this.base - 1
                    for (let i = 0; i < rank; i++) {
                        powArr[i] = maxPow
                    }
                    const nsNumber = new this(powArr)
                    this._maxInRankMap[rank] = nsNumber
                }
                return this._maxInRankMap[rank]
            }
        },
        minInRank: {
            value: function (this: NumberSystemPrivate<any>, rank: number) {
                if (rank <= 0) {
                    return undefined
                }
                if (!(rank in this._minInRankMap)) {
                    const powArr: number[] = [1]
                    if (rank > 1) {
                        for (let i = 1; i < rank; i++) {
                            powArr[i] = 0
                        }
                    } else {
                        powArr[0] = 0
                    }
                    const nsNumber = new this(powArr)
                    this._minInRankMap[rank] = nsNumber
                }
                return this._minInRankMap[rank]
            }
        },
    })

    Object.defineProperties(NumberSystem, {
        lt: {
            value: (nsNumber1: NSNumberPrivate<any>, nsNumber2: NSNumberPrivate<any>) => {
                return JSBI.lessThan(nsNumber1.bigInt, nsNumber2.bigInt)
            }
        },
        le: {
            value: (nsNumber1: NSNumberPrivate<any>, nsNumber2: NSNumberPrivate<any>) => {
                return JSBI.lessThanOrEqual(nsNumber1.bigInt, nsNumber2.bigInt)
            }
        },
        gt: {
            value: (nsNumber1: NSNumberPrivate<any>, nsNumber2: NSNumberPrivate<any>) => {
                return JSBI.greaterThan(nsNumber1.bigInt, nsNumber2.bigInt)
            }
        },
        ge: {
            value: (nsNumber1: NSNumberPrivate<any>, nsNumber2: NSNumberPrivate<any>) => {
                return JSBI.greaterThanOrEqual(nsNumber1.bigInt, nsNumber2.bigInt)
            }
        },
        ne: {
            value: (nsNumber1: NSNumberPrivate<any>, nsNumber2: NSNumberPrivate<any>) => {
                return JSBI.equal(nsNumber1.bigInt, nsNumber2.bigInt)
            }
        },
        e: {
            value: (nsNumber1: NSNumberPrivate<any>, nsNumber2: NSNumberPrivate<any>) => {
                return JSBI.notEqual(nsNumber1.bigInt, nsNumber2.bigInt)
            }
        },
    })

    return NumberSystem
})()

export default NumberSystem








// /**
//  * Represents new _NumberSystem_ corresponding to provided digits array,
//  * or IDigitsConfig.
//  */
// export class NumberSystemaaaaaaa<T extends string[] | IDigitsConfig> {
//     /**
//      * Digits array of current _NumberSystem_, or function
//      * which returns corresponding digit for given digit _power_.
//      */
//     readonly digits: T extends IDigitsConfig ? T['digGen'] : string[]

//     /**
//      * Defines if _digits_ is a function which supports
//      * multiple _power_ arguments. 
//      * 
//      * For Detailed description
//      * of this property See - **IDigitsConfig**
//      * 
//      * NOTE: If _dinamicAritySystem_ is false,
//      * It does not necessary mean that _digits_ is not a function. 
//      */
//     readonly dinamicAritySystem: boolean

//     /**
//      * Base of current _NumberSystem_.
//      */
//     readonly base: number
//     /**
//      * Defines if to memoize already calculated digit _powers_
//      * for numbers in current _NumberSystem_.
//      * 
//      * **Default - _"performanceOptimized"_, i.e. memoize.**
//      */
//     readonly optimizationMode: OptimizaionMode

//     /**
//      * _JSBI_ instance of current _NumberSystem_ base.
//      */
//     protected readonly baseBigInt: JSBI

//     /**
//     * _JSBI_ instance of number _ZERO_ - _0_.
//     */
//     protected static readonly ZERO_BIG_INT = JSBI.BigInt(0)
//     /**
//     * _JSBI_ instance of number _ONE_ - _1_.
//     */
//     protected static readonly ONE_BIG_INT = JSBI.BigInt(1)

//     /**
//      * Containes already calculated maximum numbers
//      * within ranks, maped to appropriate ranks releated
//      * to current _NumberSystem_.
//      */
//     protected _maxRankMap: { [key: number]: NSNumberaaa<T> } = {}
//     /**
//      * Containes already calculated minimum numbers
//      * within ranks, maped to appropriate ranks releated
//      * to current _NumberSystem_.
//      */
//     protected _minRankMap: { [key: number]: NSNumberaaa<T> } = {}

//     /**
//      * @param digits - Digits array of new _NumberSystem_ with at least one element,
//      * or IDigitsConfig instance, which defines digits system.
//      * @param options - _NumberSystem_ configuration options.
//      * @param validate - Defines if to validate arguments.
//      * 
//      * **Default - _false_**
//      */
//     constructor(digits: T, options?: {
//         /**
//          * Defines if to memoize already calculated digit _powers_
//          * for numbers in current _NumberSystem_.
//          * 
//          * **Default - _"performanceOptimized"_, i.e. memoize.**
//          */
//         optimization?: 'memoiryOptimized' | 'performanceOptimized'
//     }, validate?: boolean) {
//         const validArgs = validateArguments({ digits, options, validate }, NumberSystemSchema)
//         digits = validArgs.digits
//         options = validArgs.options

//         this.optimizationMode = options!.optimization!
//         this.dinamicAritySystem = false

//         const { error: isNotSystemDigitsConfig } = SystemDigitsConfigSchema.validate(digits)
//         if (!isNotSystemDigitsConfig) {
//             const digConf = digits as IDigitsConfig
//             this.digits = digConf.digGen as any
//             this.base = digConf.base
//             this.dinamicAritySystem = !!digConf.dinamicArity
//         } else {
//             const digitsArr = digits as string[]
//             this.digits = digitsArr as any
//             this.base = digitsArr.length
//         }

//         this.baseBigInt = JSBI.BigInt(this.base)
//     }



//     /**
//      * Generates _NSNumbers_  using custom _accumulator_ function,
//      * which must return decimal number, string( representation of decimal number ),
//      * or _NSNumber_ instance, to add to last _NSNumber_ generated, or null,
//      * to stop generation.
//      * @param startNsNumber - _NSNumber_ to start generating numbers from.
//      * @param accumulator - Function which returns decimal number,
//      * string( representation of decimal number ), or _NSNumber_ instance,
//      * to add to last generated number, or null, to stop generator. (See also _accumulator_ arguments.)
//      * Accumulator **Must** be function with explicit arguments, because **function.length** used under the hood.
//      * 
//      * NOTE: In case when result of applying _accumulator_ to last number
//      * is negative, memoized number will be _NSNumber(0)_ and subsequent generated value will
//      * be calculated against it.
//      * 
//      * @param optional - Optional configurations.
//      * For more details and defaults see each _optional_ property description.
//      * @param validate - Defines if to validate arguments.
//      * 
//      * **Default - _false_**
//      */
//     nsNumberManualGenerator(
//         startNsNumber: NSNumberaaa<any>,
//         accumulator: (
//             /**
//              * If after applying _accumulator_ to last number, result is nonnegative:
//              * - This argument will be _NSNumber_ instance.
//              * - **else** will be _null_.
//              */
//             lastNsNumber?: NSNumberaaa<any> | null,
//             /**
//              * Decimal string representation of result, of applying
//              * _accumulator_ to last _NSNumber_ instance.
//              * ( negative numbers will also be presented unlike first argument ).
//              * 
//              * NOTE: If you not consider to use this argument,
//              * do not specify it in your function signature.
//              * It will be more performance optimal.
//              */
//             lastNumberDecStr?: string,
//         ) => number | string | NSNumberaaa<any> | null,
//         optional?: {
//             /**
//              * Defines if to exclude _startNsNumber_ when start generating numbers.
//              * 
//              * **Default - _false_**
//              */
//             excludeStart?: boolean,
//             /**
//              * Defines if to yield _null_ if result after applying _accumulator_
//              * to last number is negative. 
//              * 
//              * If _false_ provided then _NSNumber(0)_ will be returned.
//              * 
//              * **Default - _true_**
//              */
//             onNegativeNull?: boolean,
//         }, validate?: boolean) {
//         const validArgs = validateArguments(
//             {
//                 startNsNumber,
//                 accumulator,
//                 optional,
//                 validate,
//             },
//             nsNumberManualGeneratorSchema,
//             { base: this.base }
//         )
//         startNsNumber = validArgs.startNsNumber
//         accumulator = validArgs.accumulator
//         optional = validArgs.optional

//         const sys = this
//         const zeroNsNumber = sys.Number(0, false)

//         let sumNsNumber = sys.Number(startNsNumber, false)
//         return function* () {
//             if (!optional!.excludeStart) {
//                 yield sumNsNumber
//             }

//             let acc: string | number | NSNumberaaa<any> | null
//             switch (accumulator.length) {
//                 case 2:
//                     acc = accumulator(sumNsNumber, sumNsNumber.bigInt.toString())
//                     break
//                 case 1:
//                     acc = accumulator(sumNsNumber)
//                     break
//                 case 0:
//                 default:
//                     acc = accumulator()
//             }

//             while (true) {
//                 if (acc === null) return

//                 const accBigInt = acc instanceof NSNumberaaa ? acc.bigInt : JSBI.BigInt(acc)

//                 const sumBigInt = JSBI.add(accBigInt, sumNsNumber.bigInt)
//                 const sumIsNegative = JSBI.lessThan(sumBigInt, NumberSystemaaaaaaa.ZERO_BIG_INT)
//                 if (sumIsNegative) {
//                     sumNsNumber = zeroNsNumber
//                     if (optional!.onNegativeNull) {
//                         yield null
//                     } else {
//                         yield sumNsNumber
//                     }
//                 } else {
//                     sumNsNumber = sys.Number(sumBigInt.toString(), false)
//                     yield sumNsNumber
//                 }

//                 switch (accumulator.length) {
//                     case 2:
//                         acc = accumulator(sumIsNegative ? null : sumNsNumber, sumBigInt.toString())
//                         break
//                     case 1:
//                         acc = accumulator(sumIsNegative ? null : sumNsNumber)
//                         break
//                     case 0:
//                     default:
//                         acc = accumulator()
//                 }
//             }
//         }
//     }

//     /**
//      * Monotonic _NSNumbers_ sequence generator.
//      * @param startNsNumber - _NSNumber_ to start generating numbers from.
//      * 
//      * NOTE: If with given _accumulator_ provided _endNsNumber_ is not reachable,
//      * then after considering _startNsNumber_ generator will immediately stop.
//      * @param optional - Optional configurations.
//      * For more details and defaults see each _optional_ property description.
//      * @param validate - Defines if to validate arguments.
//      * 
//      * **Default - _false_**
//      */
//     nsNumberGenerator(startNsNumber: NSNumberaaa<any>, optional?: {
//         /**
//          * _NSNumber_ to finish generate numbers on.
//          * 
//          * **Default _undefined_ - It Means Generator will continue monotonously
//          * generate _NSNumbers_, and pause only if _NSNumber(0)_ reached.**
//          * 
//          * **So if its monotonously increasing generator, it will never stop.**
//          */
//         endNsNumber?: NSNumberaaa<any>,
//         /**
//          * Accumulator given in decimal number, string( representation of decimal number ),
//          * or _NSNumber_ instance.
//          * 
//          * If not _NSNumber_ instance, then **MUST** be nonzero integer, or its string representation.
//          * 
//          * **Default - _1_**
//          */
//         accumulator?: number | string | NSNumberaaa<any>,
//         /**
//          * Defines if to exclude _startNsNumber_ when start generating numbers.
//          * 
//          * **Default - _false_**
//          */
//         excludeStart?: boolean,
//         /**
//          * Defines if to exclude _endNsNumber_ if reached.
//          * 
//          * **Default - _false_**
//          */
//         excludeEnd?: boolean,
//     }, validate?: boolean) {
//         const validArgs = validateArguments(
//             {
//                 startNsNumber,
//                 optional,
//                 validate,
//             },
//             nsNumberGeneratorSchema,
//             { base: this.base }
//         )
//         startNsNumber = validArgs.startNsNumber
//         optional = validArgs.optional

//         const sys = this
//         const zeroNsNumber = sys.Number(0, false)

//         const convertedStartNsNumber = sys.Number(startNsNumber, false)

//         const accumulator = optional!.accumulator!
//         const accBigInt = accumulator instanceof NSNumberaaa ? accumulator.bigInt : JSBI.BigInt(accumulator)

//         if (JSBI.lessThan(accBigInt, NumberSystemaaaaaaa.ZERO_BIG_INT)) {
//             const endNsNumber = optional!.endNsNumber
//                 ? sys.Number(optional!.endNsNumber!, false)
//                 : zeroNsNumber

//             return function* () {
//                 if (!optional!.excludeStart) {
//                     yield convertedStartNsNumber
//                 }

//                 let sumBigInt = JSBI.add(convertedStartNsNumber.bigInt, accBigInt)
//                 while (JSBI.lessThan(endNsNumber.bigInt, sumBigInt)) {
//                     yield sys.Number(sumBigInt.toString(), false)

//                     sumBigInt = JSBI.add(sumBigInt, accBigInt)
//                 }
//                 if (!optional!.excludeEnd && JSBI.equal(endNsNumber.bigInt, sumBigInt)) {
//                     yield sys.Number(sumBigInt.toString(), false)
//                 }
//             }
//         } else {
//             const accNsNumber = sys.Number(accBigInt.toString(), false)

//             if (optional!.endNsNumber) {
//                 const endNsNumber = sys.Number(optional!.endNsNumber, false)

//                 return function* () {
//                     if (!optional!.excludeStart) {
//                         yield convertedStartNsNumber
//                     }

//                     let sumNsNumber = convertedStartNsNumber.add(accNsNumber, false)

//                     while (JSBI.lessThan(sumNsNumber.bigInt, endNsNumber.bigInt)) {
//                         yield sumNsNumber

//                         sumNsNumber = sumNsNumber.add(accNsNumber, false)
//                     }

//                     if (!optional!.excludeEnd && JSBI.equal(endNsNumber.bigInt, sumNsNumber.bigInt)) {
//                         yield sumNsNumber
//                     }
//                 }
//             }

//             return function* () {
//                 if (!optional!.excludeStart) {
//                     yield convertedStartNsNumber
//                 }

//                 let sumNsNumber = convertedStartNsNumber
//                 do {
//                     sumNsNumber = sumNsNumber.add(accNsNumber, false)
//                     yield sumNsNumber
//                 } while (true);
//             }
//         }
//     }

//     /**
//      * Returns _NSNumber_ instance in current _NumberSystem_.
//      * @param number - Decimal number, string( representation of decimal number ),
//      * _NSNumber_ instance, or array of digit powers, in current _NumberSystem_.
//      * 
//      * **Default -**
//      * - **If empty array provided  - _[0]_**
//      * - **If nothing(_undefined_) -  _0_**
//      * @param validate - Defines if to validate arguments.
//      * 
//      * **Default - _false_**
//      */
//     Number(number?: number, validate?: boolean): NSNumberaaa<T>
//     Number(numberStr?: string, validate?: boolean): NSNumberaaa<T>
//     Number(nsNumber: NSNumberaaa<any>, validate?: boolean): NSNumberaaa<T>
//     Number(decimalDigArray?: number[], validate?: boolean): NSNumberaaa<T>
//     Number(number?: any, validate?: boolean) {
//         const validArgs = validateArguments({ number, validate }, NumberSchema)
//         number = validArgs.number

//         const sys = this
//         return new NSNumberaaa(sys, number, false)
//     }

//     /**
//      * Generates maximum _NSNumber_ of _NumberSystem_ within given _rank_.
//      * @param rank - rank of number to generate. **MUST** be positive integer.
//      * @param validate - Defines if to validate arguments.
//      * 
//      * **Default - _false_**
//      */
//     maxInRank(rank: number, validate?: boolean) {
//         const validArgs = validateArguments({ rank, validate }, minMaxInRankSchema)
//         rank = validArgs.rank

//         if (rank in this._maxRankMap) {
//             return this._maxRankMap[rank]
//         }
//         const digArr: number[] = []
//         const maxDig = this.base - 1
//         for (let i = 0; i < rank; i++) {
//             digArr[i] = maxDig
//         }
//         const nsNumber = this.Number(digArr, false)
//         if (!(rank in this._maxRankMap)) {
//             this._maxRankMap[rank] = nsNumber
//         }
//         return nsNumber
//     }

//     /**
//      * Generates minimum _NSNumber_ of _NumberSystem_ within given _rank_.
//      * @param rank - rank of number to generate. **MUST** be positive integer.
//      * @param validate - Defines if to validate arguments.
//      * 
//      * **Default - _false_**
//      */
//     minInRank(rank: number, validate?: boolean) {
//         const validArgs = validateArguments({ rank, validate }, minMaxInRankSchema)
//         rank = validArgs.rank

//         if (rank in this._minRankMap) {
//             return this._minRankMap[rank]
//         }
//         const digArr: number[] = [1]
//         if (rank > 1) {
//             for (let i = 1; i < rank; i++) {
//                 digArr[i] = 0
//             }
//         } else {
//             digArr[0] = 0
//         }
//         const nsNumber = this.Number(digArr, false)
//         if (!(rank in this._minRankMap)) {
//             this._minRankMap[rank] = nsNumber
//         }
//         return nsNumber
//     }
// }


// import { NSNumberaaa } from "../NSNumber"

// // validation related imports
// import { isDigitsConfig, powersArrToDecimal, validateArguments } from "../utils"
// import {
//     NumberSystemSchema,
//     powersArrToDecimalSchema,
//     NumberSchema,
//     nsNumberManualGeneratorSchema,
//     nsNumberGeneratorSchema,
//     minMaxInRankSchema,
// } from "../validations/NumberSystem"
// import { SystemDigitsConfigSchema } from "../validations/SystemDigitsConfig"
