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


// import {
//     NumberSystem
// } from './NumberSystem'

// const sys = new NumberSystem(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
// const sys2 = new NumberSystem(['0', '1'])
// const dec = 1212
// const num = sys(dec)
// num.

// console.log(num.toSystem(sys2).toString() === dec.toString(2))

// for (const num of sys2.numberGenerator(sys('111111111111111111111111111111111111111111111111111111111111111111111111111'), sys('111111111111111111111111111111111111111111111111111111111111111111111111122'))) {
//     console.log(num.toNumber())
// }