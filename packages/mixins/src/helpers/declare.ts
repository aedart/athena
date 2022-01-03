import Cached from "../decorators/Cached";
import HasInstance from "../decorators/HasInstance";
import Bare from "../decorators/Bare";

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
export default function declare(mixin: Function): Function {
    return Cached(
        HasInstance(
            Bare(mixin)
        )
    );
}
