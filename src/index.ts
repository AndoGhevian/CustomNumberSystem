export {
    CharGroupInstance,
    CharGroupConstructor,
    CharGroup,
} from './CharGroup'

export {
    NSNumber,
    NumberSystemInstance,
    NumberSystemConstructor,
    NumberSystem,
} from './NumberSystem'

export {
    digitsConfigMixer,
    isDigitsConfig,
} from './utils'

export {
    IDigitsConfig,
} from './commonTypes'


// import JSBI from 'jsbi'
// import {
//     NumberSystem
// } from './NumberSystem'

// console.log(
//     JSBI.divide(JSBI.BigInt(10), JSBI.BigInt(-1)).toString()
// )



// const sys_10 = new NumberSystem(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
// const sys_2 = new NumberSystem(['0', '1'])

// const dec = 1123
// const num = sys_10(dec)

// console.log(
//     '1111' in num
// )

// for (const index in num) {
//     console.log(num[index].toNumber())
// }


// // console.log((num as any).hasOwnProperty('_length'))
// // for() {
// //     let num = num.increment()
// // }

// // console.log(num[0].increment())
// // console.log(
// //     1 in num
// // )



// // // console.log(
// // //    NumberSystem.e(sys_2(1), sys_10(1)),
// // // )

// // // for(const dig of num) {
// // //     console.log(dig.toString())
// // // }