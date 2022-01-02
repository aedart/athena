import Bare from "./decorators/Bare";
import HasInstance from "./decorators/HasInstance";
import Cached from "./decorators/Cached";
import HasMixin from "./helpers/hasMixin";
import isApplicationOf from "./helpers/isApplicationOf";
import Wrapper from "./helpers/Wrapper";
import Builder from "./Builder";

/**
 * Declare a mixin
 *
 * Example:
 * ```
 * declare((superClass) => class MyMixin extends superClass {
 *    // ... remaining not shown ...
 * });
 * ```
 *
 * @param {Function} mixin
 *
 * @return {Function}
 */
export const declare: Function = (mixin: Function): Function => {
    return Cached(
        HasInstance(
            Bare(mixin)
        )
    );
}

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
const mix: Function = (baseClass: Function = class {}) => new Builder(baseClass);

// Export package methods
export {
    HasMixin,
    isApplicationOf,
    Wrapper,
    Builder
}
export default mix;
