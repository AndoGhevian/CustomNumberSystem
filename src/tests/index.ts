import {
    NumberSystem
} from '../index'

export const numbersAndDigitsGeneration = () => {
    // ____________________________________________________________
    /**
     * You can concatenate this string to multiply number length.
     * 
     * **LENGTH: 50**
     */
    console.log('testing performance for Generating numbers and iterating through their digits.')
    const stringConcatPattern: string = '62333471232314544677534898372000000000012321000000'
    const stringForConcat: string = stringConcatPattern + stringConcatPattern
    /**
     * This number will be concatenated from left of generated numbers.
     */
    const leftConcatStart: number = 1
    /**
     * This number will be concatenated from left of generated numbers.
     */
    const leftConcatEnd: number = 100000

    const sys = new NumberSystem([
        '0', '1'
    ], {}, true)
    let sumTime = 0
    let count = 0
    let maxDigitsCount = 0
    for (let i = leftConcatStart; i <= leftConcatEnd; i++) {
        const now = Date.now()

        const nsNumber = sys.Number(i + stringForConcat)

        const gen = nsNumber.decDigitsGenerator()
        let digStr = ''
        for (let dig of gen()) {
            digStr += sys.digits[dig as any]
        }
        if (nsNumber.countDigits() > maxDigitsCount) {
            maxDigitsCount = nsNumber.countDigits()
        }
        sumTime += Date.now() - now
        count++
    }
    console.log(`
    range: [ ${leftConcatStart}, ${leftConcatEnd} ]
    systemBase: ${sys.base}
    min-max NumberLengthInDecimal: [ ${('' + leftConcatStart).length + stringForConcat.length}, ${('' + leftConcatEnd).length + stringForConcat.length} ]
    max DigitsCountInBase: ${maxDigitsCount}
    sumTime: ${sumTime} ms
    numbers count: ${count}
    averageTime for iterating digits: ${sumTime / count} ms
    `)
    // ____________________________________________________________
}