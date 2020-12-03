/**
 * Configuration to use when creating _NumberSystems_, or to as as preferred.
 */
export interface IDigitsConfig {
    /**
     * Defines base which is currently used.
     */
    base: number,
    /**
     * Defines maximum allowed _base_ value until which **digGen** guaranty to return _digit_.
     */
    readonly maxBase: number
    /**
     * This function returns digits of corresponding powers.
     * @param powers - Powers of digits to return in given order.
     * - Each power **MUST** be nonnegative integer.
     * - Powers until _maxBase_ **MUST** guranty to return valid digit.
     * 
     * NOTE: If _dinamicArity_ is _falsey_, only single argument garanteed to be supported.
     */
    digGen: (this: IDigitsConfig, ...powers: number[]) => (string | undefined)[],
    /**
     * Defines if _digGen_ method supports multiple _power_ arguments.
     */
    readonly dinamicArity?: boolean,
}