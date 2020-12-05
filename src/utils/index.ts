import JSBI from 'jsbi'
import { IDigitsConfig } from '../commonTypes'


/**
 * Converts _powers_ array of given _base_ to decimal number string representation.
 * @param powers - _Powers_ array of given _base_. _Powers_ **MUST** be array of
 * nonnegative integers less than _base_.
 * @param base - _Base_ in which to consider given _powers_ array. _base_ **MUST** be integer more than 1.
 */
export function powersArrToDecimal(powers: number[], base: number) {
    const baseBigInt = JSBI.BigInt(base)
    let sumBigInt = JSBI.BigInt(0)
    for (const pow of powers) {
        const powBigInt = JSBI.BigInt(pow)
        sumBigInt = JSBI.add(JSBI.multiply(sumBigInt, baseBigInt), powBigInt)
    }
    return sumBigInt.toString()
}

/**
 * Checks if provided object satisfies **IDigitsConfig** interface
 * @param obj - obj to check if it is satisfy **IDigitsConfig** interface.
 */
export function isDigitsConfig(obj: any): obj is IDigitsConfig {
    if (!(obj instanceof Object)) return false
    if (typeof obj.maxBase !== 'number' || obj.maxBase < 2) return false
    if (typeof obj.base !== 'number' || obj.base < 2 || obj.base > obj.maxBase) return false
    if (typeof obj.digGen !== 'function') return false

    return true
}

/**
 * Checks if number is non negative integer(or its string representation)
 * @param val - value to check.
 */
export function isNonNegativeInt(val: string | number) {
    const valStr = val + ''
    const intPart = parseInt(valStr)
    if(isNaN(intPart) || intPart < 0 || (intPart + '') !== valStr) {
        return false
    }
    return true
}