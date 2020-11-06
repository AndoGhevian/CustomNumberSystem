export const HorizontalDirection: ['left', 'right'] = ['left', 'right']
export const VarticalDirection: ['up', 'down'] = ['up', 'down']
export const OptimizaionMode: ['memoiryOptimized', 'performanceOptimized'] = ['memoiryOptimized', 'performanceOptimized']

export type HorizontalDirection = (typeof HorizontalDirection)[number]
export type VarticalDirection = (typeof VarticalDirection)[number]
export type OptimizaionMode = (typeof OptimizaionMode)[number]


/**
 * Configuration to use when creating _NumberSystems_ or as preferred.
 */
export interface SystemDigitsConfig {
    /**
     * Defines maximum _power_ for which _digGen_ method is currently garanteed to return _digit_.
     */
    base: number,
    /**
     * Defines maximum allowed _base_ value to change if needed.
     */
    readonly maxBase: number
    /**
     * **NOT VALIDATABLE!!!**
     * 
     * This function returns digits of corresponding powers.
     * @param powers - Powers of digits to return in given order.
     * Each power **MUST** be integer.
     * 
     * NOTE: If _dinamicArity_ is _false_, only single argument garanteed to be supported.
     */
    digGen: (...powers: number[]) => (string | undefined)[],
    /**
     * Defines if _digGen_ method supports multiple _power_ arguments.
     * 
     * **Default - _false_**
     */
    dinamicArity?: boolean,
}




// Typescript Custom Utility Types.
/**
 * Creates new Interface by requiring _keys_ from **B**.
 */
export type RequireFields<T, B extends keyof NonNullable<T>> = Required<
    Pick<
        NonNullable<T>, B
    >
> & Omit<NonNullable<T>, B>

/**
 * Creates new Interface by requiring _keys_ Except keys from **B**.
 */
export type RequireExceptFields<T, B extends keyof NonNullable<T>> = Required<
    Omit<
        NonNullable<T>, B
    >
> & Pick<NonNullable<T>, B>