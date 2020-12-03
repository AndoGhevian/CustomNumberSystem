/**
 * Configuration to use when creating _NumberSystems_, or to as as preferred.
 */
export interface IDigitsConfig {
    /**
     * Defines base which is currently used.
     */
    base: number,
    /**
     * Defines maximum allowed _base_ value.
     */
    readonly maxBase: number
    /**
     * This function returns digits of corresponding powers.
     * @param powers - Powers of digits to return in given order.
     * - Each power **MUST** be integer.
     * -Powers until _maxBase_ **MUST** guranty to return valid digit.
     * 
     * NOTE: If _dinamicArity_ is _falsey_, only single argument garanteed to be supported.
     */
    digGen: (...powers: number[]) => (string | undefined)[],
    /**
     * Defines if _digGen_ method supports multiple _power_ arguments.
     * 
     * **Default - _false_**
     */
    readonly dinamicArity?: boolean,
}



// export const HorizontalDirection: ['left', 'right'] = ['left', 'right']
// export const VarticalDirection: ['up', 'down'] = ['up', 'down']
// export const OptimizaionMode: ['memoiryOptimized', 'performanceOptimized'] = ['memoiryOptimized', 'performanceOptimized']

// export type HorizontalDirection = (typeof HorizontalDirection)[number]
// export type VarticalDirection = (typeof VarticalDirection)[number]
// export type OptimizaionMode = (typeof OptimizaionMode)[number]


// // Typescript Custom Utility Types.
// /**
//  * Creates new Interface by requiring _keys_ from **B**.
//  */
// export type RequireFields<T, B extends keyof NonNullable<T>> = Required<
//     Pick<
//         NonNullable<T>, B
//     >
// > & Omit<NonNullable<T>, B>

// /**
//  * Creates new Interface by requiring _keys_ Except keys from **B**.
//  */
// export type RequireExceptFields<T, B extends keyof NonNullable<T>> = Required<
//     Omit<
//         NonNullable<T>, B
//     >
// > & Pick<NonNullable<T>, B>