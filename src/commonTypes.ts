import { NSNumber } from "."

export const HorizontalDirection: ['left', 'right'] = ['left', 'right']
export const VarticalDirection: ['up', 'down'] = ['up', 'down']
export const OptimizaionMode: ['memoiryOptimized', 'performanceOptimized'] = ['memoiryOptimized', 'performanceOptimized']

export type HorizontalDirection = (typeof HorizontalDirection)[number]
export type VarticalDirection = (typeof VarticalDirection)[number]
export type OptimizaionMode = (typeof OptimizaionMode)[number]

/**
 * Creates new Interface by requiring _keys_ from **B**.
 */
export type RequireFields<T, B extends keyof NonNullable<T>> = Required<
    Pick<
        NonNullable<T>, B
    >
> & Omit<NonNullable<T>, B>

/**
 * Creates new Interface by requiring _keys_ from **B**.
 */
export type RequireExceptFields<T, B extends keyof NonNullable<T>> = Required<
    Omit<
        NonNullable<T>, B
    >
> & Pick<NonNullable<T>, B>