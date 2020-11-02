import Joi from 'joi'
import JSBI from 'jsbi'
import { NSNumber } from './NSNumber'
import { NumberSystem } from './NumberSystem'
import { constructDefaultsSchema } from './utils'
import { opSchema } from './validations/NumberSystemValidations'

export * from './commonTypes'
export * from './NSNumber'
export * from './NumberSystem'



const sys30 = new NumberSystem([
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    '0a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a',
    '0b', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b',
], {}, true)

const sys10 = new NumberSystem([
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
], {}, true)

const gen = sys10.Number(1).decDigitsGenerator()
let digStr = ''
for (let dig of gen()) {
    digStr += dig
}
// const banchmarkNumber = 10000
// let sumTime = 0
// let count = 0
// for (let i = 1; i <= banchmarkNumber; i++) {
//     const now = Date.now()
//     // const gen = sys30.Number('1234567894123467202613416430').decDigitsGenerator()
//     const gen = sys10.Number(i).decDigitsGenerator()
//     let digCount = 0
//     let digStr = ''
//     for (let dig of gen()) {
//         digStr += dig
//     }
//     console.log(digStr)



//     // console.log(
//     //     sys10.Number('1234567894123467202613416430').countDigits(),
//     //     '1234567894123467202613416430'.length
//     // )
//     sumTime += Date.now() - now
//     count++
// }

// console.log(`sumTime: ${sumTime} ms`)
// console.log(`count: ${count}`)
// console.log(`averageTime: ${sumTime / count} ms`)