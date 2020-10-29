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