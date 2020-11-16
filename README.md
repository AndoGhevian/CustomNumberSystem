# CustomNumberSystem

**With This You can flexibly generate strings also**

Welcome to _Customizable Number Systems_ world. You will able to customize your system characters.
Easily make Transitions and Generate Numbers of any System. By the way this library referres only to **nonnegative integers**.

## Usage
lets create binary system. And do some stuff.
```javascript
const { NumberSystem } = require('custom-number-system')

//           Digits Powers:    0    1
const sys = new NumberSystem(['a', 'b'])

const num0 = sys.Number(0) // argument is in decimal form.
const num20 = sys.Number(20) // same as binary - 10100.
const bigNum = sys.Number('12345678901234567890') // big decimal number in argument.
```
Now we have 3 numbers converted from decimal form to our number system.

Lets define another system.
```javascript
//           Digits Powers:     0      1       2
const sys3 = new NumberSystem(['ra', 'ta', 'touille'])

// Same as sys3.Number(num1)
const num0In3 = num0.toSystem(sys3) // Converted from binary system to ternary.
const num15In3 = sys3.Number(15) // digits powers in ternary system - 120
```
**dec**15 = **ternary**120, I think you understand what i mean when i say
_power_ of digits. For **ternary**120 number, **1** is power of first digit,
**2** is power of second and **0** power of final digit, no matter what the digit representation is.

Now lets do some operations agains them.
```javascript
const num4In3 = sys3.Number(4)
const num3 = num20.add(num15In3).remainder(num4In3) //...and son on.
```
We can chain operatons as you see, we add 20 to 15 and calculate remainder of dividing addition result to 4 <=> (20dec + 15dec) % 4dec = 3dec, final result will be in system first number is(In binary system we defined above).

We can also compare _NSNumbers_.
```javascript
const { NSNumber } = require('custom-number-system')

console.log(
    NSNumber.equal(num3, sys3.Number(3)) // true
)
```
No matter if they are in different systems.

You can get string representations of your numbers of course.
```javascript
console.log(
    num0.toString(), // a
    num20.toString(), // babaa
    bigNum.toStrng() // babababbabababaabababaabbaaabbaabbbababbaaabbbbbaaaabababbabaaba
    num0In3.toString() // ra
    // ... and so on
)
```
There is of course exist helper functions, to work with digit powers
of numbers, and for generating numbers in different systems.
For details see **API** Below.

## API
Currently You can find full Api documentation
in **tsdocs**.
### NumberSystem
### NSNumber