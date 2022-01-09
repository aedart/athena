import { hasMixin } from "../helpers";
import { Constructor } from "@aedart/contracts/dist/support";

/**
 * Applies a Symbol.hasInstance method to support "instance of" checks
 *
 * @mixin
 *
 * @template T
 *
 * @param {Function} mixin
 *
 * @return {Constructor<T>}
 */
export default function HasInstance<T>(mixin: Function): Constructor<T> {
    // Abort if mixin already has a "has instance" symbol
    if (mixin.hasOwnProperty(Symbol.hasInstance)) {
        return mixin as Constructor<T>;
    }

    // Set has instance method for mixin
    Object.defineProperty(mixin, Symbol.hasInstance, {
        value: (instance: Object) => {
            return hasMixin(instance, mixin);
        }
    });

    return mixin as Constructor<T>;
}
