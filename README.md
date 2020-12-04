# CustomNumberSystem
**V3.0.0**

**With This You can flexibly generate strings also**

Welcome to _Customizable Number Systems_ world. You will able to customize your system characters.
Easily make Transitions and Generate Numbers of any System. By the way, this library referres only to **nonnegative integers**.


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

You cant create NumberSystem of base less than 2.

After you create numbers you can manipulate them as you wish.
``` javascript
const sys4 = new NumberSystem(['A', 'B', 'C', 'D'])
const num = sys4(8) // CA

const sys2 = new NumberSystem(['O', 'L'])
const operand = sys2(1) // L

// Result will be number in sys4 system.
const sum = num.add(operand) // CB
const sbtr = num.subtract(operand) // A
const mul = num.multiply(operand) // CA
const mod = num.remainder(operand) // A
const div = num.divide(operand) // CA
```

You can find all arithmetical operations on number instance.
> NOTE: 
> - When using **subtract** method, If number less than _ArgumentNumber_, result will be **undefined**.
> - When using **divide** method, If number less than _ArgumentNumber_, result will be **number.system(0)**.

You can also compare numbers values with static methods of NumberSystem.
``` javascript
NumberSystem.lt(num1, num2) // less than
NumberSystem.le(num1, num2) // less than or equal
NumberSystem.gt(num1, num2) // greater than
NumberSystem.ge(num1, num2) // greater than or equal
NumberSystem.ne(num1, num2) // not equal
NumberSystem.e(num1, num2) // equal
```

Or check if they are equal both by system instances and values.
```javascript
const sys4 = new NumberSystem(['A', 'B', 'C', 'D'])
const sys2 = new NumberSystem(['O', 'L'])
const sys2Another = new NumberSystem(['O', 'L'])

sys2(1).equals(sys2(1)) === true

sys2(1).equals(sys4(1)) === false
sys2(1).equals(sys2Another(1)) === false
```

You can get digit at appropriate index **( 0 based )** read from left.
``` javascript
const sys3 = new NumberSystem(['0', '1', '2'])

const num = sys3([2, 2, 1, 0, 0])

console.log(
    num.getDigit(0).toString(), // 2
    num.getDigit(1).toString(), // 2
    num.getDigit(2).toString(), // 1
    num.getDigit(3).toString(), // 0
    num.getDigit(4).toString(), // 0
)

console.log(num.getDigit(10)) // undefined
```
> NOTE: For not existing digits **undefined** will be returned.

You can get **generator of digits** for current number:
``` javascript
const sys3 = new NumberSystem(['0', '1', '2'])

const num = sys3([2, 2, 1, 0, 0])

const start = 0
const end = num.digitsCount - 1
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
> - You can omit **_end/step_** then they will be set to **_(num.digitsCount - 1)/1_** appropriately.
> - If **start** or **end** less than **0**, then **0** will be 
used accordingly for **start** or **end**.
> - If **start** or **end** more than **num.digitsCount - 1**, then **num.digitsCount - 1** will be used accordingly for **start** or **end**.
> - If **step** less or equal than **0** then **1** will be used as **step**.

You can iterate through number digits using **for of** on number instances:
```javascript
const sys3 = new NumberSystem(['0', '1', '2'])

const num = sys3([2, 2, 1, 0, 0])
for(const dig of num) {
    console.log(dig.toNumber())
}
```

You can get Generator of numbers of NumberSystem instance.
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

You can get minimum or maximum numbers in rank:
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