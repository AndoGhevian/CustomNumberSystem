import JSBI from "jsbi"


/**
 * Represents provided number in given number system.
 */
export class NSNumber {
    readonly ns: NumberSystem = null as any
    readonly bigInt: JSBI = null as any

    private _digitsDecimalRepresentation: number[] = null as any
    get digitsDecimalRepresentation() {
        if (!this._digitsDecimalRepresentation) {
            this._digitsDecimalRepresentation = NumberSystem.decimalToDecimalDigArr(
                this.bigInt.toString(),
                this.ns.base,
                false
            )
        }
        return this._digitsDecimalRepresentation
    }

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
                        this._digitsDecimalRepresentation = number._digitsDecimalRepresentation
                    }
                    break
                }
                if (number instanceof Array) {
                    const numStr = NumberSystem.decimalDigArrToDecimal(number, this.ns.base, false)

                    this.bigInt = JSBI.BigInt(numStr)
                    this._digitsDecimalRepresentation = [...number]
                    break
                }
        }
    }

    /**
     * Converts _NSNumber_ to another system _NSNumber_
     * @param ns - _NumberSystem_ to convert to.
     * @param validate - Defines if to validate arguments.
     * 
     * **Default _false_**
     */
    toSystem(ns: NumberSystem, validate?: boolean) {
        const validArgs = validateArguments({ ns, validate }, toSystemSchema)
        ns = validArgs.ns

        return ns.Number(this, false)
    }


}


import { NumberSystem } from "../NumberSystem"

// validation related imports
import { validateArguments } from "../utils"
import {
    NSNumberSchema,
    toSystemSchema,
} from "../validations/NSNumberValidations"