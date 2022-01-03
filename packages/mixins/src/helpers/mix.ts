import Builder from "../Builder";

/**
 * Mix a base class with one or more mixins
 *
 * Example:
 * ```
 * class Knight extends mix(Player).with(
 *     HasSwordMixin,
 *     HasShieldMixin,
 *     HasArmorMixin
 * ) {
 *     // ...remaining not shown...
 * }
 * ```
 *
 * @param {Function} [baseClass] Defaults to empty class when none given
 *
 * @return {Builder}
 */
export default function mix(baseClass: Function = class {}) {
    return new Builder(baseClass);
}
