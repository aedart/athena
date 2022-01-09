import Wrapper from "../helpers/Wrapper";
import { Constructor } from "@aedart/contracts/dist/support";

/**
 * Applied mixin symbol
 */
export const APPLIED_MIXIN: unique symbol = Symbol('@aedart/mixins/applied-mixin');

/**
 * Stores reference to current mixin
 *
 * @mixin
 *
 * @template T
 *
 * @param {Function} mixin
 *
 * @return {Constructor<T>}
 */
export default function Bare<T>(mixin: Function): Constructor<T> {
    return Wrapper.wrap(mixin, (superClass: Function) => {
        // Apply mixin
        const applied = mixin(superClass);

        // Store reference to original mixin
        applied.prototype[APPLIED_MIXIN] = Wrapper.unwrap(mixin);

        return applied;
    }) as Constructor<T>;
}
