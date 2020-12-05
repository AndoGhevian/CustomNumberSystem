# CustomNumberSystem
**With This You can flexibly generate strings also**

Welcome to _Customizable Number Systems_ world. You will able to customize your system characters.
Easily make Transitions and Generate Numbers of any System. By the way, this library referres only to **nonnegative integers**.

> NOTE: All objects in this library are **immutable**.

Ok, Lets See if it meets your requirements.

## Usage
Lets create NumberSystem with digits `['a', 'b', 'c']`, (power of each digit equal to its index in array):
``` javascript
const { NumberSystem } = require('custom-number-system')

const sys3 = new NumberSystem(['a', 'b', 'c'])
```
In this NumberSystem you can create numbers as big as you wish.
e.g.
``` javascript
const num1 = sys3(1234)
const num2 = sys3('123456789123456789123456789123456789123456789')
```
Remember that whan you create numbers in current NumberSystem by providing number
or string representation of number, they will be considered in **decimal** notation.

You can create number by providing valid powers array, where powers **MUST** be represented by numbers in range **[0, system.base - 1]**.
``` javascript
const num = sys3([ 2, 2, 1, 0, 0 ])
```

Or you can simply convert number from one system to another:
``` javascript
const sys2 = new NumberSystem(['O', 'L'])

const num = sys2(8) // LOOO
const converted = num.toSystem(sys3) // converting...
```

You **CANT** create NumberSystem of base less than 2.

After you create numbers you can manipulate them as you wish.
``` javascript
const sys4 = new NumberSystem(['A', 'B', 'C', 'D'])
const num = sys4(8) // CA

const sys2 = new NumberSystem(['O', 'L'])
const operand = sys2(1) // L

// Result will be number in sys4 system.
const sum = num.add(operand) // CB
const sbtr = num.subtract(1) // A
const mul = num.multiply('1') // CA
const mod = num.remainder(operand) // A
const div = num.divide(1) // CA
```

Theres also **increment** and **decrement** methods at you serivce sir:
```javascript
num.increment() // same as num.add(1)
num.decrement() // same as num.subtract(1)
```
> NOTE:
> 1. If Result is **negative** when using arithmentical operations, **undefined** will be returned.
> 1. When using **divide** method, If **divider** equals to **0**, **undefined** will be returned,
else integer part of division will be taken as result **(when result is negative, see case 1)**.
> 1. When using **remainder** method, if **divider** equals to **0**, **undefined** will be returned,
else **NonNegative** remainder will be taken as result **(when result is negative, see case 1)**.

You can also compare numbers values with static methods of NumberSystem.
``` javascript
NumberSystem.lt(num1, num2) // less than
NumberSystem.le(num1, num2) // less than or equal
NumberSystem.gt(num1, num2) // greater than
NumberSystem.ge(num1, num2) // greater than or equal
NumberSystem.ne(num1, num2) // not equal
NumberSystem.e(num1, num2) // equal
```

You can get digit at appropriate index **( 0 based )** read from left.
``` javascript
const sys3 = new NumberSystem(['0', '1', '2'])

const num = sys3([2, 2, 1, 0, 0])

console.log(
    num[0].toString(), // 2
    num[1].toString(), // 2
    num[2].toString(), // 1
    num[3].toString(), // 0
    num[4].toString(), // 0
)

console.log(num[10]) // undefined
```
> NOTE: For not existing digits **undefined** will be returned.

You can also use **in** operator to check if digit exists at given index:
```javascript
// Continuation of above example.
console.log(
    1 in num // true

    -1 in num // false
    10 in num // false
)
```

You can also iterate through its digits with **for in** and **for of** loops, note
that **for of** loop in this case is much more **faster**.
```javascript
const sys3 = new NumberSystem(['0', '1', '2'])

const num = sys3([2, 2, 1, 0, 0])

for(const index in num) {
    console.log(num[index].toNumber())
}

for(const dig of num) {
    console.log(dig.toNumber())
}

// existing digit indexes
console.log(Object.keys(num)) // [ '0', '1', '2', '3', '4' ]
// existing digits
console.log(Object.values(num).map(dig => dig.toString())) // [ '2', '2', '1', '0', '0' ]
```



You can get **generator of digits** for current number:
``` javascript
const sys3 = new NumberSystem(['0', '1', '2'])

const num = sys3([2, 2, 1, 0, 0])

const start = 0
const end = num.length - 1
const step = 1

const digGen = num.digGenerator(start, end, step)
for(const dig of digGen) {
    console.log(dig.toNumber())
}
// Will be printed:
// 2
// 2
// 1
// 0
// 0
```
> NOTE:
> - You can omit **_end/step_** then they will be set to **_(num.length - 1)/1_** appropriately.
> - If **start** or **end** less than **0**, then **0** will be 
used accordingly for **start** or **end**.
> - If **start** or **end** more than **num.length - 1**, then **num.length - 1** will be used accordingly for **start** or **end**.
> - If **step** less or equal than **0** then **1** will be used as **step**.

You can get **generator of numbers** of NumberSystem instance.
``` javascript
const sys2 = new NumberSystem(['0', '1'])
const sys3 = new NumberSystem(['a', 'b', 'c'])

// start, end, step can be numbers of any system.
const start = sys2(10)
const end = sys3(100)
const step = sys2(1)

const numGen = sys3.numberGenerator(start, end, step)

for(const num3 of numGen) {
    console.log(num3.toString())
}
```
> NOTE:
> - If you **omit end**, generator will continue infinitely.
> - If you **omit step**, it will be set to **1**.
> - If **start** or **end** less than **0**, then **0** will be 
used accordingly for **start** or **end**.
> - If **step** less or equal than **0** then **1** will be used as **step**.

You can get minimum or maximum numbers in **rank**:
```javascript
const sys3 = new NumberSystem(['0', '1', '3'])

console.log(sys3.minInRank(3).toString()) // 100
console.log(sys3.maxInRank(3).toString()) // 333
```
> NOTE: 
> - If rank is less than **1**, then **1** will be used as rank.

Now note that **Numbers** are instances of only their **constructor NumberSystemInstances**, and **NumberSystemInstances** are instances of **NumberSystem**.
```javascript
const sys2 = new NumberSystem(['0', '1'])
const num2 = sys2(1)

const sys3 = new NumberSystem(['a', 'b', 'c'])
const num3 = sys3(1)

console.log(num2 instanceof sys2) // true
console.log(num3 instanceof sys3) // true
console.log(num2 instanceof sys3) // false

console.log(sys2 instanceof NumberSystem) // true
console.log(sys3 instanceof NumberSystem) // true
```

You can check if some value is number instance.
```javascript
const { NumberSystem } = require('custom-number-system')

const sys = new NumberSystem(['0', '1'])
const num = sys2(1)

console.log(NumberSystem.isNumber(num)) // true
console.log(NumberSystem.isNumber(1)) // false
```

## Advanced
You can use instead of digits array, an object that implements _IDigitsConfig_:
```javascript
interface IDigitsConfig {
    base: number,
    readonly maxBase: number
    digGen: (this: IDigitsConfig, ...powers: number[]) => (string | undefined)[],
    readonly dinamicArity?: boolean,
}
```
Here digGen method binded to current object. It's must guarantee
that it will return digit for all **powers** from **0** to **maxBase**.

The only modifiable property is **base**.
You can change **base** between **2** and **maxBase**,
when you pass config to NumberSystem constructor, **base** will be fixed, 
and only digits in range **[0, base]** will be used.

Interface also define that powers not in range **[0, maxBase]** must return
**undefineds**.

**dinamicArity** defines if you can pass multiple powers to **digGen**.
> NOTE: **digGen** always return an array of digits.

**Example 1** is CharGroup constructor which will
give you **digitsConfig** of visible characters:
```javascript
const { CharGroup } = require('custom-number-system')

const charGroup = CharGroup('ab$cd🌐')

console.log(
    charGroup.maxBase,
    charGroup.digGen(-1, 0,1,2,3,4,5,6)
)
// Will be printed:
// 6, [ undefined, 'a', 'b', '$', 'c', 'd', '🌐', undefined ]
```

**Example 2** is digitsConfigMixer utility function:
```javascript
const { digitsConfigMixer } = require('custom-number-system')

const digitsConfig = digitsConfigMixer([97,122], ['A', 'Z'], 'Blablabla', 97, CharGroup('ab$cde🌐'))
```
This digitsConfig includes(starting from power 0) symbols:
- **[97, 122]**: from **'a'** to **'z'**
- **['A', 'Z']**: then from **'A'** to **'Z'**
- **'Blablabla'**: word **'Blablabla'**
- **97**: symbol **'a'**
- **CharGroup('ab$cde🌐')**: symbols **'a', 'b', '$', 'c', 'd', '🌐'**

And you can check if object correctly implements IDigitsConfig interface:
```javascript
const { isDigitsConfig } = require('custom-number-system')

console.log(isDigitsConfig(digitsConfig)) // true
```

All this can also be found in TsDocs.