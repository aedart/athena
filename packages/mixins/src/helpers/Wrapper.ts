/**
 * Wrapped mixin symbol
 */
export const WRAPPED_MIXIN: unique symbol = Symbol('@aedart/mixins/wrapped-mixin');

/**
 * Wrapper
 */
export default class Wrapper {

    /**
     * Set property of wrapper to given mixin
     *
     * @param {Function} mixin
     * @param {Function} wrapper
     *
     * @return {Function}
     */
    static wrap(mixin: Function, wrapper: Function): Function {
        Object.setPrototypeOf(wrapper, mixin);

        if (!(mixin as any)[WRAPPED_MIXIN]) {
            (mixin as any)[WRAPPED_MIXIN] = mixin;
        }

        return wrapper;
    }

    /**
     * Unwrap given class and return original mixin
     *
     * @param {Function} wrapped
     *
     * @return {Function} Mixin or given class if no mixin was available
     */
    static unwrap(wrapped: Function): Function {
        return (wrapped as any)[WRAPPED_MIXIN] || wrapped;
    }
}
