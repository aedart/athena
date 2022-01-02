import { APPLIED_MIXIN } from "../decorators/Bare";
import Wrapper from "./Wrapper";

/**
 * Determine if instance is an "application of" (part of) the given mixin
 *
 * @param {Object} instance
 * @param {Function} mixin
 *
 * @return {boolean}
 */
export default function isApplicationOf(instance: Object, mixin: Function): boolean {
    return instance.hasOwnProperty(APPLIED_MIXIN) && (instance as any)[APPLIED_MIXIN] === Wrapper.unwrap(mixin);
}
