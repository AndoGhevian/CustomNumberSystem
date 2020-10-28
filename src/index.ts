import Joi from 'joi'
import JSBI from 'jsbi'
import { NSNumber } from './NSNumber'
import { NumberSystem } from './NumberSystem'
import { constructDefaultsSchema } from './utils'
import { opSchema } from './validations/NumberSystemValidations'

export * from './commonTypes'
export * from './NSNumber'
export * from './NumberSystem'

// // Testing add
// const sys1 = new NumberSystem(['a', 'b'])
// const sys2 = new NumberSystem(['h', 'j', 'k'])
// const sys3 = new NumberSystem(['r', 't', 'y', 'u'])
// const num1 = new NSNumber(sys1, 10)
// const num2 = new NSNumber(sys2, '10')
// console.log(
//     sys2.toString(sys3.add(num1, num2).toSystem(sys1))
// )


// // Testing incrementDecimalDigsArr
// console.log('as')
// console.log(
//     sys2.incrementDecimalDigsArr([2, 0, 0, 2,2], 0)
// )
// console.log(
//     sys2.incrementDecimalDigsArr([2, 0, 0, 2,2], 1)
// )
// console.log('a')
// console.log(
//     sys2.addToDecimalDigsArr([2, 0, 0, 2, 2], 10)
// )
// const number = new NSNumber(sys2, [2, 0, 0, 2, 2])
// console.log(number)
// console.log(JSBI.BigInt(Number.MAX_SAFE_INTEGER).toString())
// console.log(new NSNumber(sys2, sys2.addToDecimalDigsArr([2, 0, 0, 2, 2], Number.MAX_SAFE_INTEGER, true)).bigInt.toString())
// console.log('b')

const sys1 = new NumberSystem(['a', 'b'])
// const schema = constructDefaultsSchema({
//     options: {
//         endDecimalArr: null,
//         accumulator: 1,
//         array: [1,2,4]
//     },
//     validate: false
// })
// const res = schema.validate({
//     hjsadk: 'asa',
//     validate: {},
//     options: {
//         endDecimalArr: [],
//         accumulator: 2,
//         gh: {1: 8},
//         array: undefined
//     }
// })

const res = sys1.decimalDigsGenerator([1, 0], {
    options: {
        accumulator: 2,
        mode: 'a'
    },
    b: 'a',
    accumulator: 2,
} as any, 0 as any)
console.log(res)

// const schema = Joi.object({
//     optional: Joi.alternatives()
//         .conditional(
//             Joi.object(),
//             {
//                 then: Joi.object({
//                     key: Joi.any().default(1)
//                 }).default(),
//                 otherwise: Joi.any()
//             }
//         )
// })


// console.log(
//     schema.validate({
//         optional: null
//     })
// )