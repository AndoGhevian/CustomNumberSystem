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