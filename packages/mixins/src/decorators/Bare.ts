import Wrapper from "../helpers/Wrapper";

/**
 * Applied mixin symbol
 */
export const APPLIED_MIXIN: unique symbol = Symbol('@aedart/mixins/applied-mixin');

/**
 * Stores reference to current mixin
 *
 * @mixin
 *
 * @param {Function} mixin
 *
 * @return {Function}
 */
const Bare = (mixin: Function): Function => Wrapper.wrap(mixin, (superClass: Function) => {
    // Apply mixin
    const applied = mixin(superClass);

    // Store reference to original mixin
    applied.prototype[APPLIED_MIXIN] = Wrapper.unwrap(mixin);

    return applied;
});

export default Bare;
