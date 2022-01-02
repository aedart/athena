import hasMixin from "../helpers/hasMixin";

/**
 * Applies a Symbol.hasInstance method to support "instance of" checks
 *
 * @mixin
 *
 * @param {Function} mixin
 *
 * @return {Function}
 */
const HasInstance = (mixin: Function): Function => {
    // Abort if mixin already has a "has instance" symbol
    if (mixin.hasOwnProperty(Symbol.hasInstance)) {
        return mixin;
    }

    // Set has instance method for mixin
    Object.defineProperty(mixin, Symbol.hasInstance, {
        value: (instance: Object) => {
            return hasMixin(instance, mixin);
        }
    });

    return mixin;
}

export default HasInstance;
