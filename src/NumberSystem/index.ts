import JSBI from "jsbi"
import {
    OptimizaionMode,
    SystemDigitsConf,
} from "../commonTypes"


/**
 * Represents new number system, with provided digits.
 */
export class NumberSystem<T extends string[] | SystemDigitsConf> {
    /**
     * Digits of current number system.
     */
    readonly digits: T extends SystemDigitsConf ? T['digGen'] : string[]
    /**
     * Base of Number System.
     */
    readonly base: number
    readonly optimizationMode: OptimizaionMode

    protected readonly baseBigInt: JSBI

    protected static readonly ZERO_BIG_INT = JSBI.BigInt(0)
    protected static readonly ONE_BIG_INT = JSBI.BigInt(1)

    protected _maxRankMap: { [key: number]: NSNumber<T> } = {}
    protected _minRankMap: { [key: number]: NSNumber<T> } = {}

    /**
     * @param digits - Digits of new number system with at least one element.
     * Each must contain at least one character.
     * 
     * NOTE: Digits must be unique.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    constructor(digits: T, options?: {
        optimization?: 'memoiryOptimized' | 'performanceOptimized'
    }, validate?: boolean) {
        const validArgs = validateArguments({ digits, options, validate }, NumberSystemSchema)
        digits = validArgs.digits
        options = validArgs.options

        this.optimizationMode = options!.optimization!

        if (digits instanceof Array) {
            this.digits = digits as any
            this.base = digits.length
        } else {
            const digConf = digits as SystemDigitsConf
            this.digits = digConf.digGen as any
            this.base = digConf.base
        }

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
    static lessThan(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>, validate?: boolean) {
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
    static lessThanOrEqual(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>, validate?: boolean) {
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
    static equal(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>, validate?: boolean) {
        const validArgs = validateArguments({ nsNumber1, nsNumber2, validate }, opSchema)
        nsNumber1 = validArgs.nsNumber1
        nsNumber2 = validArgs.nsNumber2

        return JSBI.equal(nsNumber1.bigInt, nsNumber2.bigInt)
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
     * Adds two _NSNumber_ instances in current _NumberSystem_.
     * i.e. result _NSNumber_ will be represented in current _NumberSystem_.
     * @param nsNumber1 - number to add.
     * @param nsNumber2 - number to add.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    add(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>, validate?: boolean) {
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
    subtract(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>, validate?: boolean) {
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
    remainder(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>, validate?: boolean) {
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
    multiply(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>, validate?: boolean) {
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
    divide(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>, validate?: boolean) {
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
        startNsNumber: NSNumber<any>,
        accumulator: (
            /**
             * This argument will be or _NSNumber_, if after applying accumulator to last number result is positive,
             * or will be _null_ if its not.
             */
            lastNsNumber?: NSNumber<any> | null,
            /**
             * Decimal string representation of last number after applying to it accumulator
             * ( negative numbers will also be presented unlike first argument ).
             */
            lastNumberDecStr?: string,
        ) => number | string | NSNumber<any> | null,
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
     * @param startNsNumber - _NSNumber_ to start generating values from.
     * @param optional - Optional arguments.
     * For more details see each optional argument description.
     * 
     * **Default -  _See each property default_**
     * @param validate - Defines if to validate arguments.
     * 
     * **Default - _false_**
     */
    nsNumberGenerator(startNsNumber: NSNumber<any>, optional?: {
        /**
         * End number represented with _NSNumber_.
         * 
         * **Default _undefined_ - It Means Generator will continue monotonously
         * generate _NSNumbers_, and pause only if zero reached.**
         * 
         * **So if its monotonously inceressing generator,**
         * **it will never stop.**
         */
        endNsNumber?: NSNumber<any>,
        /**
         * Accumulator given in number, string representation of number, or _NSNumber_.
         * Must be nonzero integer or its representation.
         * 
         * **Default - _1_**
         */
        accumulator?: number | string | NSNumber<any>,
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

                    let sumNsNumber = sys.add(convertedStartNsNumber, accNsNumber, false)

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
                    yield convertedStartNsNumber
                }

                let sumNsNumber = convertedStartNsNumber
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
     * Generates maximum number of _NumberSystem_ in given rank.
     * @param rank - rank of number to generate.
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
     * Generates minimum number of _NumberSystem_ in given rank.
     * @param rank - rank of number to generate.
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
    decDigitsArrToDecimalSchema,
    opSchema,
    NumberSchema,
    nsNumberManualGeneratorSchema,
    nsNumberGeneratorSchema,
    minMaxInRankSchema,
} from "../validations/NumberSystemValidations"