import { IDigitsConfig } from "../../commonTypes"


export interface CharGroupInstance extends IDigitsConfig { }
export interface CharGroupPrivate extends CharGroupInstance {
    maxBase: number
    dinamicArity?: boolean
    /**
     * Chars array of string provided to constructor.
     */
    charArr: string[]
}


export interface CharGroupConstructor {
    /**
     * Creates IDigitsConfig instance from visual characters of string to use when creating _NumberSystems_.
     * @param chars - string containing at least 2 characters.
     */
    (chars: string): CharGroupInstance
    /**
     * Creates IDigitsConfig instance from visual characters of string to use when creating _NumberSystems_.
     * @param chars - string containing at least 2 characters.
     */
    new(chars: string): CharGroupInstance
}



export const CharGroup: CharGroupConstructor = (function (): CharGroupConstructor {
    const CharGroup = function (this: CharGroupPrivate, chars: string) {
        if (!new.target) return new (CharGroup as any)(chars)

        if (typeof chars !== 'string') chars = ''
        this.base = 0
        this.dinamicArity = true
        this.charArr = []

        for (const char of chars) {
            this.charArr[this.base] = char
            this.base++
        }

        this.maxBase = this.base
    } as CharGroupConstructor

    Object.defineProperty(CharGroup.prototype, 'digGen', {
        value: function digGen(this: CharGroupPrivate, ...powers: number[]) {
            const digits: (string | undefined)[] = []
            for (let powIndex = 0; powIndex < powers.length; powIndex++) {
                digits[powIndex] = this.charArr[powers[powIndex]]
            }
            return digits
        }
    })
    return CharGroup
})()