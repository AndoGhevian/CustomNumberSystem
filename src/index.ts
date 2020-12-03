export { default as CharGroup } from './CharGroup'
export {
    CharGroupInstance,
    CharGroupConstructor,
} from './CharGroup'

export {
    isNsNumber,
    NSNumber,
    NumberSystemInstance,
    NumberSystemConstructor,
} from './NumberSystem'
export { default as NumberSystem } from './NumberSystem'

export {
    IDigitsConfig,
} from './commonTypes'













// import NumberSystem, { isNsNumber } from './NumberSystem'
// const sys = new NumberSystem(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
// new sys(1)
// const num = sys(`173`)
// console.log(
//     isNsNumber([])
// )

// for (const pow of num.digPowGenerator(8, 1, 2)) {
//     console.log(pow)
// }








// export * from './NSNumber'

// import { CharGroup } from './CharGroup'
// import { IDigitsConfig } from './commonTypes'
// import { NSNumber } from './NSNumber'
// import { NumberSystem } from './NumberSystem'


// // const sys = new NumberSystem(['a', 'b'])
// // const num = sys.Number(9)

// // for(const digPow of num.digitPowersGenerator({
// //     startPosition: 90,
// //     accumulator: -1,
// //     endPosition: 10
// // })()) {
// //     console.log(digPow)
// // }

// // for(const digPow of sys.nsNumberGenerator(sys.Number(10), {
// //     endNsNumber: sys.Number(9),
// //     accumulator: -1,
// //     excludeEnd: true
// // })()) {
// //     console.log(digPow.bigInt.toString())
// // }
// const sys = new NumberSystem(['a', 'b'])

// const num1 = sys.Number(0) // argument is in decimal form.
// const num2 = sys.Number(20) // same as binary - 10100.
// const bigNum = sys.Number('12345678901234567890') 

// console.log(
//     num1.toString(),
//     num2.toString(),
//     sys.Number('12345678901234567890').toString()
// )

// // NSNumber.equal()