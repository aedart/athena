import Bare from "./decorators/Bare";
import HasInstance from "./decorators/HasInstance";
import Cached from "./decorators/Cached";
import HasMixin from "./helpers/hasMixin";
import isApplicationOf from "./helpers/isApplicationOf";
import Wrapper from "./helpers/Wrapper";

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

// Export additional utils...
export {
    HasMixin,
    isApplicationOf,
    Wrapper
}
