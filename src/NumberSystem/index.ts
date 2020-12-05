import JSBI from "jsbi"
import {
    isDigitsConfig,
    powersArrToDecimal,
} from "../utils"

import {
    IDigitsConfig,
} from "../commonTypes"


/**
 * _NSNumber_ instance.
 */
export interface NSNumber<S extends NumberSystemInstance<any>> extends Iterable<NSNumber<S>> {
    /**
     * Digit of current number.
     */
    [index: number]: NSNumber<S>
    /**
     * _NumberSystem_ instance in which represented current _NSNumber_.
     */
    readonly system: S
    /**
     * _NSNumber_ digits count.
     */
    readonly length: number
    /**
     * Returns Generator of digits from digit at _start_ to digit at _end_
     * With provided _step_.
     * 
     * **NOTE: If _start_ or _end_ value is out of bounds  [0, NSNumber.length - 1]**
     * **They will be assigned to 0(if less than 0)**
     * **or NSNumber.length - 1(if more than NSNumber.length - 1) accordingly.**
     * @param start - Generation start index(0 based). **MUST** be integer.
     * @param end - Generation end index. **MUST** be integer or **undefined**.
     * @param step - Generation step. **MUST** be positive integer or **undefined**.
     */
    digGenerator(start: number, end?: number, step?: number): Generator<NSNumber<S>>
    /**
     * Adds two _NSNumber_ instances.
     * 
     * Result will be _NSNumber_ of **CurrentNsNumber.system**.
     * 
     * **NOTE: If result less than zero, _undefined_ will be returned.**
     * @param nsNumber - _NSNumber_ to add.
     */
    add<T extends NSNumber<any> | string | number>(nsNumber: T): T extends NSNumber<any> ? NSNumber<S> : NSNumber<S> | undefined
    /**
     * Subtract two _NSNumber_ instances.
     * 
     * Result will be _NSNumber_ of **CurrentNsNumber.system**.
     * 
     * **NOTE: If result less than zero, _undefined_ will be returned.**
     * @param nsNumber - _NSNumber_ reducer.
     */
    subtract(nsNumber: NSNumber<any> | string | number): NSNumber<S> | undefined
    /**
     * Calculates _**CurrentNSNumebr** modulo **ArgumentNSNumber**_.
     * 
     * Result will be _NSNumber_ of **CurrentNsNumber.system**.
     * 
     * **NOTE: Nonnegative remainder will be returned. And -**
     * - **If divider equal to 0, _undefined_ will be returned.**
     * @param nsNumber - _NSNumber_ divider.
     */
    remainder(nsNumber: NSNumber<any> | string | number): NSNumber<S> | undefined
    /**
     * Multiply two _NSNumber_ instances.
     * 
     * Result will be _NSNumber_ of **CurrentNsNumber.system**.
     * 
     * **NOTE: If result less than zero, _undefined_ will be returned.**
     * @param nsNumber - _NSNumber_ multipler.
     */
    multiply<T extends NSNumber<any> | string | number>(nsNumber: T): NSNumber<S> | undefined
    /**
     * Divide two _NSNumber_ instances.
     * 
     * Result will be _NSNumber_ of **CurrentNsNumber.system**.
     * 
     * **NOTE: Integer part of division will be taken. And -**
     * - **If result less than zero, _undefined_ will be returned.**
     * - **If divider equals to 0, _undefined_ will be returned.**
     * @param nsNumber - _NSNumber_ divider.
     */
    divide(nsNumber: NSNumber<any> | string | number): NSNumber<S> | undefined
    /**
     * Immutably increments number.
     */
    increment(): NSNumber<S>
    /**
     * Immutably decrements number.
     */
    decrement(): NSNumber<S> | undefined
    /**
     * Returns number representation of current _NSNumber_.
     */
    toNumber(): number
    /**
     * Returns string representation of current _NSNumber_.
     */
    toString(): string
    /**
     * Converts current _NSNumber_ to given _NumberSystem_ instance.
     * @param sys - _NumberSystem_ instance to convert to.
     */
    toSystem<T extends IDigitsConfig | string[]>(sys: NumberSystemInstance<T>): NSNumber<NumberSystemInstance<T>>
}
export interface NSNumberPrivate<S extends NumberSystemInstance<any>> extends NSNumber<S> {
    system: S
    bigInt: JSBI
    _length: number
    _digitsArr: number[] | undefined
    _digitsMap: { [key: number]: number } | undefined
    _digitsMapLength: number | undefined
    _ownKeys: (string | symbol | number)[] | undefined

    mapToArr(): void
    /**
     * Returnes digit at given position.
     * @param position - Index of digit to return.
     * 
     * **MUST** be integer.
     */
    getDigit(position: number): NSNumber<S> | undefined
    /**
     * Returns power of digit at give position of current number, or _undefined_ if not existing digit position provided.
     * @param position - Index of digit to return power for.
     * 
     * **MUST** be integer.
     */
    getPower(position: number): number | undefined
    /**
     * Returns Generator of digit _powers_ from digit at _start_ to digit at _end_
     * With provided _step_.
     * 
     * **NOTE: If _start_ or _end_ value is out of bounds  [0, NSNumber.length - 1]**
     * **They will be assigned to 0(if less than 0)**
     * **or NSNumber.length - 1(if more than NSNumber.length - 1) accordingly.**
     * @param start - Generation start index(0 based). **MUST** be integer.
     * @param end - Generation end index. **MUST** be integer or **undefined**.
     * @param step - Generation step. **MUST** be positive integer or **undefined**.
     */
    digPowGenerator(start: number, end?: number, step?: number): Generator<number>
}



/**
 * _NumberSystem_ instance.
 */
export interface NumberSystemInstance<T extends IDigitsConfig | string[]> {
    /**
     * Digits array or _IDigitsConfig_ of current _NumberSystem_,
     */
    readonly digits: T
    /**
     * Base of current _NumberSystem_. When digits providing with
     * _IDigitsConfig_, base will be fixed in this property.
     */
    readonly base: number

    /**
     * Monotonic _NSNumbers_ sequence generator. 
     * 
     * **NOTE:** _start_ and _end_ included.
     * @param start - _NSNumber_ to start generation from.
     * @param end - _NSNumber_ to finish generation on.
     * 
     * **Default: undefined, i.e.Continue Infinitely**
     * @param step - _NSNumber_ representing step of generation.
     * 
     * **Default: 1**
     */
    numberGenerator(start: NSNumber<any>, end?: NSNumber<any>, step?: NSNumber<any>): NSNumber<NumberSystemInstance<T>>
    /**
     * Generates maximum _NSNumber_ of current _NumberSystem_ within given _rank_.
     * @param rank - rank of number to generate. **MUST** be positive integer.
     */
    maxInRank(rank: number): NSNumber<NumberSystemInstance<T>>
    /**
     * Generates minimum _NSNumber_ of current _NumberSystem_ within given _rank_.
     * @param rank - rank of number to generate. **MUST** be positive integer.
     */
    minInRank(rank: number): NSNumber<NumberSystemInstance<T>>


    /**
     * Creates _NSNumber_ instance in current _NumberSystem_.
     * @param number - Decimal number, string representation of decimal number,
     * or array of digit powers, in current _NumberSystem_.
     * 
     * If number or string provided, **MUST** be nonnegative integer.
     * 
     * If array provided, **MUST** contain only numbers less than current _base_.
     */
    (number: number): NSNumber<NumberSystemInstance<T>>
    /**
     * Creates _NSNumber_ instance in current _NumberSystem_.
     * @param number - Decimal number, string representation of decimal number,
     * or array of digit powers, in current _NumberSystem_.
     * 
     * If number or string provided, **MUST** be nonnegative integer.
     * 
     * If array provided, **MUST** contain only numbers less than current _base_.
     */
    (number: string): NSNumber<NumberSystemInstance<T>>
    /**
     * Creates _NSNumber_ instance in current _NumberSystem_.
     * @param number - Decimal number, string representation of decimal number,
     * or array of digit powers, in current _NumberSystem_.
     * 
     * If number or string provided, **MUST** be nonnegative integer.
     * 
     * If array provided, **MUST** contain only numbers less than current _base_.
     */
    (number: number[]): NSNumber<NumberSystemInstance<T>>
    /**
     * Creates _NSNumber_ instance in current _NumberSystem_.
     * @param number - Decimal number, string representation of decimal number,
     * or array of digit powers, in current _NumberSystem_.
     * 
     * If number or string provided, **MUST** be nonnegative integer.
     * 
     * If array provided, **MUST** contain only numbers less than current _base_.
     */
    new(number: number): NSNumber<NumberSystemInstance<T>>
    /**
     * Creates _NSNumber_ instance in current _NumberSystem_.
     * @param number - Decimal number, string representation of decimal number,
     * or array of digit powers, in current _NumberSystem_.
     * 
     * If number or string provided, **MUST** be nonnegative integer.
     * 
     * If array provided, **MUST** contain only numbers less than current _base_.
     */
    new(number: string): NSNumber<NumberSystemInstance<T>>
    /**
     * Creates _NSNumber_ instance in current _NumberSystem_.
     * @param number - Decimal number, string representation of decimal number,
     * or array of digit powers, in current _NumberSystem_.
     * 
     * If number or string provided, **MUST** be nonnegative integer.
     * 
     * If array provided, **MUST** contain only numbers less than current _base_.
     */
    new(number: number[]): NSNumber<NumberSystemInstance<T>>
}
export interface NumberSystemPrivate<T extends IDigitsConfig | string[]> extends NumberSystemInstance<T> {
    digits: T
    base: number
    baseBigInt: JSBI

    _maxInRankMap: { [key: number]: NSNumber<NumberSystemInstance<T>> }
    _minInRankMap: { [key: number]: NSNumber<NumberSystemInstance<T>> }
}


/**
 * _NumberSystem_ constructor.
 */
export interface NumberSystemConstructor {
    /**
     * Checks if provided object is _NSNumber_ instance.
     * @param obj - Object to check if it is _NSNumber_ instance.
     */
    isNumber(obj: any): obj is NSNumber<NumberSystemInstance<IDigitsConfig | string[]>>
    /**
     * Compares two _NsNumbers_. Returnes **true** if **_nsNumber1_ < _nsNumber2_**.
     * 
     * @param nsNumber1 - _NSNumber_ instance.
     * @param nsNumber2 - _NSNumber_ instance.
     */
    lt(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>): boolean
    /**
     * Compares two _NsNumbers_. Returnes **true** if **_nsNumber1_ <= _nsNumber2_**.
     * 
     * @param nsNumber1 - _NSNumber_ instance.
     * @param nsNumber2 - _NSNumber_ instance.
     */
    le(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>): boolean
    /**
     * Compares two _NsNumbers_. Returnes **true** if **_nsNumber1_ > _nsNumber2_**.
     * 
     * @param nsNumber1 - _NSNumber_ instance.
     * @param nsNumber2 - _NSNumber_ instance.
     */
    gt(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>): boolean
    /**
     * Compares two _NsNumbers_. Returnes **true** if **_nsNumber1_ >= _nsNumber2_**.
     * 
     * @param nsNumber1 - _NSNumber_ instance.
     * @param nsNumber2 - _NSNumber_ instance.
     */
    ge(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>): boolean
    /**
     * Compares two _NsNumbers_. Returnes **true** if **_nsNumber1_ != _nsNumber2_**.
     * 
     * @param nsNumber1 - _NSNumber_ instance.
     * @param nsNumber2 - _NSNumber_ instance.
     */
    ne(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>): boolean
    /**
     * Compares two _NsNumbers_. Returnes **true** if **_nsNumber1_ == _nsNumber2_**.
     * 
     * @param nsNumber1 - _NSNumber_ instance.
     * @param nsNumber2 - _NSNumber_ instance.
     */
    e(nsNumber1: NSNumber<any>, nsNumber2: NSNumber<any>): boolean

    /**
     * Creates _NumberSystem_ instances.
     * @param digits - Digits array or _IDigitsConfig_ instance to create
     * _NumberSystem_ instance. 
     */
    new <T extends IDigitsConfig | string[]>(digits: T): NumberSystemInstance<T>
}
export interface NumberSystemConstructorPrivate extends NumberSystemConstructor { }



export const NumberSystem: NumberSystemConstructor = (function (): NumberSystemConstructor {
    const NumberSystem: NumberSystemConstructorPrivate = function <T extends IDigitsConfig | string[]>(this: NumberSystemPrivate<T>, digits: T) {
        if (!new.target) return new (NumberSystem as any)(digits)

        const NumberSystemInstance: NumberSystemPrivate<T> = (function (): NumberSystemPrivate<T> {
            const NumberSystemInstance: NumberSystemPrivate<T> = function (this: NSNumberPrivate<NumberSystemPrivate<T>>, number: number | string | number[]) {
                if (!new.target) return new (NumberSystemInstance as any)(number)
                Object.defineProperties(this, {
                    system: {
                        value: NumberSystemInstance,
                        writable: true
                    },
                    bigInt: {
                        value: undefined,
                        writable: true
                    },
                    _length: {
                        value: undefined,
                        writable: true
                    },
                    _digitsArr: {
                        value: undefined,
                        writable: true
                    },
                    _digitsMap: {
                        value: {},
                        writable: true
                    },
                    _digitsMapLength: {
                        value: 0,
                        writable: true
                    },
                    _ownKeys: {
                        value: undefined,
                        writable: true,
                    }
                })
                switch (typeof number) {
                    case 'number':
                    case 'string':
                        this.bigInt = JSBI.BigInt(number)
                        break
                    case 'object':
                    default:
                        if (!(number instanceof Array) || !number.length) {
                            number = [0]
                        }
                        const numStr = powersArrToDecimal(number, this.system.base)

                        this.bigInt = JSBI.BigInt(numStr)
                        this._length = number.length
                        this._digitsArr = [...number]

                        this._digitsMap = undefined
                        this._digitsMapLength = undefined
                        break
                }
                return new Proxy(this, {
                    has: function (target, p) {
                        if (typeof p === 'symbol' || isNaN(+p)) {
                            return p in target
                        }
                        return +p >= 0 && target.length > +p
                    },
                    ownKeys: function (target) {
                        if (!target._ownKeys) {
                            const originalOwnKeys = Reflect.ownKeys(target)
                            target._ownKeys = [...originalOwnKeys, ...[...Array(target.length)].map((_, i) => i + '')]
                        }
                        return target._ownKeys
                    },
                    getOwnPropertyDescriptor: function (target, p) {
                        if (typeof p === 'symbol' || isNaN(+p)) {
                            return Reflect.getOwnPropertyDescriptor(target, p)
                        }
                        return { configurable: true, enumerable: true, value: undefined, writable: false }
                    },
                })
            } as any
            Object.defineProperties(NumberSystemInstance.prototype, {
                [Symbol.iterator]: {
                    value: function* (this: NSNumberPrivate<NumberSystemPrivate<T>>) {
                        const powGen = this.digPowGenerator(0)
                        for (const pow of powGen) {
                            yield new this.system(pow)
                        }
                    },
                },
                mapToArr: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>,) {
                        if (this._digitsMapLength === this._length) {
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
                digGenerator: {
                    value: function* (this: NSNumberPrivate<NumberSystemPrivate<T>>, start: number, end?: number, step?: number) {
                        const powGen = this.digPowGenerator(start, end, step)
                        for (const pow of powGen) {
                            yield new this.system(pow)
                        }
                    }
                },
                digPowGenerator: {
                    value: function* (this: NSNumberPrivate<NumberSystemPrivate<T>>, start: number, end?: number, step?: number) {
                        const length = this.length
                        if (end === undefined) end = length - 1
                        if (step === undefined) step = 1

                        if (start < 0) start = 0
                        if (end < 0) end = 0
                        if (step < 0) step = 1

                        if (start >= length) start = length - 1
                        if (end >= length) end = length - 1

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
                                let lastBaseExp = JSBI.exponentiate(baseBigInt, JSBI.BigInt(length - start))

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
                                let exp = length - start

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

                        const length = this.length
                        if (position >= length) {
                            return undefined
                        }

                        const base = this.system.baseBigInt
                        const baseExp = JSBI.exponentiate(base, JSBI.BigInt(length - position))
                        const numRight = JSBI.remainder(this.bigInt, baseExp)

                        const digit = JSBI.toNumber(JSBI.divide(numRight, JSBI.divide(baseExp, base)))
                        this._digitsMap![position] = digit
                        this._digitsMapLength!++

                        return digit
                    }
                },
                getDigit: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, position: number) {
                        const pow = this.getPower(position)
                        if (pow === undefined) return undefined

                        return new this.system(pow)
                    }
                },
                length: {
                    get: function (this: NSNumberPrivate<NumberSystemPrivate<T>>) {
                        if (!this._length) {
                            const base = this.system.baseBigInt

                            let divideNumber = JSBI.divide(this.bigInt, base)
                            let length = 1
                            while (!JSBI.equal(divideNumber, JSBI.BigInt(0))) {
                                length++
                                divideNumber = JSBI.divide(divideNumber, base)
                            }
                            this._length = length
                        }
                        return this._length
                    },
                    set: () => { }
                },
                add: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, nsNumber: NSNumberPrivate<any> | string | number) {
                        const sys = this.system
                        const operand = NumberSystem.isNumber(nsNumber) ? (nsNumber as NSNumberPrivate<any>).bigInt : JSBI.BigInt(nsNumber)
                        const resultBigInt = JSBI.add(this.bigInt, operand)

                        if (JSBI.lessThan(resultBigInt, JSBI.BigInt(0))) {
                            return undefined
                        }
                        return new sys(resultBigInt.toString())
                    }
                },
                subtract: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, nsNumber: NSNumberPrivate<any>) {
                        const sys = this.system
                        const operand = NumberSystem.isNumber(nsNumber) ? (nsNumber as NSNumberPrivate<any>).bigInt : JSBI.BigInt(nsNumber)
                        const resultBigInt = JSBI.subtract(this.bigInt, operand)

                        if (JSBI.lessThan(resultBigInt, JSBI.BigInt(0))) {
                            return undefined
                        }
                        return new sys(resultBigInt.toString())
                    }
                },
                remainder: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, nsNumber: NSNumberPrivate<any>) {
                        const sys = this.system
                        const operand = NumberSystem.isNumber(nsNumber) ? (nsNumber as NSNumberPrivate<any>).bigInt : JSBI.BigInt(nsNumber)

                        if (JSBI.equal(operand, JSBI.BigInt(0))) {
                            return undefined
                        }
                        const resultBigInt = JSBI.remainder(this.bigInt, operand)

                        return new sys(resultBigInt.toString())
                    }
                },
                multiply: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, nsNumber: NSNumberPrivate<any>) {
                        const sys = this.system
                        const operand = NumberSystem.isNumber(nsNumber) ? (nsNumber as NSNumberPrivate<any>).bigInt : JSBI.BigInt(nsNumber)

                        if (JSBI.lessThan(operand, JSBI.BigInt(0))) {
                            return undefined
                        }
                        const resultBigInt = JSBI.multiply(this.bigInt, operand)

                        return new sys(resultBigInt.toString())
                    }
                },
                divide: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>, nsNumber: NSNumberPrivate<any>) {
                        const sys = this.system
                        const operand = NumberSystem.isNumber(nsNumber) ? (nsNumber as NSNumberPrivate<any>).bigInt : JSBI.BigInt(nsNumber)

                        if (JSBI.lessThanOrEqual(operand, JSBI.BigInt(0))) {
                            return undefined
                        }
                        const resultBigInt = JSBI.divide(this.bigInt, operand)

                        return new sys(resultBigInt.toString())
                    }
                },
                increment: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>) {
                        return this.add(1)
                    }
                },
                decrement: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>) {
                        return this.subtract(1)
                    }
                },
                toNumber: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>) {
                        return JSBI.toNumber(this.bigInt)
                    }
                },
                toString: {
                    value: function (this: NSNumberPrivate<NumberSystemPrivate<T>>) {
                        const powGen = this.digPowGenerator(0, this.length - 1)

                        let numStr = ''
                        if (isDigitsConfig(this.system.digits)) {
                            for (const pow of powGen) {
                                const charMassive = this.system.digits.digGen(pow)
                                numStr += charMassive[0]
                            }
                            return numStr
                        } else {
                            const digCharArr = this.system.digits as string[]
                            for (const pow of powGen) {
                                numStr += digCharArr[pow]
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

            NumberSystemInstance.prototype = new Proxy(NumberSystemInstance.prototype, {
                get: function (target, p, reciver) {
                    if (typeof p === 'symbol' || isNaN(+p)) {
                        return Reflect.get(target, p, reciver)
                    }
                    return reciver.getDigit(+p)
                }
            })
            return NumberSystemInstance
        })()
        Object.setPrototypeOf(NumberSystemInstance, NumberSystem.prototype)

        Object.defineProperties(NumberSystemInstance, {
            digits: {
                value: undefined,
                writable: true,
            },
            base: {
                value: undefined,
                writable: true,
            },
            baseBigInt: {
                value: undefined,
                writable: true,
            },
            _minInRankMap: {
                value: undefined,
                writable: true,
            },
            _maxInRankMap: {
                value: undefined,
                writable: true,
            },
        })

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
        numberGenerator: {
            value: function* (this: NumberSystemPrivate<any>, start: NSNumberPrivate<any>, end?: NSNumberPrivate<any>, step?: NSNumberPrivate<any>) {
                if (!NumberSystem.isNumber(step)) {
                    step = new this(1) as NSNumberPrivate<any>
                }

                let sumBigInt = start.bigInt
                if (!end) {
                    while (true) {
                        yield new this(sumBigInt.toString())

                        sumBigInt = JSBI.add(sumBigInt, step.bigInt)
                    }
                } else if (NumberSystem.le(start, end)) {
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
                    rank = 1
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
                    rank = 1
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
        isNumber: {
            value: function (obj: any) {
                if (obj instanceof Object
                    && Object.getPrototypeOf(obj).constructor
                    && Object.getPrototypeOf(Object.getPrototypeOf(obj).constructor) === NumberSystem.prototype) {
                    return true
                }
                return false
            }
        },
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
                return JSBI.notEqual(nsNumber1.bigInt, nsNumber2.bigInt)
            }
        },
        e: {
            value: (nsNumber1: NSNumberPrivate<any>, nsNumber2: NSNumberPrivate<any>) => {
                return JSBI.equal(nsNumber1.bigInt, nsNumber2.bigInt)
            }
        },
    })

    return NumberSystem
})()