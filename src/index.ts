import Joi from 'joi'
import JSBI from 'jsbi'
import { NSNumber } from './NSNumber'
import { NumberSystem } from './NumberSystem'
import { constructDefaultsSchema } from './utils'
import { opSchema } from './validations/NumberSystemValidations'

export * from './commonTypes'
export * from './NSNumber'
export * from './NumberSystem'


import * as tests from './tests'
tests.numbersAndDigitsGeneration()
// const sys30 = new NumberSystem([
//     '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
//     '0a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a',
//     '0b', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b',
// ], {}, true)

// const sys2 = new NumberSystem([
//     '0', '1'
// ], {}, true)

// const sys10 = new NumberSystem([
//     '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
// ], {}, true)

// // ____________________________________________________________
// const gen = sys30.Number('12').decDigitsGenerator()
// let digStr = ''
// for (let dig of gen()) {
//     digStr += dig
// }
// console.log(digStr)
// // ____________________________________________________________