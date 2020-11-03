// import { validateArguments } from "./validationUtils"

// /**
//      * **WARNING: This is Experimental, but currently it works!!!**
//      * 
//      * Add give number to provided with decimal digits array number in current _NumberSystem_.
//      * @param decimalDigsArr - number given in decimal digits array in current _NumberSystem_.
//      * @param number - addition number. Must be non negative.
//      * @param validate - Defines if to validate arguments.
//      * 
//      * **Default - _false_**
//      */
//     export function addToDecimalDigsArr(decimalDigsArr: number[], number: number, validate?: boolean) {
//         const validArgs = validateArguments(
//             {
//                 decimalDigsArr,
//                 number,
//                 validate
//             },
//             addToDecimalDigsArrSchema,
//             { base: this.base }
//         )
//         decimalDigsArr = validArgs.decimalDigsArr
//         number = validArgs.number as number

//         const base = this.base

//         const endPortionReversed: number[] = []
//         let lastSurplus = 0
//         let index = decimalDigsArr.length - 1
//         while (!(lastSurplus === 0 && number === 0)) {
//             const currDig = index >= 0 ? decimalDigsArr[index] : 0
//             const remainder = base - currDig - lastSurplus

//             if (remainder === 0) {
//                 lastSurplus = 1
//                 const rmd = number % base
//                 if (index >= 0) {
//                     decimalDigsArr[index] = rmd
//                 } else {
//                     endPortionReversed.push(rmd)
//                 }
//                 number = (number - rmd) / base
//             } else {
//                 const sbtr = number - remainder
//                 if (sbtr < 0) {
//                     lastSurplus = 0
//                     if (index >= 0) {
//                         decimalDigsArr[index] = base - remainder + number
//                     } else {
//                         endPortionReversed.push(base - remainder + number)
//                     }
//                     number = 0
//                 } else {
//                     lastSurplus = 1
//                     const rmd = sbtr % base
//                     if (index >= 0) {
//                         decimalDigsArr[index] = rmd
//                     } else {
//                         endPortionReversed.push(rmd)
//                     }
//                     number = (sbtr - rmd) / base
//                 }
//             }
//             index--
//         }

//         decimalDigsArr.splice(0, 0, ...endPortionReversed.reverse())
//         return decimalDigsArr
//     }



// /**
//  * Returns number in digits system of _systemChars_ corresponding to provided
//  * digits positions array _digPosArray_.
//  * @param digPosArray - Defines which characters from provided system should placed
//  * in appropriate place of created number. Array elems must be integers.
//  * 
//  * NOTE: 
//  * - If provided integer is >= _systemChars.length_ Or < _0_ then
//  * remainder of "_int / systemChars.length_" will be taken.
//  * - If some of positions provided in _digPosArray_ are not integers
//  * logical error will be met.
//  * @param systemChars - Defines system to create numbers within. ( digits of system )
//  * @returns array representing number.
//  */
// export function numberOfSystem(digPosArray: number[], systemChars: string[]) {
//     return digPosArray.reduce((acc, cur) => {
//         const remainder = cur % systemChars.length
//         if (remainder >= 0) {
//             return acc + systemChars[remainder]
//         }
//         return acc + systemChars[remainder + systemChars.length]
//     }, '')
// }


// // const val = numberOfSystem([-3,-2,0, -1], ['ab','c', 'd'])
// // console.log(val)







 // // Useful Function for use.
 // /**
    //  * Calculates digits count for number within system with given _base_.
    //  * @param base - Base to calculate digits within. Must be integer greater than _1_.
    //  * @param nsNumber - _NSNumber_ in any system.
    //  * @param validate - Defines if to validate arguments.
    //  * 
    //  * **Default - _false_**
    //  */
    // static countDigits(base: number, nsNumber: NSNumber, validate?: boolean) {
    //     const validArgs = validateArguments({ base, nsNumber, validate }, countDigitsStaticSchema)
    //     base = validArgs.base
    //     nsNumber = validArgs.nsNumber

    //     const sameBase = base === nsNumber.ns.base
    //     if (sameBase) {
    //         return nsNumber.countDigits()
    //     }

    //     const baseBigInt = JSBI.BigInt(base)

    //     let dividedBigInt = nsNumber.bigInt
    //     let digitsCount = 0
    //     do {
    //         digitsCount++
    //         dividedBigInt = JSBI.divide(dividedBigInt, baseBigInt)
    //     } while (!JSBI.equal(dividedBigInt, NumberSystem.ZERO_BIG_INT))

    //     return digitsCount
    // }


    // // For NumberSystem calss
    // /**
    //  * Returns array of digits in provided _base_ for given non negative integer number.
    //  * Digits will be presented as decimals.
    //  * i.e. given number will be converted to _base_ and resulting digits will be presented in array as decimals.
    //  * @param decimal - Non negative Integer( decimal ) number represented eather by Allowed Number or String.
    //  * 
    //  * NOTE: 
    //  * - Allowed number means _number_ < _Number.MAX_SAFE_INTEGER_
    //  * - Any length number can be provided with _string_.
    //  * @param base - Base to calculate digits within.
    //  * i.e. if _base = 16_, digits will be integers of range [0, 15]. Base must be allowed number.
    //  * If string present, it will be converted to allowed number.
    //  * @param validate - Defines if to validate arguments.
    //  * 
    //  * **Default - _false_**
    //  */
    // static decimalToDecDigitsArr(decimal: string, base: number, validate?: boolean): number[]
    // static decimalToDecDigitsArr(decimal: number, base: number, validate?: boolean): number[]
    // static decimalToDecDigitsArr(decimal: any, base: number, validate?: boolean) {
    //     const validArgs = validateArguments({ decimal, base, validate }, decimalToDecDigitsArrSchema)
    //     decimal = validArgs.decimal
    //     base = validArgs.base

    //     const digDecArray = []
    //     let acc = JSBI.BigInt(decimal)
    //     if (JSBI.equal(acc, JSBI.BigInt(0))) {
    //         return [0]
    //     }

    //     const baseBigInt = JSBI.BigInt(base)
    //     for (let mul = baseBigInt; JSBI.GT(acc, 0); mul = JSBI.multiply(mul, baseBigInt)) {
    //         const remainder = JSBI.remainder(acc, mul)

    //         const digitDecNumBigInt = JSBI.divide(remainder, JSBI.divide(mul, baseBigInt))

    //         const digitDecNum = JSBI.toNumber(digitDecNumBigInt)
    //         digDecArray.push(digitDecNum)

    //         acc = JSBI.subtract(acc, remainder)
    //     }
    //     return digDecArray.reverse()
    // }