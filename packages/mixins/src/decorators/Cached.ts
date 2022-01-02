import Wrapper from "../helpers/Wrapper";

/**
 * Cached mixin reference identifier
 */
export const CACHED_REFERENCE: unique symbol = Symbol('@aedart/mixins/cached-mixin-reference');

/**
 * Prevents already applied mixin is applied more than once
 *
 * @mixin
 *
 * @param {Function} mixin
 *
 * @return {Function}
 */
const Cached = (mixin: Function): Function => Wrapper.wrap(mixin, (superClass: Function) => {
    // Get or create cached reference map
    let cached: Map<Function, Function> | undefined = (superClass as any)[CACHED_REFERENCE];
    if (!cached) {
        cached = (superClass as any)[CACHED_REFERENCE] = new Map<Function, Function>();
    }

    // Get cached mixin, if available
    let decorated: Function | undefined = cached.get(mixin);
    if (!decorated) {
        decorated = mixin(superClass);
        cached.set(mixin, (decorated as Function));
    }

    return decorated;
});

export default Cached;
