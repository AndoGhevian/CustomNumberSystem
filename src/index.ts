import Joi from 'joi'
import JSBI from 'jsbi'
import { NSNumber } from './NSNumber'
import { NumberSystem } from './NumberSystem'
import { constructDefaultsSchema } from './utils'
import { opSchema } from './validations/NumberSystemValidations'

export * from './commonTypes'
export * from './NSNumber'
export * from './NumberSystem'



// const numSys3 = new NumberSystem([
//     'a', 'ac', 'c'
// ], true)

// const numSys10 = new NumberSystem([
//     'a', 'b', 'c', 'd', 'e', 'f', 't', 'y', 'u', 'p'
// ], true)


// const number = numSys10.Number('1232131', true)




// // Testing decimalDigsGenerator.
// const res = numSys3.decimalDigsGenerator([1, 0], {
//     options: {
//         accumulator: 2,
//         mode: undefined
//     },
//     b: 'a',
//     accumulator: 2,
// } as any, 0 as any)
// console.log(res)