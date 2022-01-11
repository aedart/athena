import Cached from "./decorators/Cached";
import HasInstance from "./decorators/HasInstance";
import Bare, { APPLIED_MIXIN } from "./decorators/Bare";
import Wrapper from "./helpers/Wrapper";
import Mixer from "./Mixer";
import MixerContract from "@aedart/contracts/dist/mixins";
import {
    AbstractOrConcreteConstructor, Constructor
} from "@aedart/contracts/dist/support";

/**
 * Mix a base class with one or more mixins
 *
 * @template T
 *
 * Example:
 * ```
 * class Knight extends mix(Player).with(
 *     HasSwordMixin,
 *     HasShieldMixin,
 *     HasArmorMixin
 * ) {
 *     // ...remaining not shown...
 * }
 * ```
 *
 * @param {AbstractOrConcreteConstructor<any>} [baseClass] Defaults to empty class when none is given
 *
 * @return {Mixer<T>}
 */
export function mix<T extends AbstractOrConcreteConstructor<any> = new () => {}>(baseClass: T = class {} as T): MixerContract<T> {
    return new Mixer<T>(baseClass);
}

/**
 * Decorates given mixin with a set of predefined
 * classes.
 *
 * @see Cached
 * @see HasInstance
 * @see Bare
 *
 * Example:
 * ```
 * declare((superClass) => class MyMixin extends superClass {
 *    // ... remaining not shown ...
 * });
 * ```
 *
 * @template T
 *
 * @param {Function} mixin
 *
 * @return {Constructor<T>}
 */
export function decorate<T>(mixin: Function): Constructor<T> {
    return Cached<T>(
        HasInstance<T>(
            Bare<T>(mixin)
        )
    );
}

/**
 * Determine if instance is an "application of" (part of) the given mixin
 *
 * @param {Object} instance
 * @param {Function} mixin
 *
 * @return {boolean}
 */
export function isApplicationOf(instance: Object, mixin: Function): boolean {
    return instance.hasOwnProperty(APPLIED_MIXIN) && (instance as any)[APPLIED_MIXIN] === Wrapper.unwrap(mixin);
}

/**
 * Determine if given instance has mixin
 *
 * @param {Object} instance
 * @param {Function} mixin
 *
 * @return {boolean}
 */
export function hasMixin(instance: Object, mixin: Function): boolean {
    while (instance !== null) {
        if (isApplicationOf(instance, mixin)) {
            return true;
        }

        instance = Object.getPrototypeOf(instance);
    }

    // Nothing found, thus it cannot be an instance of given
    return false;
}
