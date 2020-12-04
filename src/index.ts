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


import {
    NumberSystem
} from './NumberSystem'

// const sys2 = new NumberSystem(['0', '1', '2', '3'])
// const sys10 = new NumberSystem(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])

// const dec = 10012
// const num2 = sys2(dec)
// const num10 = sys10(dec)

// const index = 0
// console.log(num2.toString() === dec.toString(4))
// console.log()

// for(const dig of num2.digGenerator(Infinity, 0, 6)) {
//     console.log(dig.toString())
// }
// console.log()

// let i = 0
// for(const dig of num2) {
//     console.log(dig.toString() === dec.toString(4)[i++])
// }
// console.log(dec.toString()[i])