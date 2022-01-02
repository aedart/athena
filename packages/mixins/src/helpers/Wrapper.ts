import { ClassReference } from "@aedart/contracts/dist/container";

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
     * @param {ClassReference<any>} mixin
     * @param {ClassReference<any>} wrapper
     *
     * @return {ClassReference<any>}
     */
    static wrap(mixin: ClassReference<any>, wrapper: ClassReference<any>): ClassReference<any> {
        Object.setPrototypeOf(wrapper, mixin);

        if (!(mixin as any)[WRAPPED_MIXIN]) {
            (mixin as any)[WRAPPED_MIXIN] = mixin;
        }

        return wrapper;
    }

    /**
     * Unwrap given class and return original mixin
     *
     * @param {ClassReference<any>} wrapped
     *
     * @return {ClassReference<any>} Mixin or given class if no mixin was available
     */
    static unwrap(wrapped: ClassReference<any>): ClassReference<any> {
        return (wrapped as any)[WRAPPED_MIXIN] || wrapped;
    }
}
