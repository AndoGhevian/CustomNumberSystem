import Joi from 'joi'
import JSBI from 'jsbi'
import { NSNumber } from './NSNumber'
import { NumberSystem } from './NumberSystem'
import { constructDefaultsSchema } from './utils'
import { opSchema } from './validations/NumberSystemValidations'

export * from './commonTypes'
export * from './NSNumber'
export * from './NumberSystem'



const sys3 = new NumberSystem([
    'a', 'ac', 'c'
], true)

const sys10 = new NumberSystem([
    'a', 'b', 'c', 'd', 'e', 'f', 't', 'y', 'u', 'p'
], true)


const number = sys10.Number('11', true)
console.log(sys3.toString(number))


console.log(
    JSBI.divide(
        JSBI.BigInt(11),
        JSBI.BigInt(12)
    ).toString()
)
console.log(
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(11))
        .toString()
)


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