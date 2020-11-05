export const HorizontalDirection: ['left', 'right'] = ['left', 'right']
export const VarticalDirection: ['up', 'down'] = ['up', 'down']
export const OptimizaionMode: ['memoiryOptimized', 'performanceOptimized'] = ['memoiryOptimized', 'performanceOptimized']

export type HorizontalDirection = (typeof HorizontalDirection)[number]
export type VarticalDirection = (typeof VarticalDirection)[number]
export type OptimizaionMode = (typeof OptimizaionMode)[number]


export interface SystemDigitsConfig {
    /**
     * Base of digits system.
     */
    base: number,
    /**
     * Max allowed base of current digits system.
     */
    readonly maxBase: number
    /**
     * Digits generator
     */
    digGen: (...powers: number[]) => (string | undefined)[],
    /**
     * Defines if _digGen_ can accept multiple powers as arguments to return digits for.
     */
    dinamicArity?: boolean,
}


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