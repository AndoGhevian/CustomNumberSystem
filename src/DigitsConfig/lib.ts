import { IDigitsConfig } from '../commonTypes'
import {
    isDigitsConfig
} from '../utils'


/**
 * Returnes mixed IDigitsConfig with _dinamicArity_. (See IDigitsConfig for more details)
 * @param mixture - Comma separated list of:
 * - numbers: **MUST** be Unicode code point,
 * - number ranges - [number, number]: **MUST** be Unicode code points range,
 * - strings: **CAN** contain surrogate pairs.
 * - char ranges - [char, char]: First Unicode cahracter will be taken
 * if more than one character apeares in string. **CAN** contain surrogate pairs.
 * Surrogate Paires considered as single characters.
 * - IDigitsConfig: For More ditails **See IDigitsConfig**.
 */
export const digitsConfigMixer = function (...mixture: ([number, number] | [string, string] | number | string | IDigitsConfig)[]): IDigitsConfig {
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
                if (isDigitsConfig(item)) {
                    const sysDigConf = item
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
                if (pow < 0 || pow >= this.maxBase) {
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

            return powers.map((_, powIndex) => {
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