import JSBI from "jsbi"
import {
    OptimizaionMode,
    SystemDigitsConfig,
} from "../commonTypes"


/**
 * Represents new _NumberSystem_ corresponding to provided digits,
 * or _SystemDigitsConfig_
 */
export class NumberSystem<T extends string[] | SystemDigitsConfig> {
    /**
     * Digits of current _NumberSystem_, or function
     * which returns corresponding digit for given digit _power_.
     */
    readonly digits: T extends SystemDigitsConfig ? T['digGen'] : string[]

    /**
     * Defines if _digits_ is a function which supports
     * multiple _power_ arguments.
     * 
     * NOTE: If _dinamicAritySystem_ is false,
     * It does not necessary mean that _digits_ is not a function. 
     */
    readonly dinamicAritySystem: boolean
    
    /**
     * Base of current _NumberSystem_.
     */
    readonly base: number
    /**
     * Defines if to memoize already calculated digit _powers_
     * for numbers in current _NumberSystem_.
     * 
     * **Default - _"performanceOptimized"_, i.e. memoize.**
     */
    readonly optimizationMode: OptimizaionMode

    /**
     * _JSBI_ instance of current _NumberSystem_ base.
     */
    protected readonly baseBigInt: JSBI

     /**
     * _JSBI_ instance of number _ZERO_ - _0_.
     */
    protected static readonly ZERO_BIG_INT = JSBI.BigInt(0)
     /**
     * _JSBI_ instance of number _ONE_ - _1_.
     */
    protected static readonly ONE_BIG_INT = JSBI.BigInt(1)

    /**
     * Containes already calculated maximum numbers
     * within ranks, maped to appropriate ranks releated
     * to current _NumberSystem_.
     */
    protected _maxRankMap: { [key: number]: NSNumber<T> } = {}
    /**
     * Containes already calculated minimum numbers
     * within ranks, maped to appropriate ranks releated
     * to current _NumberSystem_.
     */
    protected _minRankMap: { [key: number]: NSNumber<T> } = {}

    /**
     * @param digits - Digits array of new _NumberSystem_ with at least one element.
     * where each _"Digit"_ contains at least one character,
     * or _SystemDigitsConfig_ instance, which defines digits system.
     * @param options - _NumberSystem_ configuration options.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    constructor(digits: T, options?: {
        /**
         * Defines if to memoize already calculated digit _powers_
         * for numbers in current _NumberSystem_.
         * 
         * **Default - _"performanceOptimized"_, i.e. memoize.**
         */
        optimization?: 'memoiryOptimized' | 'performanceOptimized'
    }, validate?: boolean) {
        const validArgs = validateArguments({ digits, options, validate }, NumberSystemSchema)
        digits = validArgs.digits
        options = validArgs.options

        this.optimizationMode = options!.optimization!
        this.dinamicAritySystem = false

        const { error: isNotSystemDigitsConfig } = SystemDigitsConfigSchema.validate(digits)
        if (!isNotSystemDigitsConfig) {
            const digConf = digits as SystemDigitsConfig
            this.digits = digConf.digGen as any
            this.base = digConf.base
            this.dinamicAritySystem = !!digConf.dinamicArity
        } else {
            const digitsArr = digits as string[]
            this.digits = digitsArr as any
            this.base = digitsArr.length
        }

        this.baseBigInt = JSBI.BigInt(this.base)
    }

    /**
     * **NOT VALIDATABLE!!!**
     * 
     * Returnes 'strict' _SystemDigitsConfig_ with _dinamicArity_. (See _SystemDigitsConfig_ for more details)
     * @param mixture - Comma separated list of:
     * - numbers: **MUST** be Unicode code point,
     * - number ranges - [number, number]: **MUST** be Unicode code points range,
     * - strings: **Must** contain at leats one character, **CAN** contain surrogate pairs.
     * - char ranges - [char, char]: First cahracter will be taken
     * if more than one character apeares in string. **CAN** contain surrogate pairs.
     * Surrogate Paires considered as single characters.
     * - _SystemDigitsConfig_
     */
    static systemDigitsConfig(...mixture: ([number, number] | [string, string] | number | string | SystemDigitsConfig)[]): SystemDigitsConfig {
        type CategoryStructure = {
            currentBase: number
            dig: string | ((...powers: number[]) => string[])
        }
        const mixtureStructure: CategoryStructure[] = []

        let base = 0
        for (const item of mixture) {
            let categoryStructure: CategoryStructure
            switch (typeof item) {
                case 'number':
                    base++
                    categoryStructure = {
                        currentBase: base,
                        dig: String.fromCodePoint(item),
                    }
                    break
                case 'string':
                    base++
                    categoryStructure = {
                        currentBase: base,
                        dig: item,
                    }
                    break
                case 'object':
                default:
                    const { error: isNotSystemDigitsConfig } = SystemDigitsConfigSchema.validate(item)
                    if (!isNotSystemDigitsConfig) {
                        const sysDigConf = item as SystemDigitsConfig
                        base += sysDigConf.base
                        categoryStructure = {
                            currentBase: base,
                        } as any
                        if (!sysDigConf.dinamicArity) {
                            categoryStructure.dig = (...powers: number[]) => powers.map(pow => sysDigConf.digGen(pow)[0]) as string[]
                        } else {
                            categoryStructure.dig = (...powers: number[]) => sysDigConf.digGen(...powers) as string[]
                        }
                    } else if (item instanceof Array) {
                        let startNum: number = item[0] as any
                        let endNum: number = item[1] as any
                        if (typeof item[0] === 'string') {
                            startNum = item[0].codePointAt(0)!
                            endNum = (item[1] as string).codePointAt(0)!
                        }

                        base += 1 + Math.abs(endNum - startNum)
                        categoryStructure = {
                            currentBase: base,
                        } as any
                        if (startNum < endNum) {
                            categoryStructure.dig = (...powers: number[]) => {
                                return powers.map(pow => String.fromCodePoint(startNum + pow))
                            }
                        } else {
                            categoryStructure.dig = (...powers: number[]) => {
                                return powers.map(pow => String.fromCodePoint(startNum - pow))
                            }
                        }
                    }
            }
            mixtureStructure.push(categoryStructure!)
        }
        return {
            base,
            maxBase: base,
            dinamicArity: true,
            digGen(...powers: number[]) {
                const categorized: {
                    [key: number]: number[]
                } = {}

                const pozitionMatrix: [number, number][] = []

                for (let powIndex = 0; powIndex < powers.length; powIndex++) {
                    const pow = powers[powIndex]
                    if (pow < 0 || pow >= this.base) {
                        if (!(-1 in categorized)) {
                            categorized[-1] = []
                        }
                        const inCategoryIndex = categorized[-1].push(pow) - 1
                        pozitionMatrix[powIndex] = [-1, inCategoryIndex]
                    } else {
                        let lastBase = 0
                        for (let categoryIndex = 0; categoryIndex < mixtureStructure.length; categoryIndex++) {
                            const category = mixtureStructure[categoryIndex]
                            if (pow < category.currentBase) {
                                if (!(categoryIndex in categorized)) {
                                    categorized[categoryIndex] = []
                                }
                                const inCategoryIndex = categorized[categoryIndex].push(pow - lastBase) - 1
                                pozitionMatrix[powIndex] = [categoryIndex, inCategoryIndex]
                                break
                            }
                            lastBase = category.currentBase
                        }
                    }
                }

                const categorizedResults: {
                    [key: number]: string | undefined | (string | undefined)[]
                } = {}

                if (-1 in categorized) {
                    categorizedResults[-1] = undefined
                    delete categorized[-1]
                }

                for (const key in categorized) {
                    if (typeof mixtureStructure[key].dig === 'function') {
                        const digFunc = mixtureStructure[key].dig as (...powers: number[]) => string[]
                        categorizedResults[key] = digFunc(...categorized[key])
                    } else {
                        categorizedResults[key] = mixtureStructure[key].dig as string
                    }
                }

                return powers.map((pow, powIndex) => {
                    const placementInfo = pozitionMatrix[powIndex]
                    const categoryIndex = placementInfo[0]
                    const categoryResult = categorizedResults[categoryIndex]

                    if (categoryResult instanceof Array) {
                        const inCategoryIndex = placementInfo[1]
                        return categoryResult[inCategoryIndex]
                    }

                    return categoryResult
                })
            }
        }
    }

    /**
     * Converts _powers_ array of give _base_  to decimal number string representation.
     * @param powers - _Powers_ array of given _base_. _Powers_ **MUST** be less than _base_ nonnegative integers.
     * @param base - _Base_ in which to consider given _powers_ array.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    static powersArrToDecimal(powers: number[], base: number, validate?: boolean) {
        const validArgs = validateArguments({ powers, base, validate }, powersArrToDecimalSchema)
        powers = validArgs.powers
        base = validArgs.base

        const baseBigInt = JSBI.BigInt(base)
        let sumBigInt = NumberSystem.ZERO_BIG_INT
        for (const pow of powers) {
            const powBigInt = JSBI.BigInt(pow)
            sumBigInt = JSBI.add(JSBI.multiply(sumBigInt, baseBigInt), powBigInt)
        }
        return sumBigInt.toString()
    }

    /**
     * Generates _NSNumbers_  using custom _accumulator_ function,
     * which must return decimal number, string( representation of decimal number ),
     * or _NSNumber_ instance, to add to last _NSNumber_ generated, or null,
     * to stop generation.
     * @param startNsNumber - _NSNumber_ to start generating numbers from.
     * @param accumulator - Function which returns decimal number,
     * string( representation of decimal number ), or _NSNumber_ instance,
     * to add to last generated number, or null, to stop generator. (See also _accumulator_ arguments.)
     * 
     * NOTE: In case when result of applying _accumulator_ to last number
     * is negative, memoized number will be _NSNumber(0)_ and subsequent generated value will
     * be calculated against it.
     * @param optional - Optional configurations.
     * For more details and defaults see each _optional_ property description.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    nsNumberManualGenerator(
        startNsNumber: NSNumber<any>,
        accumulator: (
            /**
             * If after applying _accumulator_ to last number result is positive:
             * - This argument will be _NSNumber_ instance.
             * - **else** will be _null_.
             * 
             * NOTE: If you not consider to use this argument,
             * do not specify it in your function signature.
             * It will be more performance optimal.
             */
            lastNsNumber?: NSNumber<any> | null,
            /**
             * Decimal string representation of result of applying
             * _accumulator_ to last _NSNumber_ instance.
             * ( negative numbers will also be presented unlike first argument ).
             * 
             * NOTE: If you not consider to use this argument,
             * do not specify it in your function signature.
             * It will be more performance optimal.
             */
            lastNumberDecStr?: string,
        ) => number | string | NSNumber<any> | null,
        optional?: {
            /**
             * Defines if to exclude _startNsNumber_ when start generating numbers.
             * 
             * **Default - _false_**
             */
            excludeStart?: boolean,
            /**
             * Defines if to return _null_ if result after applying _accumulator_
             * to last number is negative. 
             * 
             * If _false_ provided then _NSNumber(0)_ will be returned.
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

            let acc: string | number | NSNumber<any> | null
            switch (accumulator.length) {
                case 2:
                    acc = accumulator(sumNsNumber, sumNsNumber.bigInt.toString())
                    break
                case 1:
                    acc = accumulator(sumNsNumber)
                    break
                case 0:
                default:
                    acc = accumulator()
            }

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
     * @param startNsNumber - _NSNumber_ to start generating numbers from.
     * @param optional - Optional configurations.
     * For more details and defaults see each _optional_ property description.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    nsNumberGenerator(startNsNumber: NSNumber<any>, optional?: {
        /**
         * _NSNumber_ to finish generate numbers on.
         * 
         * **Default _undefined_ - It Means Generator will continue monotonously
         * generate _NSNumbers_, and pause only if _NSNumber(0)_ reached.**
         * 
         * **So if its monotonously increasing generator, it will never stop.**
         */
        endNsNumber?: NSNumber<any>,
        /**
         * Accumulator given in decimal number, string( representation of decimal number ),
         * or _NSNumber_ instance.
         * 
         * **MUST** be nonzero integer, or its string representation.
         * 
         * **Default - _1_**
         */
        accumulator?: number | string | NSNumber<any>,
        /**
         * Defines if to exclude _startNsNumber_ when start generating numbers.
         * 
         * **Default - _false_**
         */
        excludeStart?: boolean,
        /**
         * Defines if to exclude _endNsNumber_ if reached.
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

        const convertedStartNsNumber = sys.Number(startNsNumber, false)

        const accumulator = optional!.accumulator!
        const accBigInt = accumulator instanceof NSNumber ? accumulator.bigInt : JSBI.BigInt(accumulator)

        if (JSBI.lessThan(accBigInt, NumberSystem.ZERO_BIG_INT)) {
            const endNsNumber = optional!.endNsNumber
                ? sys.Number(optional!.endNsNumber!, false)
                : zeroNsNumber

            return function* () {
                if (!optional!.excludeStart) {
                    yield convertedStartNsNumber
                }

                let sumBigInt = JSBI.add(convertedStartNsNumber.bigInt, accBigInt)
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
                        yield convertedStartNsNumber
                    }

                    let sumNsNumber = convertedStartNsNumber.add(accNsNumber, false)

                    while (JSBI.lessThan(sumNsNumber.bigInt, endNsNumber.bigInt)) {
                        yield sumNsNumber

                        sumNsNumber = sumNsNumber.add(accNsNumber, false)
                    }

                    if (!optional!.excludeEnd && JSBI.equal(endNsNumber.bigInt, sumNsNumber.bigInt)) {
                        yield sumNsNumber
                    }
                }
            }

            return function* () {
                if (!optional!.excludeStart) {
                    yield convertedStartNsNumber
                }

                let sumNsNumber = convertedStartNsNumber
                do {
                    sumNsNumber = sumNsNumber.add(accNsNumber, false)
                    yield sumNsNumber
                } while (true);
            }
        }
    }

    /**
     * Returns _NSNumber_ instance in current _NumberSystem_.
     * @param number - Decimal number, string( representation of decimal number ),
     * _NSNumber_ instance, or array of digit powers, in current _NumberSystem_.
     * 
     * **Default -**
     * - **If empty array provided  - _[0]_**
     * - **If nothing(_undefined_) -  _0_**
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    Number(number?: number, validate?: boolean): NSNumber<T>
    Number(numberStr?: string, validate?: boolean): NSNumber<T>
    Number(nsNumber: NSNumber<any>, validate?: boolean): NSNumber<T>
    Number(decimalDigArray?: number[], validate?: boolean): NSNumber<T>
    Number(number?: any, validate?: boolean) {
        const validArgs = validateArguments({ number, validate }, NumberSchema)
        number = validArgs.number

        const sys = this
        return new NSNumber(sys, number, false)
    }

    /**
     * Generates maximum number of _NumberSystem_ within given _rank_.
     * @param rank - rank of number to generate. **MUST** be positive integer.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    maxInRank(rank: number, validate?: boolean) {
        const validArgs = validateArguments({ rank, validate }, minMaxInRankSchema)
        rank = validArgs.rank

        if (rank in this._maxRankMap) {
            return this._maxRankMap[rank]
        }
        const digArr: number[] = []
        const maxDig = this.base - 1
        for (let i = 0; i < rank; i++) {
            digArr[i] = maxDig
        }
        const nsNumber = this.Number(digArr, false)
        if (!(rank in this._maxRankMap)) {
            this._maxRankMap[rank] = nsNumber
        }
        return nsNumber
    }

    /**
     * Generates minimum number of _NumberSystem_ within given _rank_.
     * @param rank - rank of number to generate. **MUST** be positive integer.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    minInRank(rank: number, validate?: boolean) {
        const validArgs = validateArguments({ rank, validate }, minMaxInRankSchema)
        rank = validArgs.rank

        if (rank in this._minRankMap) {
            return this._minRankMap[rank]
        }
        const digArr: number[] = [1]
        if (rank > 1) {
            for (let i = 1; i < rank; i++) {
                digArr[i] = 0
            }
        } else {
            digArr[0] = 0
        }
        const nsNumber = this.Number(digArr, false)
        if (!(rank in this._minRankMap)) {
            this._minRankMap[rank] = nsNumber
        }
        return nsNumber
    }
}


import { NSNumber } from "../NSNumber"

// validation related imports
import { validateArguments } from "../utils"
import {
    NumberSystemSchema,
    powersArrToDecimalSchema,
    NumberSchema,
    nsNumberManualGeneratorSchema,
    nsNumberGeneratorSchema,
    minMaxInRankSchema,
} from "../validations/NumberSystem"
import { SystemDigitsConfigSchema } from "../validations/SystemDigitsConfig"
