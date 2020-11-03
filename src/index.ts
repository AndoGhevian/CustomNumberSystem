import Joi from 'joi'
import JSBI from 'jsbi'
import { NSNumber } from './NSNumber'
import { NumberSystem } from './NumberSystem'
import { constructDefaultsSchema } from './utils'
import { opSchema } from './validations/NumberSystemValidations'

export * from './commonTypes'
export * from './NSNumber'
export * from './NumberSystem'


// function* combination() {
//     let index = yield '10length'

//     if (index !== undefined) {
//         console.log('iterate by index')
//         while (true) {
//             index = yield index + ' elem'
//         }
//     }

//     console.log('iterate all')
//     index = 0
//     while (index < 10) {
//         yield index + ' elem'
//         index++
//     }
// }

// function* f() {
//     let index = yield '10length'

//     while (true) {
//         index = yield index + ' elem'
//     }
// }

// function* g() {
//     yield '10length'

//     let index = 0
//     while (index < 9) {
//         yield index + ' elem'
//         index++
//     }
// }

// const gen = combination()
// const length = gen.next()
//     console.log(gen.next(10))
//     console.log(gen.next(19))