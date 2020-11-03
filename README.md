# CustomNumberSystem
**With This You can flexibly generate strings also**

Welcome to _Customizable Number Systems_ world. You will able to customize your system characters.
Easily make Transitions and Generate Numbers of any System. By the way this library referres only to **nonnegative integers**.


Ok, Lets See if it meets your requirements.

## Usage
Lets say we want to work with **nonnegative integer** numbers in given character system:
`['a', 'b', 'c']`, well:) Lets create appropriate system:
``` javascript
const sys3 = new NumberSystem([
    'a', 'b', 'c'
], {}, true)
```
You may ask, ok, first argument is obviously number system characters array,
but what do second and third arguments mean?

Well, final argument of all functions( constructors also ) of library
that expect arguments define if to make runtime validations of all previous arguments. So if function expects arguments, their count at least 2, where final is **validate** argument.

What about second argument in **NumberSystem** constructor function. Second argument define some configuration options. Currently theres only one property **options.optimization** which will take one of values:
``` typescript
type OptimizaionMode = 'memoiryOptimized' | 'performanceOptimized'
```
Wee will talk about them later. Now only remember that default value for this option is `performanceOptimized`

Lets continue on our created **sys3** Number System.

In this number system you can create numbers as big as you wish.
e.g.
``` javascript
const nsNumber1 = sys3.Number(1234)
const nsNumber2 = sys3.Number('123456789123456789123456789123456789123456789')
```
Remember that whan you create numbers in current Number System by providing
_js_ number or string representation of number, they will be considered in **decimal** notation.

You can create number by providing valid digits array, where digits are represented by their **powers** in current system and not by their srting representations, i.e. if your system **base** is 3 as in this example, then **maximum power**( bigest digit power ) is **2** and **minimum power**( minimum digit power ) is **0**.

In our example **maximum power 2** corresponds to **'c'** and **minimum power 0** correspondes to **'a'**.
``` javascript
const nsNumber = sys3.Number([ 2, 2, 1, 0, 0 ])

```

Or you can simply convert number from one system to another:
``` javascript
const sys2 = new NumberSystem([
        'O', 'L'
    ])
const sys2Num = sys2.Number(9) // 1001 - in binary system.
const sys3Num = sys3.Number(sys2Num) // converting...
```
Here **power** of **'L'** is **1**, and **power** of **'O'** is **0**.

> NOTE: You cant create Number System of base less than 2.

After you create numbers( by the way wee were call them **nsNumbers** in **tsDocs** ), you can manipulate them as you want.
``` javascript
const sys4 = new NumberSystem([
        'C', 'G', 'P', 'W'
    ])
const sys4Num = sys4.add(sys2Num, sys3Num)
```
As you see above, you can add numbers of two different number systems and retrive result in system, against which you call operation. In this case wee call **add** operation on **sys4**, so we get result in **sys4** Number System regardless of operands systems.
You can also calculate:
``` javascript
const multiply = sys4.multiply(sys2Num, sys3Num) // sys2Num * sys3Num

// If (sys2Num < sys3Num) result will be sys4.Number(0)
const divide = sys4.divide(sys2Num, sys3Num) // sys2Num / sys3Num

const remainder = sys4.remainder(sys2Num, sys3Num) // sys2Num % sys3Num

// if (sys2Num < sys3Num) null will be returned.
const subtract = sys4.subtract(sys2Num, sys3Num) // sys2Num - sys3Num
```
> NOTE: 
> - When using **subtract** method, If _firstArgument_ less than _secondArgument_, result will be **null**.
> - When using **divide** method, If _firstArgument_ less than _secondArgument_, result will be **sys.Number(0)**, where **sys** is Number System on which **divide method** called.

You can also compare numbers.
``` javascript
const numMax = sys2.Number(10)
const numMin = sys3.Number(4)
const numMid = sys4.Number(7)

const numMid3 = sys3.Number(numMid) // numMid converted from sys4 to sys3

sys.lessThan(numMin, numMax) === true
sys.equal(numMid, numMid3) === true
sys.lessThanOrEqual(numMid, numMid3) === true
sys.lessThanOrEqual(numMid, numMax) === true
```

Ok, now what you can do with this numbers?
First of all you can count their digits in Number System you create them.
``` javascript
const nsNumber = sys2.Number(11) // 1011 - in binary format.
nsNumber.countDigits() === 4 // 4 digits in binary system.
```
You can get **power** of digit at appropriate index **( 0 based )** read from left.
``` javascript
nsNumber.getDigit(0) === 1
nsNumber.getDigit(1) === 0
nsNumber.getDigit(2) === 1
nsNumber.getDigit(3) === 1
```

You can construct generater of **digit powers** for current number:
``` javascript
const digPowGen = nsNumber.decDigitsGenerator()
for(const digPow of digPowGen) {
    console.log(digPow)
}
// Will be printed for sys2.Number(11), which is 1011 in binary powers:
// 1
// 0
// 1
// 1
```
Or you can give **optional** arguments:
``` javascript
const digPowGen = nsNumber.decDigitsGenerator({
    startPosition: 1, // default 0
     // By default: _not provided_.
     // i.e. will continue until last reachable digit.
    endPosition: 3,
    accumulator: 1 // default 1
    excludeStartPosition: false, // default false
    excludeEndPosition: false, // default false
})
for(const digPow of digPowGen) {
    console.log(digPow)
}
// Will be printed:
// 0
// 1
// 1
```
You can use **excludeStartPosition** and **excludeEndPosition** to omit
**start** or **end** digit. **End** means that position reached after applying **accumulator** to **startPosition** finite number of times.
So if after latest accumulator application result position is not equal to **endPosition**, digit at position before, will not be omited as **end**.

You can use any **nonnegative integer** as **accumulator** value.

If provided **startPosition** is _greaterOrEqual_ than actual digits count, and it is **monotonously increasing** sequence **( accumulator > 1 )** then as start will be returned **null**, and generator will be stoped. In case of **monotonously decresing** sequence generator will continue until **endPosition** and if digit is not exists, it will return **null** for each.

If provided **startPosition** is _less_ than actual digits count, then until **endPosition** generator will return digits or **null** if they not exists in positions.

You can get string representation of current number.( In its Number System )
``` javascript
const sys2 = new NumberSystem([
        'O', 'L'
    ])
const nsNumber = sys2.Number(11) // 1011 - in binary format.
console.log(nsNumber.toString())
// will be printed:
// LOLL
```

You can also generate Numbers in current Number System:
``` javascript
// In this case generator will work infinitly until you break.
const infiniteGenerator = sys.nsNumberGenerator(sys.Number(10))

const nsNumGen = sys4.nsNumberGenerator(sys2.Number(10), {
    endNsNumber: sys3.Number(99)
})
```
You can use options, they are behave same as digits generator options, although theres no **null** returnes, i.e. If you reached the only limit of not beeing negative, generator will stop.

**_To be continued..._**